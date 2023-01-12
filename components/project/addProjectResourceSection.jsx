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
  Heading,
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
  StackDivider,
  InputLeftElement,
  useToast

} from '@chakra-ui/react';
import {
  EditIcon
} from '@chakra-ui/icons';
import { projectService, userService } from '../../services';
import {UserConstants} from "../../constants";
import {MODE_ADD, EMPTY_STRING} from "../../constants/accountConstants";
import { DrawerMainHeader } from "../common/drawerMainHeader";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedProjectRemainingBudget, setSelectedProjectResources } from "../../store/modules/Project/actions";



const AddProjectResource = (props) => {
  const dispatch = useDispatch();
  const [size, setSize] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isAddMode, setAddMode] = useState(true);
  const [userList, setUserList] = useState([]);
  const [userId, setUserId] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [budgetAllocated, setBudgetAllocated] = useState("");
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
    console.log("USE EFFECT")
    if(props && props.data && props.data.mode != MODE_ADD) {
      setAddMode(false);
    }
  }, []);

  const handleAdd = (newSize) => {
    console.log("HANDLE CLICK :::"+vendorId);
    getUsersByVendor(vendorId);
    setSize(newSize);
    onOpen();
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
    
    if(user.target.options.item(user.target.selectedIndex).getAttribute("data-role") === UserConstants.USER_ROLES.ACCOUNT_MANAGER) {
      console.log("HANDLE USER...MANAGER...")
      setTimesheetApproverCheckBox(true);
      
    }else {
      setTimesheetApproverCheckBox(false);
      setTimesheetApprover(false);
    }

    setSelectedUserFirstName(user.target.options.item(user.target.selectedIndex).getAttribute("data-fn"));
    setSelectedUserLastName(user.target.options.item(user.target.selectedIndex).getAttribute("data-ln"));

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
        isTimesheetApprover: isTimesheetApprover,
        uom: uom,
        user: {
          firstName: selectedUserFirstName,
          lastName: selectedUserLastName
        }
      };

      //LOGIC to calculage the remaining project budget
      let remainingBudgetToUpdate = parseFloat(remainingBudget);
      if(billable) {
        remainingBudgetToUpdate = parseFloat(remainingBudget)-(parseFloat(quantity)*parseFloat(price));
        console.log("Remaining Budget Before Dispatch :::"+(parseFloat(remainingBudget)-(parseFloat(quantity)*parseFloat(price))));
        dispatch(setSelectedProjectRemainingBudget(remainingBudgetToUpdate))
        console.log("Remaining Budget"+remainingBudgetToUpdate);
      }

      createProjectResource(addedResourceDetails, remainingBudgetToUpdate);
      setBudgetAllocated(EMPTY_STRING);

    }
  } 
 

  const createProjectResource = async (requestData, remainingBudgetToUpdate) => {
    try {
      console.log("PR Data::"+JSON.stringify(requestData))
      const data = await projectService.createProjectResource(requestData, remainingBudgetToUpdate)
        //Close the modal
        console.log("before forwarding..::"+JSON.stringify(data))
        if(data != undefined && !data.error) {
          console.log("Inside this condition of close UPDATED --- "+remainingBudgetToUpdate);
          // remainingBudget = remainingBudgetToUpdate;
          console.log("BEFORE CALLING handleAddProjectResource --- "+remainingBudgetToUpdate)
          // handleAddProjectResource(data, vendorId, remainingBudgetToUpdate);
          dispatch(setSelectedProjectResources(data))
          onClose();
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

          <Button
              onClick={() => handleAdd("lg")}
              key="lg"
              m={1}
              >{`Add Project Resource`}
          </Button>

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
                                          <Select width="50%%" onChange={(ev) => handleUser(ev)} border="table_border">
                                            <option value="">Select User</option>
                                              {userList?.map((user) => (
                                                      <option value={user.user?.id} data-role={user.user?.role} data-fn={user.user?.firstName} data-ln={user.user?.lastName}>{user.user?.firstName} {user.user?.lastName}</option>
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
                                          <Input type="text" width="50%" onChange={(ev) => handleUnitPrice(ev.target.value)}/>
                                        </InputGroup>                                         
                                        </Th>
                                    </Tr>
                                    <Tr>
                                        <Th bgColor="table_tile">
                                          Currency
                                        </Th>
                                        <Th>
                                          <Select width="25%" onChange={(ev) => setCurrency(ev.target.value)}>
                                            <option value="USD">USD</option>
                                          </Select>

                                        </Th>
                                    </Tr>
                                    <Tr>
                                        <Th bgColor="table_tile">
                                          Quantity
                                        </Th>
                                        <Th>
                                          <Input type="text" width="50%" onChange={(ev) => handleQuantity(ev.target.value)}/>
                                        </Th>
                                    </Tr>     
                                    <Tr>
                                        <Th bgColor="table_tile">
                                          Quantity UOM
                                        </Th>
                                        <Th>
                                          <Select width="35%" onChange={(ev) => setUOM(ev.target.value)}>
                                            <option value="Hours">Hours</option>
                                            <option value="Item">General Item</option>
                                          </Select>
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

                            <Button className="btn" onClick={() => handleSelectedProjectResource()} width="button.primary.width" bgColor="button.primary.color">
                              Add Project Resource
                            </Button>                            
                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
          </Drawer>

    </div>


  );
};

export default AddProjectResource;
