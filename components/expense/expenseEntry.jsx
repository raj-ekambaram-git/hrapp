import { DeleteIcon } from "@chakra-ui/icons";
import { Input, Box, Card, CardBody, CardHeader, Stack, useToast, Text, Select, HStack, Checkbox, Table, Thead, Tr, Th, Tbody, Button, Tooltip } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EMPTY_STRING, ExpenseConstants } from "../../constants";
import { util } from "../../helpers/util";
import { expenseService, userService } from "../../services";
import {setExpenseEntries, setExpenseHeader} from '../../store/modules/Expense/actions';
import DatePicker from "../common/datePicker";
import ExpenseHeader from "./expenseHeader";
import ExpenseNotes from "./expenseNotes";



const ExpenseEntry = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useToast();

  const [isAddMode, setAddMode] = useState(true);
  const [showProjectError, setShowProjectError] = useState(false);
  const [userProjectList, setUserProjectList] = useState([]);

  const userId = props.data.userId;
  const expenseEntries = useSelector(state => state.expense.expenseEntries);
  const expenseHeader = useSelector(state => state.expense.expenseHeader);

  useEffect(() => {

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
          total: "100",
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
            description: 'Not able to create expense, plrease try again or contact administrator.',
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
          total: "200",
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
            description: 'Not able to create expense, plrease try again or contact administrator.',
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
            console.log("expenseResponse::"+JSON.stringify(expenseResponse))
            dispatch(setExpenseHeader(expenseResponse))

    }
  }

  function addExpenseEntry() {
    const inputData = [...expenseEntries];
    inputData.push({...ExpenseConstants.EXPENSE_ENYTY_DEFAULT_RECORD});
    dispatch(setExpenseEntries(inputData))
  }

  function handleExpenseEntry(index, name, value) {
    console.log("MMMMMM")
    const newExpenseEntries = [...expenseEntries]
    if(name == "expenseDate") {
      value= new Date(value)
    }
    newExpenseEntries[index][name] = value;
    dispatch(setExpenseEntries(newExpenseEntries))
  }


  function handleDate(e) {
    console.log("handleDate::"+JSON.stringify(e))
    console.log("Selevted Index :::"+e.rowIndex)
    if(e != undefined && (e.updatedDate)) {
      const expenseEntry = [...expenseEntries]
      // handleExpenseEntry(e.rowIndex,"date",util.getFormattedDate(e.date));
      console.log("expenseEntry[e.rowIndex]:::"+expenseEntry[e.rowIndex])
      expenseEntry[e.rowIndex].date = util.getFormattedDate(e.date);
      console.log("expenseEntry:::"+JSON.stringify(expenseEntry[e.rowIndex]))
    }
    
  }
  

  return (
    <div>
      <Stack>
        <ExpenseHeader submitExpense={submitExpense} isAddMode={isAddMode} userProjectList={userProjectList}/>
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
                         Notes
                      </Th>             
                    </Tr>
                  </Thead>
                  <Tbody>
                  {expenseEntries?.map((expenseEntry, index) => (
                    <Tr>
                        <Th>
                          <DeleteIcon/>
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
                          <Input type="number" id="amount"  value={expenseEntry.amount} onChange={(ev) => handleExpenseEntry(index,"amount",ev.target.value)}/>
                        </Th>  
                        <Th>
                           <Tooltip label={expenseEntry.notes}>
                           <ExpenseNotes handleExpenseEntry={handleExpenseEntry} notes={expenseEntry.notes} rowIndex={index}/>
                           </Tooltip>                           
                        </Th>           
                      </Tr>     
                    ))}     
                    <Tr bgColor="table_tile" >
                      <Th colSpan={3}></Th>                      
                      <Th textAlign="right" fontWeight="bold">Total: </Th>
                      <Th colSpan={2}>
                         $
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
