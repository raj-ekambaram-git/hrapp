import { CheckCircleIcon, DeleteIcon } from "@chakra-ui/icons";
import { Input, Box, Card, CardBody, CardHeader, Stack, useToast, Text, Select, HStack, Checkbox, Table, Thead, Tr, Th, Tbody, Button, Tooltip, useDisclosure, Popover, PopoverContent, PopoverHeader, PopoverArrow, PopoverCloseButton, PopoverFooter, PopoverBody, ButtonGroup } from "@chakra-ui/react";
import { ExpenseType } from "@prisma/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EMPTY_STRING, ExpenseConstants } from "../../constants";
import { ErrorMessage } from "../../constants/errorMessage";
import { ExpenseTypeLookup } from "../../data/exponseType";
import { util } from "../../helpers/util";
import { expenseService, userService } from "../../services";
import {setExpenseEntries, setExpenseHeader} from '../../store/modules/Expense/actions';
import DatePicker from "../common/datePicker";
import { ShowInlineErrorMessage } from "../common/showInlineErrorMessage";
import ExpenseEntryAttachment from "./expenseEntryAttachment";
import ExpenseHeader from "./expenseHeader";
import ExpenseNotes from "./expenseNotes";
import ResourceListWithCost from "./resourceListWithCost";





const ExpenseEntry = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onToggle, onClose } = useDisclosure()

  const [isAddMode, setAddMode] = useState(true);
  const [expenseStatus, setExpenseStatus] = useState(EMPTY_STRING);
  const [showErrorMessage, setShowErrorMessage] = useState(EMPTY_STRING);
  const [showBillable, setShowBillable] = useState(true);
  const [userProjectList, setUserProjectList] = useState([]);
  const [projectResourceList, setProjectResourceList] = useState([]);
  const [expenseTotal, setExpenseTotal] = useState(0);
  
  const userId = props.data.userId;
  const expenseEntries = useSelector(state => state.expense.expenseEntries);
  const expenseHeader = useSelector(state => state.expense.expenseHeader);

  useEffect(() => {
    console.log("props.data.isAddMode:::"+JSON.stringify(props))
    if(userService.isAccountAdmin() || userService.isSuperAdmin() || userService.isManager()) {
      getProjectForUser(userId);
    }else if(userService.isTimesheetEntryUser()) {
      // getProjectForUser(userService.getAccountDetails().accountId);
      getProjectForUser(userId);
    }
    setAddMode(props.data.isAddMode);
    getExpenseDetails();

  }, []);

  function submitExpense(status) {
    return isAddMode
    ? createExpense(status)
    : updateExpense(status);
  }

  const createExpense = async (status) => {
    try {

        const expenseRequest = {
          projectId: parseInt(expenseHeader.projectId.toString()),
          name: expenseHeader.name,
          description: expenseHeader.description,
          billable: expenseHeader.billable,
          total: expenseTotal,
          status: status,
          userId: parseInt(userService.userValue.id),
          expenseEntries: {
            create: expenseEntries
          },
        }
        const responseData = await expenseService.createExpense(expenseRequest);
        if(!responseData.error) {
          toast({
            title: 'New Expense.',
            description: 'Successfully added new expense.',
            status: 'success',
            position: 'top',
            duration: 3000,
            isClosable: true,
          })
          router.push("/account/user/expenses");
          
        }else {
          toast({
            title: 'Expense Error.',
            description: 'Not able to create expense, plrease try again or contact administrator. Please make sure all the fields are entered, Details:'+responseData.errorMessage,
            status: 'error',
            position: 'top',
            duration: 6000,
            isClosable: true,
          })
        }
    } catch (error) {
      console.log("ERRRROORRRR:"+error)
      toast({
        title: 'Expense Error.',
        description: 'Not able to create expense, plrease try again or contact administrator. Details:'+error,
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
    }
  };

  const updateExpense = async (status) => {
    try {

        const expenseRequest = {
          id: props.data.expenseId,
          projectId: parseInt(expenseHeader.projectId.toString()),
          name: expenseHeader.name,
          description: expenseHeader.description,
          billable: expenseHeader.billable,
          total: expenseTotal,
          status: status,
          userId: parseInt(userService.userValue.id),
        }
        const responseData = await expenseService.updateExpense(expenseRequest, expenseEntries);
        if(!responseData.error) {
          toast({
            title: 'New Expense.',
            description: 'Successfully added new expense.',
            status: 'success',
            position: 'top',
            duration: 3000,
            isClosable: true,
          })
          router.push("/account/user/expenses");
          
        }else {
          toast({
            title: 'Expense Error.',
            description: 'Not able to create expense, plrease try again or contact administrator. Please make sure all the fields are entered, Details:'+responseData.errorMessage,
            status: 'error',
            position: 'top',
            duration: 6000,
            isClosable: true,
          })
        }
    } catch (error) {
      console.log("ERRRROORRRR:"+error)
      toast({
        title: 'Expense Error.',
        description: 'Not able to create expense, plrease try again or contact administrator. Details:'+error,
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
    }
  };
  
  async function getProjectForUser(userId) {
    const projectsForUserResponse = await userService.getProjectsByUser(userId, userService.getAccountDetails().accountId, "billable");    
    setUserProjectList(projectsForUserResponse);
  }

  async function getExpenseDetails() {
    // Call only if the user is SUPER_ADMIN and accountId as zero
    if((userService.isAccountAdmin() || userService.isSuperAdmin() || userService.isTimesheetEntryUser() || userService.isManager()) 
          && (props && props.data && !props.data.isAddMode)) { // This is for EDIT 
            const expenseResponse = await expenseService.getExpenseDetails(props.data.expenseId, userService.getAccountDetails().accountId);
            dispatch(setExpenseEntries(expenseResponse.expenseEntries))
            delete expenseResponse["expenseEntries"]
            setExpenseTotal(expenseResponse.total)
            setExpenseStatus(expenseResponse.status)
            dispatch(setExpenseHeader(expenseResponse))

    }
  }

  function addExpenseEntry() {
    const inputData = [...expenseEntries];
    inputData.push({...ExpenseConstants.EXPENSE_ENYTY_DEFAULT_RECORD});
    dispatch(setExpenseEntries(inputData))
  }

  function deleteExpenseEntry(removeIndex) {
    const deletingAmount = expenseEntries[removeIndex].amount;
    setExpenseTotal(util.getZeroPriceForNull(expenseTotal)-util.getZeroPriceForNull(deletingAmount))
    const newEntriesData = [...expenseEntries];
    newEntriesData.splice(removeIndex, 1);
    dispatch(setExpenseEntries(newEntriesData))
  }

  function handleExpenseAmount(index, origVal, newValue) {

    if(origVal != undefined && origVal != EMPTY_STRING) {
      setExpenseTotal((util.getZeroPriceForNull(expenseTotal)-util.getZeroPriceForNull(origVal))+util.getZeroPriceForNull(newValue))
    }else{
      setExpenseTotal((util.getZeroPriceForNull(expenseTotal))+util.getZeroPriceForNull(newValue))
    }
    handleExpenseEntry(index,"amount", newValue)
  }

  function handleExpenseEntry(index, name, value) {
    const newExpenseEntries = [...expenseEntries]
    switch(name) {
      case("date"): 
        value= new Date(value)
        break;
      case("type"): 
        if(value === ExpenseType.Resource_Cost) {
          setShowBillable(false)
          if(expenseHeader.projectId) {
            // console.log("userProjectList:::"+JSON.stringify(userProjectList))
            const projectResources = userProjectList.filter((project) => (project.projectId == expenseHeader.projectId));
            console.log("Project Resource List:::"+JSON.stringify(projectResources[0].project?.projectResource))
            if(projectResources[0].project?.projectResource && projectResources[0].project?.projectResource?.length>1) {
              setProjectResourceList(projectResources[0].project?.projectResource)              
              onToggle()
            }else {
              setShowErrorMessage(ErrorMessage.SELECT_RESOURCE_COST_ERROR)
            }
            
          }else {
            value= EMPTY_STRING
            setShowErrorMessage(ErrorMessage.SELECT_PROJECT_BEFORE_EXPENSE_ENTRY)
          }
        }else {
          setShowBillable(true)
        }
      break;        
    }

    newExpenseEntries[index][name] = value;
    dispatch(setExpenseEntries(newExpenseEntries))
  }


  function handleDate(e) {
    if(e != undefined && (e.updatedDate)) {
      const expenseEntry = [...expenseEntries]
      if(util.getFormattedDate(expenseEntry[e.rowIndex].date) != util.getFormattedDate(e.date)) {
        expenseEntry[e.rowIndex].expenseDate = e.date;
        handleExpenseEntry(e.rowIndex,"date",util.getFormattedDate(e.date))
        dispatch(setExpenseEntries(expenseEntry))
      }
      
    }
    
  }

  const handleUserSelecction = (selectedUserId) => {
    console.log("handleUserSelecction:::"+selectedUserId)
  }
  

  return (
    <div>
      <Stack>
        <ShowInlineErrorMessage showErrorMessage={showErrorMessage}/>
        <ExpenseHeader submitExpense={submitExpense} isAddMode={isAddMode} userProjectList={userProjectList} status={expenseStatus}/>
        <Card variant="expenseDetails">
          <CardHeader>
            <Box>
              <Text>
                Expenses
              </Text>
            </Box>
          </CardHeader>
          <CardBody>
                <Table>
                  <Thead>
                    <Tr>
                      <Th></Th>                      
                      <Th>
                         Expense Type
                      </Th>
                      <Th>
                         Billable
                      </Th>             
                      <Th>
                         Date
                      </Th>             
                      <Th>
                         Amount
                      </Th>             
                      <Th>
                         Notes / Files
                      </Th>             
                    </Tr>
                  </Thead>
                  <Tbody>
                  {expenseEntries?.map((expenseEntry, index) => (
                    <Tr>
                        <Th>
                          {(expenseEntry.status != ExpenseConstants.EXPENSE_STATUS.Approved && expenseEntry.status != ExpenseConstants.EXPENSE_STATUS.Invoiced) ? <DeleteIcon boxSize={4} onClick={() => deleteExpenseEntry(index)}/> : <CheckCircleIcon boxSize={4} color="header_actions"/>}
                        </Th>
                        <Th>
                        <Select id="type" value={expenseEntry.type} onChange={(ev) => handleExpenseEntry(index,"type",ev.target.value)}>
                            <option value="">Select Expense</option>
                            {ExpenseTypeLookup.map((expenseType) => (
                                <>
                                {((userService.isAccountAdmin() && expenseType.typeId === "Resource_Cost")
                                || (expenseType.typeId != "Resource_Cost"))?<option value={expenseType.typeId} >{expenseType.typeName}</option>:""}                                
                                </>
                            ))}
                        </Select>    
                        <Popover
                            returnFocusOnClose={true}
                            isOpen={isOpen}
                            onClose={onClose}
                            closeOnBlur={false}
                        >
                            <PopoverContent>
                              <PopoverBody>
                                  <ResourceListWithCost resourceListWithCost={projectResourceList} handleUserSelecction={handleUserSelecction} />
                              </PopoverBody>
                              <PopoverFooter display='flex' justifyContent='flex-end'>
                                  <ButtonGroup size='sm'>
                                  <Button variant='outline'  onClick={onClose} >Cancel</Button>
                                  <Button colorScheme='red' onClick={onClose}>Apply</Button>
                                  </ButtonGroup>
                              </PopoverFooter>
                            </PopoverContent>
                        </Popover>                                                  
                        </Th>             
                        <Th>
                          {(expenseEntry.type != ExpenseType.Resource_Cost && showBillable)?(<>
                            <Checkbox
                              isChecked={expenseEntry.billable}
                              onChange={(e) => handleExpenseEntry(index,"billable",e.target.checked)}
                            />    
                          </>):(<></>)}
                        </Th>             
                        <Th>
                          <HStack>
                            <Input type="text" id="expenseDate" value={util.getFormattedDate(expenseEntry.expenseDate)} />
                            <DatePicker onChange={handleDate} rowIndex={index}/> 
                          </HStack>                          
                        </Th>             
                        <Th>
                          <Input type="number" id="amount"  value={expenseEntry.amount} onChange={(ev) => handleExpenseAmount(index, expenseEntry.amount,ev.target.value)}/>
                        </Th>  
                        <Th>
                          <HStack spacing={5}>
                            <Tooltip label={expenseEntry.notes}>
                              <ExpenseNotes handleExpenseEntry={handleExpenseEntry} notes={expenseEntry.notes} rowIndex={index}/>
                            </Tooltip>      
                              {!isAddMode && (expenseEntry.id)? (<ExpenseEntryAttachment index={index} handleExpenseEntry={handleExpenseEntry} attachments={expenseEntry.attachments} expenseId={props.data.expenseId} expenseEntryId={expenseEntry.id}/>) : (<></>)}                                                 
                          </HStack>
                        </Th>           
                      </Tr>     
                    ))}     
                    <Tr bgColor="table_tile" >
                      <Th colSpan={3}></Th>                      
                      <Th textAlign="right" fontWeight="bold">Total: </Th>
                      <Th colSpan={2}>
                         $ {expenseTotal?expenseTotal:0}
                      </Th>             
                    </Tr>                              
                  </Tbody>
                </Table>
                <HStack marginTop="3rem">
                    <Box>
                        <Button size="xs" bgColor="header_actions"  onClick={() => addExpenseEntry()}>
                            Add Entry
                        </Button>
                    </Box>
                </HStack>                
          </CardBody>
        </Card>
      </Stack>
    </div>

  );
};

export default ExpenseEntry;
