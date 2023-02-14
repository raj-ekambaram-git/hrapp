
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
    Textarea,
    Card,
    CardBody,
    Text,
    Badge
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
import ExpenseEntryPayment from '../expense/payment/expenseEntryPayment';
  
const CostPayment = (props) => {
    const [size, setSize] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {data} = props;
    const dispatch = useDispatch();
    const toast = useToast();
    const router = useRouter();

    const [isAddMode, setAddMode] = useState(true);
    const [cost, setCost] = useState();
    const [costProjectId, setCostProjectId] = useState();
    const [supplierId, setSupplierId] = useState();
    const [costName, setCostName] = useState();
    const [costDescription, setCostDescription] = useState(EMPTY_STRING);
    const [costVendorId, setCostVendorId] = useState();
    const [costVendorName, setCostVendorName] = useState();
    const [costProjectName, setCostProjectName] = useState();
    const [costSupplierName, setCostSupplierName] = useState();
    const [addedCostTotal, setAddedCostTotal] = useState();
    const [showErrorMessage, setShowErrorMessage] = useState(EMPTY_STRING);
    const [accountVendorList, setAccountVendorList] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [supplierList, setSupplierList] = useState([]);
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
                setCostSupplierName(expenseResponse.supplier?.name)
                setSupplierId(expenseResponse.supplierId)
                populateSelectedTimesheetIds()
                console.log("expenseResponse::"+JSON.stringify(expenseResponse))
                setCost(expenseResponse)
        }
    }


    const populateSelectedTimesheetIds = () => {
        const selectedTSEIds = costItemList.map((costItem) => {
            return parseInt(costItem.notes.split("_")[0]);
        })
        dispatch(setSelectedCostTSEId(selectedTSEIds))    
        
    }

    const handleProjectSelection = async(selectedProjectId) => {
        setCostProjectId(selectedProjectId)
        const responseData = await projectService.getSuppliers(selectedProjectId, userService.getAccountDetails().accountId)
        console.log("responseData:::SUPPLIERS::"+JSON.stringify(responseData))
        if(responseData && responseData.length>0) {
          setSupplierList(responseData)
        }
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
            setProjectList([])           
            setSupplierList([])     
            setCostProjectId(null)      
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
              supplierId: parseInt(supplierId),
              userId: parseInt(userService.userValue.id),
              expenseEntries: {
                create: costItemList
              },
            }
            const responseData = await expenseService.createExpense(expenseRequest, true);
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
              id: props.costId,
              projectId: parseInt(costProjectId.toString()),
              name: costName,
              description: costDescription,
              billable: true,
              total: addedCostTotal,
              supplierId: parseInt(supplierId),
              status: status,
              userId: parseInt(userService.userValue.id),
            }
            const responseData = await expenseService.updateExpense(expenseRequest, costItemList, true);
            if(!responseData.error) {
              toast({
                title: 'New Expense.',
                description: 'Successfully added new expense.',
                status: 'success',
                position: 'top',
                duration: 3000,
                isClosable: true,
              })
              router.push("/account/user/cost");
              
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
        <Flex borderRadius="lg" alignSelf="center">
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
                                  <ShowInlineErrorMessage showErrorMessage={showErrorMessage}/>
                                </Box>           
                                {isAddMode?<>
                                  <HStack spacing={1}>
                                    <FormControl isRequired>
                                        <FormLabel>Vendor</FormLabel>
                                        <Select width="70%" onChange={(ev) => handleVendorSelection(ev.target.value)} value={costVendorId}>
                                            <option value="">Select an Vendor</option>
                                            {accountVendorList?.map((vendor) => (
                                            <option value={vendor.id}>{vendor.name}</option>
                                            ))}
                                        </Select>
                                    </FormControl>    
                                    <FormControl isRequired>
                                        <FormLabel>Project</FormLabel>
                                        <Select width="70%" onChange={(ev) => handleProjectSelection(ev.target.value)} value={costProjectId}>
                                            <option value="">Select Project</option>
                                            {projectList?.map((project) => (
                                            <option value={project.id}>{project.name} -- {project.referenceCode}</option>
                                            ))}
                                        </Select>
                                    </FormControl>  
                                  </HStack>                                      
                                </>:<>
                                      <Stack spacing={2} marginBottom={6} fontSize="15px">
                                          <HStack marginBottom={3}>
                                              <Box textAlign="right">
                                                  Vendor:
                                              </Box>
                                              <Box textAlign="left" fontWeight="600">
                                                  {costVendorName}
                                              </Box>
                                          </HStack>
                                          <HStack marginBottom={3}>
                                              <Box textAlign="right">
                                                  Project:
                                              </Box>
                                              <Box textAlign="left" fontWeight="600">
                                                  {costProjectName}
                                              </Box>
                                          </HStack>  
                                          {costSupplierName?<>
                                            <HStack marginBottom={3}>
                                              <Box textAlign="right">
                                                  Supplier:
                                              </Box>
                                              <Box textAlign="left" fontWeight="600">
                                                  {costSupplierName}
                                              </Box>
                                            </HStack>                                            
                                          </>:<></>}    
                                          <HStack marginTop="80px">
                                              <Box>
                                                <Badge color={(props.costData?.status === ExpenseStatus.Approved || props.costData?.status === ExpenseStatus.PartiallyPaid || props.costData?.status === ExpenseStatus.Paid)?"paid_status":"pending_status"}>{props.costData?.status}</Badge>
                                              </Box>                                              
                                          </HStack>                                    
                                      </Stack>
                                </>}               
                                {costProjectId?
                                    <Stack spacing={8}>
                                      <HStack spacing={1}>
                                            <FormControl isRequired>
                                                <FormLabel>Cost Name</FormLabel>
                                                <Input width={supplierList && supplierList.length>0?"70%":"35%"}  type="text" id="costName"  value={costName} onChange={(ev) => setCostName(ev.target.value)}/>
                                            </FormControl>      
                                        {supplierList && supplierList.length>0?<>
                                          <FormControl>
                                            <FormLabel>Supplier</FormLabel>
                                            <Select width="70%" onChange={(ev) => setSupplierId(ev.target.value)} value={supplierId}>
                                                <option value="">Select Supplier</option>
                                                {supplierList?.map((supplier) => (
                                                <option value={supplier?.id}>{supplier?.name}</option>
                                                ))}
                                            </Select>
                                          </FormControl>                                                 
                                        </>:<></>}
                                      </HStack>
                                        <Box maxWidth="35%">
                                            <FormControl>
                                                <FormLabel>Cost Description</FormLabel>
                                                <Textarea type="text" id="costDescription" value={costDescription} onChange={(ev) => setCostDescription(ev.target.value)}/>
                                            </FormControl>    
                                        </Box>   
                                        <Box marginTop={5}><ProjectTimesheets data={{projectId: costProjectId, callType: COST_CALL_TYPE}}/></Box>
                                        <Box fontSize="15px">
                                            <HStack>
                                              <Text>Cost Total: </Text>
                                              <Text fontWeight="600">{util.getWithCurrency(addedCostTotal)}</Text>
                                            </HStack>
                                            
                                        </Box>     
                                        {(costItemList && costItemList.length>0)?
                                            <>
                                                <Box>
                                                    <CostItemList costItemList={costItemList}/>
                                                </Box>    
                                                {(isAddMode || (props.costData?.status != ExpenseStatus.Paid && props.costData?.status != ExpenseStatus.PartiallyPaid))? <>
                                                  <Box>
                                                    <Button size="xs" bgColor="header_actions" 
                                                        onClick={() => handleCostSubmit()}
                                                        >{isAddMode?"Add":"Update"} Cost
                                                    </Button>                                                    
                                                  </Box>

                                                </>:<></>}
                                            </>
                                        :<></>}                       
                                    </Stack>
                                :<></>}                          
                            </Stack>
                          </DrawerBody>
                      </DrawerContent>
             </Drawer>
          </Flex>
  
      </div>
  
    );
};


export default CostPayment;