import { CheckCircleIcon, DeleteIcon } from "@chakra-ui/icons";
import { Input, Box, Card, CardBody, CardHeader, Stack, useToast, Text, Select, HStack, Checkbox, Table, Thead, Tr, Th, Tbody, Button, Tooltip } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EMPTY_STRING, ExpenseConstants } from "../../constants";
import { util } from "../../helpers/util";
import { expenseService, userService } from "../../services";
import {setExpenseEntries, setExpenseHeader} from '../../store/modules/Expense/actions';
import DatePicker from "../common/datePicker";
import ExpenseAttachment from "./expenseAttachment";
import ExpenseHeader from "./expenseHeader";
import ExpenseNotes from "./expenseNotes";




const ExpenseEntry = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useToast();

  const [isAddMode, setAddMode] = useState(true);
  const [expenseStatus, setExpenseStatus] = useState(EMPTY_STRING);
  const [showProjectError, setShowProjectError] = useState(false);
  const [userProjectList, setUserProjectList] = useState([]);
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
    const projectsForUserResponse = await userService.getProjectsByUser(userId, userService.getAccountDetails().accountId);    
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
  

  return (
    <div>
      <Stack>
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
                          {(expenseEntry.status != ExpenseConstants.EXPENSE_STATUS.Approved && expenseEntry.status != ExpenseConstants.EXPENSE_STATUS.Invoiced) ? <DeleteIcon boxSize={4} onClick={() => deleteExpenseEntry(index)}/> : <CheckCircleIcon color="header_actions"/>}
                        </Th>
                        <Th>
                        <Select id="type" value={expenseEntry.type} onChange={(ev) => handleExpenseEntry(index,"type",ev.target.value)}>
                            <option value="">Select Expense</option>
                            {ExpenseConstants.EXPENSE_TYPE?.map((expenseType) => (
                                <option value={expenseType.typeId} >{expenseType.typeName}</option>
                            ))}
                        </Select>                           
                        </Th>             
                        <Th>
                          <Checkbox
                              isChecked={expenseEntry.billable}
                              onChange={(e) => handleExpenseEntry(index,"billable",e.target.checked)}
                            />    
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
                              {isAddMode ? (<></>) : (<ExpenseAttachment/>)}                                                 
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
                        <Button className="btn" onClick={() => addExpenseEntry()}>
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
