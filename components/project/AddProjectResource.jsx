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

} from '@chakra-ui/react'
import { userService } from '../../services';
import {USER_ROLES} from "../../constants/userConstants";
import {MODE_ADD, EMPTY_STRING} from "../../constants/accountConstants";


const AddProjectResource = (props) => {
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

 
  const {data} = props;
  const projectId = props.data.projectId;
  const vendorId = props.data.vendorId;
  const remainingBudget = props.data.remainingBudget;
  const handleAddProjectResource = props.data.handleAddProjectResource;
  const toast = useToast()
  

  console.log("ADD PROJECT RESOURCE::"+JSON.stringify(data));

  useEffect(() => {
    console.log("USE EFFECT")
    if(props && props.data && props.data.mode != MODE_ADD) {
      setAddMode(false);
    }
    console.log("Vendor ID:::"+vendorId);
    //getUsersByVendor(vendorId);
  }, []);

  const handleClick = (newSize) => {
    console.log("HANDLE CLICK :::"+vendorId);
    getUsersByVendor(vendorId);
    setSize(newSize)
    onOpen()
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
    
    if(user.target.options.item(user.target.selectedIndex).getAttribute("data-role") === USER_ROLES.ACCOUNT_MANAGER) {
      console.log("HANDLE USER...MANAGER...")
      setTimesheetApproverCheckBox(true);
      
    }else {
      setTimesheetApproverCheckBox(false);
      setTimesheetApprover(false);
    }

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
        uom: uom
      };
      createProjectResource(addedResourceDetails);
      handleAddProjectResource(addedResourceDetails);
      setBudgetAllocated(EMPTY_STRING);

    }
  } 
 

  const createProjectResource = async (requestData) => {
    try {
      console.log("PR Data::"+JSON.stringify(requestData))
        const res = await fetch("/api/account/project/resource/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId: parseInt(projectId),
            userId: parseInt(userId),
            unitPrice: price,
            quantity: parseInt(quantity),
            budgetAllocated: budgetAllocated,
            currency: currency,
            billable: billable,
            isTimesheetApprover: isTimesheetApprover,
            uom: uom
          }), 
        });
        const data = await res.json();

        //Close the modal
        console.log("before forwarding..::"+JSON.stringify(data))
        if(data != undefined && !data.error) {
          console.log("Inside this condition of close")
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
          console.log("INSIDE THE ELSEEE")
          toast({
            title: 'Add Project Resource Error.',
            description: 'Error creating resource.',
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
    console.log("UnitPrice::"+price)
    setPrice(price);
    if(quantity != undefined && quantity != EMPTY_STRING && price!= EMPTY_STRING && price != undefined) {
      if(remainingBudget != undefined && (parseFloat(remainingBudget) > (parseFloat(quantity) * parseFloat(price)))) {
        setBudgetAllocated(parseFloat(quantity) * parseFloat(price))
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
    console.log("quantity::"+quantity)
    setQuantity(quantity);
    if(quantity != undefined && quantity != EMPTY_STRING && price!= EMPTY_STRING && price != undefined) {
      if(remainingBudget != undefined && (parseFloat(remainingBudget) > (parseFloat(quantity) * parseFloat(price)))) {
        setBudgetAllocated(parseFloat(quantity) * parseFloat(price))
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
              onClick={() => handleClick("lg")}
              key="lg"
              m={1}
              >{`Add Project Resource`}
          </Button>
          <Drawer onClose={onClose} isOpen={isOpen} size="lg">
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        
                        <DrawerHeader>
                            <Heading as="h1" size="lg" letterSpacing={'-.1rem'} marginBottom="1rem">
                                Add Project Resource
                            </Heading>
                            <Heading as="h3" size="md">
                                
                            </Heading>
                        </DrawerHeader>
                        <DrawerBody>
                          <Stack divider={<StackDivider />} spacing='1'>
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
                                                      <option value={user.id} data-role={user.role}>{user.firstName} {user.lastName}</option>
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
                                            color='gray.300'
                                            fontSize='1.2em'
                                            children='$'
                                          /> 
                                        </InputGroup>                                         
                                          <Input type="text" width="50%" onChange={(ev) => handleUnitPrice(ev.target.value)}/>
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
