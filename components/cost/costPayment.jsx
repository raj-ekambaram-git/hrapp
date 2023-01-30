
import {
    Box,
    Stack,
    Flex,
    Button,
    useDisclosure,
    useToast,
    Drawer,
    DrawerContent,
    DrawerOverlay,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    FormControl,
    FormLabel,
    Select,
    Checkbox,
    HStack,
    Input,
    Textarea
  } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { COST_CALL_TYPE, EMPTY_STRING, EXPENSE_CALL_TYPE, INVOICE_CALL_TYPE, ProjectConstants, TIMESHEET_STATUS } from '../../constants';
import { ShowInlineErrorMessage } from '../common/showInlineErrorMessage';
import { accountService, expenseService, projectService, userService } from '../../services';
import ProjectTimesheets from '../project/detail/projectTimesheets';
import { ExpenseCategory, ExpenseStatus, ExpenseType, TimesheetStatus } from '@prisma/client';
import { useRef } from 'react';
import { CustomTable } from '../customTable/Table';
import { util } from '../../helpers';
import ProjectTimesheeEntrySection from '../project/detail/projectTimesheeEntrySection';
import { setCostItemList, setCostTotal, setSelectedCostTSEId } from '../../store/modules/Cost/actions';
import { CostItemList } from './costItemList';
import { ErrorMessage } from '../../constants/errorMessage';
import { useRouter } from 'next/router';
  
