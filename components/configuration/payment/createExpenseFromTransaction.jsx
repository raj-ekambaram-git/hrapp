import React, { useState } from "react";

import {

    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerOverlay,
    Stack,
    useDisclosure,
    useToast,
    HStack,
    Input,
    Checkbox,
    Select,
    CardHeader,
    CardBody,
    Card,
    Text,
    CardFooter,
    ButtonGroup,
    FormControl,
    FormLabel

  } from '@chakra-ui/react';
  
import { useDispatch, useSelector } from "react-redux";
import { userService, accountService, expenseService } from "../../../services";
import { PaymentConstants } from "../../../constants";
import { CustomTable } from "../../customTable/Table";
import { util } from "../../../helpers";
import { ExpenseTypeLookup } from "../../../data/exponseType";
import { ExpenseEntryStatus, ExpenseStatus, ExpenseTransactionStatus, ProjectStatus } from "@prisma/client";
import { setExpenseEntryFromPayTrans, setExpenseEntryFromPayTransTotal } from "../../../store/modules/Expense/actions";
import { FiUserPlus } from "react-icons/fi";
import { Spinner } from '../../common/spinner'

const CreateExpenseFromTransaction = (props) => {
    const dispatch = useDispatch();
    const toast = useToast();

    const [size, setSize] = useState('');
    const [loading, setLoading] = useState(false);
    const [expenseList, setExpenseList] = useState([]);
    const [expenseName, setExpenseName] = useState();
    // const [expenseTotal, setExpenseTotal] = useState(0);
    const [accountUserList, setAccountUserList] = useState();
    const [userProjectList, setUserProjectList] = useState();
    const [expenseProjectId, setExpenseProjectId] = useState();
    const [expenseUserId, setExpenseUserId] = useState();
    const [disableAddEntry, setDisableAddEntry] = useState(false);
    const [expenseEntryType, setExpenseEntryType] = useState();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const EXPENSE_LIST_TABLE_COLUMNS = React.useMemo(() => PaymentConstants.NEW_EXPENSE_LIST_TABLE_META)
    const expenseEntriesFromPayTrans = useSelector(state => state.expense.paymentTransactions.expenseEntryFromPayTran);
    const expenseTotal = useSelector(state => state.expense.paymentTransactions.expenseEntryTotal);


    const getAccountUsers = async() => {
        setLoading(true)
        const responseData = await accountService.getAdminUserList(userService.getAccountDetails().accountId)
        setAccountUserList(responseData)
        setLoading(false)
    }

    const getProjectForUser = async(userId) => {
        if(userId) {
            setLoading(true)
            setExpenseUserId(userId)
            const projectsForUserResponse = await userService.getProjectsByUser(userId, userService.getAccountDetails().accountId, "Admins");    
            setUserProjectList(projectsForUserResponse);
            setLoading(false)    
        } else {
            setExpenseUserId(null)
            setUserProjectList(null);
        }
      }

    const addToNewExpense = async(newSize, isChecked) => {        
        if(isChecked) {
            setSize(newSize);
            onOpen();      
            populateExpenseListForDisplay(expenseEntriesFromPayTrans)  
        } else {
            if(props.transactionId && props.transactionAmount) {
                const newExpenseList = [...expenseEntriesFromPayTrans]
                //Remove taht id from the list
                const expenseListIdByIndex = newExpenseList.findIndex(x => x.notes === props.transactionId);
                newExpenseList.splice(expenseListIdByIndex, 1);
                dispatch(setExpenseEntryFromPayTrans(newExpenseList))
                populateExpenseListForDisplay(newExpenseList)
                setExpenseEntryType(null);
                if(expenseTotal) {
                    dispatch(setExpenseEntryFromPayTransTotal(parseFloat(expenseTotal)-parseFloat(props.transactionAmount)))                    
                }
            } 
        }
      }

      const populateExpenseListForDisplay = (responseData) => {          

        const transactionList =  responseData.map((transaction, index)=> {
            return transaction;
        });
        setExpenseList(transactionList)
      }

      const handleAddTransactionToExpense = () => {
        
        if(props.transactionId && props.transactionAmount && expenseEntryType) {
            const expenseEntry = {
                status: ExpenseEntryStatus.Approved,
                type: expenseEntryType,
                amount: props.transactionAmount,
                billable: false,
                notes: props.transactionId,
                expenseDate: new Date(props.transactionDate).toISOString(),
                date: new Date(props.transactionDate).toISOString(),
            }

            const newExpenseList = [...expenseEntriesFromPayTrans]
            newExpenseList.push(expenseEntry)   
            dispatch(setExpenseEntryFromPayTrans(newExpenseList))
            populateExpenseListForDisplay(newExpenseList)
            setExpenseEntryType(null);
            setDisableAddEntry(true)
            if(expenseTotal) {
                dispatch(setExpenseEntryFromPayTransTotal(parseFloat(expenseTotal)+parseFloat(props.transactionAmount)))                    
            } else {
                dispatch(setExpenseEntryFromPayTransTotal(parseFloat(props.transactionAmount)))                    
            }
        } else {
            toast({
                title: 'Create Expense Error.',
                description: 'Not able to create expense, plrease try again or contact administrator. Please make sure all the fields are entered.',
                status: 'error',
                position: 'top',
                duration: 6000,
                isClosable: true,
              })
              return;
        }
        
        
      }

      const addMoreTransactionToExpense = () => {
        setExpenseEntryType(null);
        onClose();        
      }

      const submitExpenseFromTransactions = async() => {

        if(expenseName && expenseProjectId && expenseUserId) {

            try {

                const expenseTransaction = {
                    amount: expenseTotal,
                    transactionId: "From Payment Transaction1",
                    transactionData: "From Payment Transaction1",
                    externalTransactionID: ["1","2"],
                    status: ExpenseTransactionStatus.Paid
                }
                const expenseRequest = {
                  projectId: parseInt(expenseProjectId),
                  name: expenseName,
                  approvedById: parseInt(expenseUserId),
                  approvedDate: new Date().toISOString(),
                  billable: false,
                  total: expenseTotal,
                  paidAmount: expenseTotal,
                  status: ExpenseStatus.Paid,
                  userId: parseInt(expenseUserId),
                  expenseEntries: {
                    create: [...expenseEntriesFromPayTrans]
                  },
                  expenseTransaction: {
                    create: [expenseTransaction]
                  }
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
                //   router.push("/account/user/expenses");
                  
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
              toast({
                title: 'Expense Error.',
                description: 'Not able to create expense, plrease try again or contact administrator. Details:'+error,
                status: 'error',
                position: 'top',
                duration: 6000,
                isClosable: true,
              })
            }
        } else {
            toast({
                title: 'Create Expense Error.',
                description: "Please enter name, user and project and try again.",
                status: 'error',
                position: 'top',
                duration: 6000,
                isClosable: true,
              })
              return;
        }

      }

    return (
        <>
          <Checkbox onChange={(e) => addToNewExpense("xxl",e.target.checked)} />

          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            Attach Expense Transction
                        </DrawerHeader>
                        <DrawerBody>
                        {loading?<><Spinner/></>:<></>}
                          <Stack spacing={5} marginTop={9}>
                            <Card variant="paymentTransactions">
                                <CardHeader>
                                    Transaction Detail
                                </CardHeader>
                                <CardBody>
                                    <Stack spacing={5}>
                                        <HStack spacing={3}>
                                            <Box textAlign="right" width="15%">
                                                Transaction ID
                                            </Box>
                                            <Box textAlign="left" fontWeight="600">
                                                {props.transactionId}
                                            </Box>                                    
                                        </HStack>
                                        <HStack spacing={3}>
                                            <Box textAlign="right" width="15%">
                                                Transaction Date
                                            </Box>
                                            <Box textAlign="left" fontWeight="600">
                                                {props.transactionDate}
                                            </Box>
                                        </HStack>                                        
                                        <HStack spacing={3}>
                                            <Box textAlign="right" width="15%">
                                                Amount
                                            </Box>
                                            <Box textAlign="left" fontWeight="600">
                                                <Text color={props.transactionAmount>0?"pending_status":"paid_status"}>
                                                    {util.getWithCurrency(props.transactionAmount)}
                                                </Text>
                                                
                                            </Box>
                                        </HStack>
                                        <HStack spacing={3}>
                                            <Box textAlign="right" width="15%">
                                                Expense Type
                                            </Box>
                                            <Box textAlign="left" fontWeight="600">
                                                <Select id="type" onChange={(ev) => setExpenseEntryType(ev.target.value)}>
                                                    <option value="">Select Expense</option>
                                                    {ExpenseTypeLookup.map((expenseType) => (
                                                        <>
                                                        {((userService.isAccountAdmin() && expenseType.typeId === "Resource_Cost")
                                                        || (expenseType.typeId != "Resource_Cost"))?<option value={expenseType.typeId} >{expenseType.typeName}</option>:""}                                
                                                        </>
                                                    ))}
                                                </Select>  
                                                
                                            </Box>
                                        </HStack>                                        
                                    </Stack>
                                </CardBody>
                                <CardFooter>
                                    <ButtonGroup size='sm' spacing={4}>
                                        <Button colorScheme='yellow' size="xs" onClick={addMoreTransactionToExpense} >Cancel</Button>
                                        <Button bgColor="header_actions" size="xs" onClick={addMoreTransactionToExpense} >Add More</Button>
                                        {disableAddEntry?<></>:<>
                                            <Button colorScheme='red' size="xs" onClick={handleAddTransactionToExpense}>Add</Button>                                        
                                        </>}                                        
                                    </ButtonGroup>

                                </CardFooter>
                            </Card>
                            {expenseEntriesFromPayTrans && expenseEntriesFromPayTrans.length >0?<>
                                <Stack spacing={5}>
                                    <HStack spacing={10}>
                                        <Box width="25%">
                                            <FormControl isRequired>
                                                <FormLabel>Name</FormLabel>
                                                <Input type="text" id="expenseName"   onChange={(ev) => setExpenseName(ev.target.value)}/>
                                            </FormControl>    
                                        </Box>
                                        <Box>
                                        <FormControl isRequired>
                                            <FormLabel>User</FormLabel>                                            
                                            <HStack>                                                
                                                {accountUserList?<>
                                                    <Select id="projectId" value={expenseUserId} onChange={(ev) => getProjectForUser(ev.target.value)}>
                                                        <option value="">Select User</option>
                                                        {accountUserList?.map((accountUser) => (
                                                            <option value={accountUser.id} >{accountUser.firstName} - {accountUser.lastName}</option>
                                                        ))}
                                                    </Select>                                              
                                                </>:<>
                                                    <FiUserPlus size={30} onClick={getAccountUsers}/>
                                                </>}                                                
                                            </HStack>         
                                        </FormControl>     
                                        </Box> 
                                        {userProjectList?<>
                                        <Box>
                                            <FormControl isRequired>
                                                <FormLabel>Project</FormLabel>
                                                <Select id="projectId" value={expenseProjectId} onChange={(ev) => setExpenseProjectId(ev.target.value)}>
                                                    <option value="">Select Project</option>
                                                    {userProjectList?.map((project) => (
                                                        {...project.project?.status === ProjectStatus.Open?(<>
                                                        <option value={project.project?.id} >{project.project?.name} - {project.project?.referenceCode} - {project.billable?"Billable":"Non-Billable"}</option>
                                                        </>):(<></>)}
                                                    ))}
                                                </Select>  
                                            </FormControl>   
                                        </Box>                                           
                                        </>:<></>}                                                                                                            
                                    </HStack>                                                                         
                                    <Button bgColor="header_actions"  width="15%" size="xs" onClick={submitExpenseFromTransactions} >Create Expense</Button>
                                </Stack>                                
                            </>:<></>}
                            <CustomTable columns={EXPENSE_LIST_TABLE_COLUMNS} rows={expenseEntriesFromPayTrans} />        
                            <Box>
                                Total: {util.getWithCurrency(expenseTotal)}
                            </Box>
                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
           </Drawer>                      
        </>
    );
};

export default CreateExpenseFromTransaction;