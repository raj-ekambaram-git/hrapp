import { DeleteIcon } from "@chakra-ui/icons";
import { Input, Box, Card, CardBody, CardHeader, Stack, useToast, Text, Select, HStack, Checkbox, Table, Thead, Tr, Th, Tbody, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EMPTY_STRING, ExpenseConstants } from "../../constants";
import { util } from "../../helpers/util";
import { expenseService, userService } from "../../services";
import {setExpenseEntries} from '../../store/modules/Expense/actions';
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
  const [projectId, setProjectId] = useState(EMPTY_STRING);
  const [billable, setBillable] = useState(false);
  const [name, setName] = useState(EMPTY_STRING);
  const [description, setDescription] = useState(EMPTY_STRING);
  const userId = props.data.userId;
  const expenseProjectId = useSelector(state => state.expense.projectId);
  const expenseEntries = useSelector(state => state.expense.expenseEntries);

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
    ? createExpense()
    : updateExpense();
  }

  const createExpense = async () => {
    try {

        const expenseRequest = {
          projectId: parseInt(projectId.toString()),
          name: name,
          description: description,
          billable: billable,
          total: "100",
          status: "Draft",
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
          router.push("/expenses");
          
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

  async function updateExpense() {
    // props.data.expenseId
  }
  
  async function getProjectForUser(userId) {
    const projectsForUserResponse = await userService.getProjectsByUser(userId, userService.getAccountDetails().accountId);    
    setUserProjectList(projectsForUserResponse);
  }

  async function getExpenseDetails() {
    // Call only if the user is SUPER_ADMIN and accountId as zero
    if((userService.isAccountAdmin() || userService.isSuperAdmin() || userService.isTimesheetEntryUser() || userService.isManager()) 
          && (props && props.data && !props.data.isAddMode)) { // This is for EDIT 
            const expenseResponse = await expenseService.getExpenseDetails(props.data.expenseId, userService.getAccountDetails().accountId);
            dispatch(setExpenseEntries(expenseResponse))
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
    if(name == "date") {
      value= new Date(value)
    }
    newExpenseEntries[index][name] = value;
    dispatch(setExpenseEntries(newExpenseEntries))
  }


  function handleDate(e) {
    console.log("handleDate::"+JSON.stringify(e))
    if(e != undefined && (e.updatedDate)) {
      // handleExpenseEntry(e.rowIndex,"date",util.getFormattedDate(e.date));
      
    }
  }


  return (
    <div>
      <Stack>
        <ExpenseHeader setProjectId={setProjectId} setName={setName} submitExpense={submitExpense} isAddMode={isAddMode} userProjectList={userProjectList} expenseProjectId={expenseProjectId} setBillable={setBillable} setDescription={setDescription}/>
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
                              onChange={(e) => handleExpenseEntry(index,"billable",e.target.checked)}
                            />    
                        </Th>             
                        <Th>
                          <HStack>
                            <Input type="text" id="date"  onChange={(ev) => handleExpenseEntry(index,"date",ev.target.value)}/>
                            {/* <DatePicker onChange={handleDate} rowIndex={index}/>  */}
                          </HStack>                          
                        </Th>             
                        <Th>
                          <Input type="number" id="amount"  value={expenseEntry.amount} onChange={(ev) => handleExpenseEntry(index,"amount",ev.target.value)}/>
                        </Th>  
                        <Th>
                           <ExpenseNotes handleExpenseEntry={handleExpenseEntry} rowIndex={index}/>
                        </Th>           
                      </Tr>     
                    ))}               
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
