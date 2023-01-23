import React, { useState, useEffect } from "react";
import {
  InputGroup,
  useDisclosure,
  Button,
  Select,
  Input,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Box,
  TableContainer,
  TableCaption,
  Checkbox,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  InputLeftElement,
  useToast,
  HStack

} from '@chakra-ui/react';
import {
  EditIcon
} from '@chakra-ui/icons';
import { projectService, userService } from '../../services';
import {UserConstants} from "../../constants";
import {MODE_ADD, EMPTY_STRING} from "../../constants/accountConstants";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedProjectRemainingBudget, setSelectedProjectResources, updateProjectResourceEntry } from "../../store/modules/Project/actions";
import { util } from "../../helpers/util";
import DatePicker from "../common/datePicker";



const AddProjectResource = (props) => {
  const dispatch = useDispatch();
  const [size, setSize] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isAddMode, setAddMode] = useState(true);
  const [userList, setUserList] = useState([]);
  const [userId, setUserId] = useState("");
  const [projectResourceId, setProjectResourceId] = useState("");
  const [cost, setCost] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [budgetAllocated, setBudgetAllocated] = useState("");
  const [origBudgetAllocated, setOrigBudgetAllocated] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [uom, setUOM] = useState("Hours");
  const [billable, setBillable] = useState(false);
  const [isTimesheetApprover, setTimesheetApprover] = useState(false);
  const [timesheetApproverCheckBox, setTimesheetApproverCheckBox] = useState(false);
  const [selectedUserFirstName, setSelectedUserFirstName] = useState("");
  const [selectedUserLastName, setSelectedUserLastName] = useState("");
  
  
 
  const {data} = props;

  const projectId = useSelector(state => state.project.selectedProjectId);
  const vendorId = useSelector(state => state.project.vendorId);
  const remainingBudget = useSelector(state => state.project.remainingBudget);
  const toast = useToast();
  

  useEffect(() => {
    if(props && props.data && props.data.mode != MODE_ADD) {
      console.log("this is edit mode")
      setAddMode(false);
    }
  }, []);

  const handleAdd = (newSize) => {
    console.log("HANDLE CLICK :::"+vendorId);
    getUsersByVendor(vendorId);
    setSize(newSize);
    onOpen();
  }

  const handleEdit = (newSize) => {
    console.log("HANDLE EDIT :::"+vendorId);
    getUsersByVendor(vendorId);
    if(data != undefined && data != EMPTY_STRING) {
      //Edit Mode so get the data and set for each field
      setUserId(data?.projectResource?.userId)
      setProjectResourceId(data?.projectResource?.id)
      setPrice(data?.projectResource?.unitPrice)
      setCurrency(data?.projectResource?.currency)
      setQuantity(data?.projectResource?.quantity)
      setUOM(data?.projectResource?.uom)
      setBillable(data?.projectResource?.billable)
      setBudgetAllocated(data?.projectResource?.budgetAllocated)
      setOrigBudgetAllocated(data?.projectResource?.budgetAllocated)
      setTimesheetApprover(data?.projectResource?.isTimesheetApprover)
      setFromDate(data?.projectResource?.fromDate)
      setToDate(data?.projectResource?.toDate)
      setCost(data?.projectResource?.cost)

    }
    setSize(newSize);
    onOpen();
  }

  function handleFromDate(e) {
    if(e != undefined && (e.updatedDate || (!e.updatedDate && fromDate === undefined))) {
      setFromDate(util.getFormattedDate(e.date))
    }
  }

  function handleToDate(e) {
    if(e != undefined && (e.updatedDate || (!e.updatedDate && toDate === undefined))) {
      setToDate(util.getFormattedDate(e.date))
    }
  }
  async function getUsersByVendor(vendorId) {
    // setPageAuthorized(true);
    console.log("getUsersByVendor::: Vendor ID ::"+vendorId);
    const userListResponse = await userService.getUsersByVendor(vendorId, userService.getAccountDetails().accountId);
    console.log("userListResponse inside add resource:::"+JSON.stringify(userListResponse))
    setUserList(userListResponse);

  }  
 
  function handleUser(user) {
    console.log("HANDLE USER...")
    setUserId(user.target.value);
    
    if(user.target.options.item(user.target.selectedIndex).getAttribute("data-role").includes(UserConstants.USER_ROLES.ACCOUNT_MANAGER)) {
      console.log("HANDLE USER...MANAGER...")
      setTimesheetApproverCheckBox(true);
      
    }else {
      setTimesheetApproverCheckBox(false);
      setTimesheetApprover(false);
    }

    setCost(user.target.options.item(user.target.selectedIndex).getAttribute("data-cost"))
    setSelectedUserFirstName(user.target.options.item(user.target.selectedIndex).getAttribute("data-fn"));
    setSelectedUserLastName(user.target.options.item(user.target.selectedIndex).getAttribute("data-ln"));

  }

  function resetInput(){
    setUserId(EMPTY_STRING)
    setPrice(EMPTY_STRING)
    setBillable(false)
    setTimesheetApprover(false)
    setQuantity(EMPTY_STRING)
    setBudgetAllocated(EMPTY_STRING)
    setOrigBudgetAllocated(EMPTY_STRING)
    setFromDate(EMPTY_STRING)
    setToDate(EMPTY_STRING)
    setFromDate(EMPTY_STRING)
    setToDate(EMPTY_STRING)
  }

  function handleSelectedProjectResource() {
    console.log("handleSelectedProjectResource::"+userId)
    /**
     * Construct the JSON and send it to the parent
     */

    if(userId == ""
        || userId == undefined
        || projectId == ""
        || projectId == undefined
        || price == ""
        || price == undefined
        || quantity == ""
        || quantity == undefined
        || cost == ""
        || cost == undefined
        || budgetAllocated == ""
        || budgetAllocated == undefined) {

          console.log("Error, Please enter the details");
          toast({
            title: 'Add Project Resource Error.',
            description: 'Please add all the rfields to add a resource.',
            status: 'error',
            position: 'top',
            duration: 9000,
            isClosable: true,
          })          
    }else {
      const addedResourceDetails = {
        userId: parseInt(userId),
        projectId: parseInt(projectId),
        unitPrice: price,
        quantity: parseInt(quantity),
        budgetAllocated: budgetAllocated,
        currency: currency,
        billable: billable,
        cost: cost,
        isTimesheetApprover: isTimesheetApprover,
        fromDate: fromDate,
        toDate: toDate,
        uom: uom,
        user: {
          firstName: selectedUserFirstName,
          lastName: selectedUserLastName
        }
      };


      if(isAddMode) {
        //LOGIC to calculage the remaining project budget
        let remainingBudgetToUpdate = parseFloat(remainingBudget);
        if(billable) {
          remainingBudgetToUpdate = parseFloat(remainingBudget)-(parseFloat(quantity)*parseFloat(price));
          console.log("Remaining Budget Before Dispatch :::"+(parseFloat(remainingBudget)-(parseFloat(quantity)*parseFloat(price))));
          dispatch(setSelectedProjectRemainingBudget(remainingBudgetToUpdate))
          console.log("Remaining Budget"+remainingBudgetToUpdate);
        }

        createProjectResource(addedResourceDetails, remainingBudgetToUpdate);
      }else {
        addedResourceDetails.id = projectResourceId;
              
        let remainingBudgetToUpdate = parseFloat(remainingBudget);
        if(billable) {
          remainingBudgetToUpdate = parseFloat(remainingBudget)-((parseFloat(quantity)*parseFloat(price))-parseFloat(origBudgetAllocated));
          console.log("Remaining Budget Before Dispatch :::"+remainingBudgetToUpdate);
          dispatch(setSelectedProjectRemainingBudget(remainingBudgetToUpdate))
          
        }

        updateProjectResource(addedResourceDetails, remainingBudgetToUpdate);
      }
      
      setBudgetAllocated(EMPTY_STRING);

    }
  } 
 
  const updateProjectResource = async (requestData, remainingBudgetToUpdate) => {
    try {
      console.log("PR Data::"+JSON.stringify(requestData))
      const data = await projectService.updateProjectResource(requestData, remainingBudgetToUpdate)
        //Close the modal
        console.log("updateProjectResource:::::before forwarding..::"+JSON.stringify(data))
        if(data != undefined && !data.error) {
          // dispatch(setSelectedProjectResources(data))
          dispatch(setSelectedProjectRemainingBudget(remainingBudgetToUpdate))
          dispatch(updateProjectResourceEntry(data))
          onClose();
          resetInput();
          toast({
            title: 'Update Project Resource.',
            description: 'Successfully updated a resource.',
            status: 'success',
            position: 'top',
            duration: 3000,
            isClosable: true,
          })     
        }else {
          toast({
            title: 'Update Project Resource Error.',
            description: 'Error updating resource.'+data.errorMessage,
            status: 'error',
            position: 'top',
            duration: 9000,
            isClosable: true,
          })     
        }
      
    } catch (error) {
      console.log("ERRRORRR::"+error);
      toast({
        title: 'Update Project Resource Error.',
        description: 'Error updating resource.',
        status: 'error',
        position: 'top',
        duration: 9000,
        isClosable: true,
      })     
    }
  };


  const createProjectResource = async (requestData, remainingBudgetToUpdate) => {
    try {
      console.log("PR Data::"+JSON.stringify(requestData))
      const data = await projectService.createProjectResource(requestData, remainingBudgetToUpdate)
        //Close the modal
        console.log("before forwarding..::"+JSON.stringify(data))
        if(data != undefined && !data.error) {
          dispatch(setSelectedProjectResources(data))
          dispatch(setSelectedProjectRemainingBudget(remainingBudgetToUpdate))
          onClose();
          resetInput();
          toast({
            title: 'Add Project Resource.',
            description: 'Successfully add a resource.',
            status: 'success',
            position: 'top',
            duration: 3000,
            isClosable: true,
          })     
        }else {
          toast({
            title: 'Add Project Resource Error.',
            description: 'Error creating resource.'+data.errorMessage,
            status: 'error',
            position: 'top',
            duration: 9000,
            isClosable: true,
          })     
        }
      
    } catch (error) {
      console.log("ERRRORRR::"+error);
      toast({
        title: 'Add Project Resource Error.',
        description: 'Error creating resource.',
        status: 'error',
        position: 'top',
        duration: 9000,
        isClosable: true,
      })     
    }
  };


  function handleUnitPrice(price) {
    console.log("handleUnitPrice ----UnitPrice::"+price+"---Quantity::"+quantity+"---remainingBudget::"+remainingBudget);
    setPrice(price);
    if(quantity != undefined && quantity != EMPTY_STRING && price!= EMPTY_STRING && price != undefined) {
      if(!billable) {
        setBudgetAllocated(parseFloat(quantity) * parseFloat(price));
        return;
      }
      if(remainingBudget != undefined && (parseFloat(remainingBudget) >= (parseFloat(quantity) * parseFloat(price)))) {
        setBudgetAllocated(parseFloat(quantity) * parseFloat(price));
        // setRemainingBudgetToUpdate(parseFloat(remainingBudget)-(parseFloat(quantity)*parseFloat(price)))
      }else {
        toast({
          title: 'Add Project Resource Error.',
          description: 'Not sufficient budget available. Please adjust accordingly.',
          status: 'error',
          position: 'top',
          duration: 9000,
          isClosable: true,
        })
      }
      
    }else {
      setBudgetAllocated(EMPTY_STRING);
    }
  }

  function handleQuantity(quantity) {
    console.log("handleQuantity ----UnitPrice::"+price+"---Quantity::"+quantity+"---remainingBudget::"+remainingBudget);
    setQuantity(quantity);
    if(quantity != undefined && quantity != EMPTY_STRING && price!= EMPTY_STRING && price != undefined) {
      if(!billable) {
        setBudgetAllocated(parseFloat(quantity) * parseFloat(price));
        return;
      }
      if(remainingBudget != undefined && (parseFloat(remainingBudget) > (parseFloat(quantity) * parseFloat(price)))) {
        setBudgetAllocated(parseFloat(quantity) * parseFloat(price));
        // setRemainingBudgetToUpdate(parseFloat(remainingBudget)-(parseFloat(quantity)*parseFloat(price)))
      }else {
        toast({
          title: 'Add Project Resource Error.',
          description: 'Not sufficient budget available. Please adjust accordingly.',
          status: 'error',
          position: 'top',
          duration: 9000,
          isClosable: true,
        })
      }
    }else {
      setBudgetAllocated(EMPTY_STRING);
    }
  }

  return (

    <div>

          {isAddMode ? (<>
            <Button size="xs" bgColor="header_actions" 
                onClick={() => handleAdd("lg")}
                key="lg"
                m={1}
                >{`Add Project Resource`}
            </Button>
          </>) : (<>
            <EditIcon boxSize={4}
                onClick={() => handleEdit("lg")}
                key="lg"
                m={1}
                >{`Add Project Resource`}
            </EditIcon>
          </>)}

          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            Add Project Resource
                        </DrawerHeader>
                        <DrawerBody>
                          <Stack>
                            <Box border="box_border">
                              <TableContainer>
                                <Table>
                                  <TableCaption></TableCaption>
                                  <Thead></Thead>
                                  <Tbody>
                                    <Tr >
                                        <Th bgColor="table_tile">
                                          Resource
                                        </Th>
                                        <Th>
                                          <Select width="50%%" value={userId} onChange={(ev) => handleUser(ev)} border="table_border">
                                            <option value="">Select User</option>
                                              {userList?.map((user) => (
                                                      <option value={user.user?.id} data-role={user.user?.userRole} data-cost={user.user?.cost}
                                                      data-fn={user.user?.firstName} data-ln={user.user?.lastName}>{user.user?.firstName} {user.user?.lastName}</option>
                                              ))}   
                                          </Select>
                                        </Th>
                                    </Tr>
                                    <Tr>
                                        <Th bgColor="table_tile">
                                          Bilable
                                        </Th>
                                        <Th>
                                          <Checkbox
                                                  isChecked={billable}
                                                  onChange={(e) => setBillable(e.target.checked)}
                                                />                                
                                        </Th>
                                    </Tr>
                                    {timesheetApproverCheckBox ? (
                                          <>
                                          <Tr>
                                            <Th bgColor="table_tile">
                                              Timesheet Approver
                                            </Th>
                                            <Th>
                                                <Checkbox
                                                  isChecked={isTimesheetApprover}
                                                  onChange={(e) => setTimesheetApprover(e.target.checked)}
                                                />                                
                                            </Th>                                
                                          </Tr>                                    
                                          </>
                                      ) : ("")}
                                    <Tr>
                                        <Th bgColor="table_tile">
                                          Price
                                        </Th>
                                        <Th>
                                        <InputGroup>                            
                                          <InputLeftElement
                                              pointerEvents='none'
                                              color='dollor_input'
                                              fontSize='dollar_left_element'
                                              children='$'
                                          />     
                                          <Input type="text" value={price} width="50%" onChange={(ev) => handleUnitPrice(ev.target.value)}/>
                                        </InputGroup>                                         
                                        </Th>
                                    </Tr>
                                    <Tr>
                                        <Th bgColor="table_tile">
                                          Currency
                                        </Th>
                                        <Th>
                                          <Select width="25%" value={currency} onChange={(ev) => setCurrency(ev.target.value)}>
                                            <option value="USD">USD</option>
                                          </Select>

                                        </Th>
                                    </Tr>
                                    <Tr>
                                        <Th bgColor="table_tile">
                                          Quantity
                                        </Th>
                                        <Th>
                                          <Input type="text" value={quantity} width="50%" onChange={(ev) => handleQuantity(ev.target.value)}/>
                                        </Th>
                                    </Tr>     
                                    <Tr>
                                        <Th bgColor="table_tile">
                                          Quantity UOM
                                        </Th>
                                        <Th>
                                          <Select width="35%" value={uom} onChange={(ev) => setUOM(ev.target.value)}>
                                            <option value="Hours">Hours</option>
                                            <option value="Item">General Item</option>
                                          </Select>
                                        </Th>
                                    </Tr>    
                                    <Tr>
                                        <Th bgColor="table_tile">
                                          Cost
                                        </Th>
                                        <Th>
                                          <InputGroup>                            
                                            <InputLeftElement
                                                pointerEvents='none'
                                                color='dollor_input'
                                                fontSize='dollar_left_element'
                                                children='$'
                                            />     
                                            <Input type="text" value={cost} width="50%" onChange={(ev) => setCost(ev.target.value)}/>
                                          </InputGroup>                                         
                                        </Th>
                                    </Tr>                                       
                                    <Tr>
                                        <Th bgColor="table_tile">
                                          From Date
                                        </Th>
                                        <Th>
                                          <HStack>
                                            <Input type="text" id="fromDate"  value={util.getFormattedDate(fromDate)} size="md" onChange={handleFromDate}/>
                                            <DatePicker onChange={handleFromDate}/> 
                                          </HStack>
                                        </Th>
                                    </Tr>          
                                    <Tr>
                                        <Th bgColor="table_tile">
                                          To Date
                                        </Th>
                                        <Th>
                                          <HStack>
                                            <Input type="text" id="toDate"  value={util.getFormattedDate(toDate)} size="md" onChange={handleFromDate}/>
                                            <DatePicker onChange={handleToDate}/> 
                                          </HStack>
                                        </Th>
                                    </Tr>                                                                    
                                    <Tr>
                                        <Th bgColor="table_tile">
                                          Max Budget Allocated
                                        </Th>
                                        <Th>
                                          <Input type="text" width="50%" value={budgetAllocated} onChange={(ev) => setBudgetAllocated(ev.target.value)}/>
                                        </Th>
                                    </Tr>    

                                  </Tbody>
                                  
                                </Table>
                              </TableContainer>      
                            </Box>                            

                            <Button onClick={() => handleSelectedProjectResource()} width="button.primary.width" bgColor="button.primary.color">
                              {isAddMode ? (<>
                                  Add Resource                              
                              </>) : (<>
                                  Edit Resource
                              </>)}
                            </Button>                            

                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
          </Drawer>

    </div>


  );
};

export default AddProjectResource;
