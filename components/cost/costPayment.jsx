
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
    HStack
  } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { COST_CALL_TYPE, EMPTY_STRING, EXPENSE_CALL_TYPE, INVOICE_CALL_TYPE, ProjectConstants, TIMESHEET_STATUS } from '../../constants';
import { ShowInlineErrorMessage } from '../common/showInlineErrorMessage';
import { accountService, projectService, userService } from '../../services';
import ProjectTimesheets from '../project/detail/projectTimesheets';
import { TimesheetStatus } from '@prisma/client';
import { useRef } from 'react';
import { CustomTable } from '../customTable/Table';
import { util } from '../../helpers';
import ProjectTimesheeEntrySection from '../project/detail/projectTimesheeEntrySection';
import { setCostItemList, setCostTotal, setSelectedCostTSEId } from '../../store/modules/Cost/actions';
import { CostItemList } from './costItemList';
  
const CostPayment = (props) => {
    const [size, setSize] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {data} = props;
    const dispatch = useDispatch();
    const toast = useToast();
    const [isAddMode, setAddMode] = useState(true);
    const [costProjectId, setCostProjectId] = useState();
    const [addedCostTotal, setAddedCostTotal] = useState();
    const [showErrorMessage, setShowErrorMessage] = useState(EMPTY_STRING);
    const [accountVendorList, setAccountVendorList] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const cstTotal = useSelector(state => state.cost.costTotal);
    const costItemList = useSelector(state => state.cost.costItemList);

    console.log("PROPPPSS:"+JSON.stringify(props))

    useEffect(() => {
        setShowErrorMessage(EMPTY_STRING);
        getVendorList()
        setAddedCostTotal(cstTotal)    
        if(props && !props.isAddMode) {
            setAddMode(false);
        }    
    }, [cstTotal]);



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
        dispatch(setCostTotal(0));
        dispatch(setCostItemList([]));
        dispatch(setSelectedCostTSEId([]));

    }

    async function handleVendorSelection(selectedVendorObj) {
        const projectListResponse = await accountService.getProjectsByVendor(selectedVendorObj, userService.getAccountDetails().accountId);
        setProjectList(projectListResponse);
    } 

    return (
        <div>
        <Flex marginBottom="1rem" borderRadius="lg" alignSelf="center">
            <Button size="xs" bgColor="header_actions" 
                onClick={() => handleAddEditCost("xxl")}
                key="xl"
                m={1}
                >{`Add/Edit Cost`}
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
                                <FormControl isRequired>
                                    <FormLabel>Vendor</FormLabel>
                                    <Select width="50%" onChange={(ev) => handleVendorSelection(ev.target.value)}>
                                        <option value="">Select an Vendor</option>
                                        {accountVendorList?.map((vendor) => (
                                        <option value={vendor.id}>{vendor.name}</option>
                                        ))}
                                    </Select>
                                </FormControl>    
                                <FormControl isRequired>
                                    <FormLabel>Project</FormLabel>
                                    <Select width="50%" onChange={(ev) => handleProjectSelection(ev.target.value)}>
                                        <option value="">Select Project</option>
                                        {projectList?.map((project) => (
                                        <option value={project.id}>{project.name} -- {project.referenceCode}</option>
                                        ))}
                                    </Select>
                                </FormControl>    
                                {costProjectId?
                                    <Stack>
                                        <Box marginTop={5}><ProjectTimesheets data={{projectId: costProjectId, callType: COST_CALL_TYPE}}/></Box>
                                        <Box>
                                            Cost Total: {addedCostTotal}
                                        </Box>     
                                        {costItemList && costItemList.length>0?
                                            <Box>
                                                <CostItemList costItemList={costItemList}/>
                                            </Box>    
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