const CostPayment = (props) => {
    const [size, setSize] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {data} = props;
    const dispatch = useDispatch();
    const toast = useToast();
    const router = useRouter();

    const [isAddMode, setAddMode] = useState(true);
    const [costProjectId, setCostProjectId] = useState();
    const [costName, setCostName] = useState();
    const [costDescription, setCostDescription] = useState(EMPTY_STRING);
    const [costVendorId, setCostVendorId] = useState();
    const [costVendorName, setCostVendorName] = useState();
    const [costProjectName, setCostProjectName] = useState();
    const [addedCostTotal, setAddedCostTotal] = useState();
    const [showErrorMessage, setShowErrorMessage] = useState(EMPTY_STRING);
    const [accountVendorList, setAccountVendorList] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const cstTotal = useSelector(state => state.cost.costTotal);
    const costItemList = useSelector(state => state.cost.costItemList);

    useEffect(() => {
        setShowErrorMessage(EMPTY_STRING);        
        setAddedCostTotal(cstTotal)    
        if(props && !props.isAddMode && props.costId) {            
            setAddMode(false);
            // getCostDetails(props.costId)
        } else {
            getVendorList()
        }
    }, [cstTotal]);


    const getCostDetails = async (costId) => {
        if((userService.isAccountAdmin() || userService.isSuperAdmin() || userService.isTimesheetEntryUser() || userService.isManager()) 
              && (props && !props.isAddMode)) { // This is for EDIT 
                const expenseResponse = await expenseService.getExpenseDetails(costId, userService.getAccountDetails().accountId);
                dispatch(setCostItemList(expenseResponse.expenseEntries))
                dispatch(setCostTotal(expenseResponse.total))
                delete expenseResponse["expenseEntries"]
                setAddedCostTotal(expenseResponse.total)
                setCostName(expenseResponse.name)
                setCostDescription(expenseResponse.description)
                setCostVendorId(expenseResponse.project?.vendorId)
                setCostProjectId(expenseResponse.projectId)
                setCostProjectName(expenseResponse.project?.name)
                setCostVendorName(expenseResponse.project?.vendor?.name)
        }
    }


    const handleProjectSelection = async(selectedProjectId) => {
        setCostProjectId(selectedProjectId)
    }
    
    const getVendorList = async() => {
        const vendorList = await accountService.getVendorList(userService.getAccountDetails().accountId);
        setAccountVendorList(vendorList)
    }

    function handleAddEditCost(newSize) {
        setSize(newSize);
        onOpen();
        if(isAddMode) {
            dispatch(setCostTotal(0));
            dispatch(setCostItemList([]));
            dispatch(setSelectedCostTSEId([]));    
        } else {
            getCostDetails(props.costId)
        }

    }

    async function handleVendorSelection(selectedVendorObj) {
        const projectListResponse = await accountService.getProjectsByVendor(selectedVendorObj, userService.getAccountDetails().accountId);
        setProjectList(projectListResponse);
    } 

    const handleCostSubmit = async () => {
        if(costName == undefined || costName === '') {
            toast({
                title: 'Cost Error.',
                description: 'Please enter cost name to continue.',
                status: 'error',
                position: 'top',
                duration: 6000,
                isClosable: true,
              })
            return;
        }
        return isAddMode
        ? createExpense(ExpenseStatus.Approved)
        : updateExpense(ExpenseStatus.Approved);
    }
    
      const createExpense = async (status) => {
        try {
    
            const expenseRequest = {
              projectId: parseInt(costProjectId),
              category: ExpenseCategory.Cost,
              name: costName,
              description: costDescription,
              billable: true,
              total: addedCostTotal,
              status: status,
              userId: parseInt(userService.userValue.id),
              expenseEntries: {
                create: costItemList
              },
            }
            const responseData = await expenseService.createExpense(expenseRequest);
            if(!responseData.error) {
              toast({
                title: 'New Cost.',
                description: 'Successfully added new cost.',
                status: 'success',
                position: 'top',
                duration: 3000,
                isClosable: true,
              })
              router.push("/account/user/cost");
              
            }else {
              toast({
                title: 'Cost Error.',
                description: 'Not able to create cost, plrease try again or contact administrator. Please make sure all the fields are entered, Details:'+responseData.errorMessage,
                status: 'error',
                position: 'top',
                duration: 6000,
                isClosable: true,
              })
            }
        } catch (error) {
          console.log("ERRRROORRRR:"+error)
          toast({
            title: 'Cost Error.',
            description: 'Not able to create cost, plrease try again or contact administrator. Details:'+error,
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
      
    return (
        <div>
        <Flex marginBottom="1rem" borderRadius="lg" alignSelf="center">
            <Button size="xs" bgColor="header_actions" 
                onClick={() => handleAddEditCost("xxl")}
                key="xl"
                m={1}
                >{isAddMode?"Add Cost": "Edit"}
            </Button>
  
            <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                  <DrawerOverlay />
                      <DrawerContent>
                          <DrawerCloseButton />
                          <DrawerHeader>
                            {isAddMode?"Add":"Update"} Cost                              
                          </DrawerHeader>
                          <DrawerBody>
                            <Stack spacing={8}>
                              <Box>
                                <Box>
                                  <ShowInlineErrorMessage showErrorMessage={showErrorMessage}/>
                                </Box>           
                                {isAddMode?<>
                                    <FormControl isRequired>
                                        <FormLabel>Vendor</FormLabel>
                                        <Select width="50%" onChange={(ev) => handleVendorSelection(ev.target.value)} value={costVendorId}>
                                            <option value="">Select an Vendor</option>
                                            {accountVendorList?.map((vendor) => (
                                            <option value={vendor.id}>{vendor.name}</option>
                                            ))}
                                        </Select>
                                    </FormControl>    
                                    <FormControl isRequired>
                                        <FormLabel>Project</FormLabel>
                                        <Select width="50%" onChange={(ev) => handleProjectSelection(ev.target.value)} value={costProjectId}>
                                            <option value="">Select Project</option>
                                            {projectList?.map((project) => (
                                            <option value={project.id}>{project.name} -- {project.referenceCode}</option>
                                            ))}
                                        </Select>
                                    </FormControl>    
                                </>:<>
                                    <Stack spacing={2}>
                                        <HStack>
                                            <Box>
                                                Vendor
                                            </Box>
                                            <Box>
                                                {costVendorName}
                                            </Box>
                                        </HStack>
                                        <HStack>
                                            <Box>
                                                Project
                                            </Box>
                                            <Box>
                                                {costProjectName}
                                            </Box>
                                        </HStack>                                        
                                    </Stack>
                                </>}               
                                {costProjectId?
                                    <Stack spacing={3}>
                                        <Box maxWidth="25%">
                                            <FormControl isRequired>
                                                <FormLabel>Cost Name</FormLabel>
                                                <Input type="text" id="costName"  value={costName} onChange={(ev) => setCostName(ev.target.value)}/>
                                            </FormControl>      
                                        </Box>          
                                        <Box>
                                            <FormControl>
                                                <FormLabel>Cost Description</FormLabel>
                                                <Textarea type="text" id="costDescription" value={costDescription} onChange={(ev) => setCostDescription(ev.target.value)}/>
                                            </FormControl>    
                                        </Box>   
                                        <Box marginTop={5}><ProjectTimesheets data={{projectId: costProjectId, callType: COST_CALL_TYPE}}/></Box>
                                        <Box>
                                            Cost Total: {addedCostTotal}
                                        </Box>     
                                        {costItemList && costItemList.length>0?
                                            <>
                                                <Box>
                                                    <CostItemList costItemList={costItemList}/>
                                                </Box>    
                                                <Box>
                                                    <Button size="xs" bgColor="header_actions" 
                                                        onClick={() => handleCostSubmit()}
                                                        >{isAddMode?"Add":"Update"} Cost
                                                    </Button>                                                    
                                                </Box>
                                            </>
                                        :<></>}                       
                                    </Stack>
                                :<></>}
                              </Box>                               
                            </Stack>
                          </DrawerBody>
                      </DrawerContent>
             </Drawer>
          </Flex>
  
      </div>
  
    );
};


export default CostPayment;