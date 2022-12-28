import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
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
  StackDivider

} from '@chakra-ui/react'
import { userService } from '../../services';
import {USER_ROLES} from "../../constants/userConstants";
import {MODE_ADD, PROJECT_VALIDATION_SCHEMA} from "../../constants/accountConstants";


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
  const handleAddProjectResource = props.data.handleAddProjectResource;

  

  console.log("DAAYYYY::"+JSON.stringify(data));

  useEffect(() => {
    if(props && props.data && props.data.mode != MODE_ADD) {
      setAddMode(false);
    }

    getUsersByVendor(vendorId);
  }, []);

  const handleClick = (newSize) => {
    setSize(newSize)
    onOpen()
  }

  async function getUsersByVendor(vendorId) {
    // setPageAuthorized(true);
    const userListResponse = await userService.getUsersByVendor(vendorId, userService.getAccountDetails().accountId);
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
      onClose();  

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

        toast.success(data.message);
        //Close the modal
        //router.push("/account/"+userService.getAccountDetails().accountId+"/users");
        console.log("before forwarding..::"+JSON.stringify(data))
        props.data.onClose();

      
      
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

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
                            <Box>
                              <TableContainer>
                                <Table>
                                  <TableCaption></TableCaption>
                                  <Thead></Thead>
                                  <Tbody border="table_border" >
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
                                          <Input type="text" onChange={(ev) => setPrice(ev.target.value)}/>
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
                                          <Input type="text" onChange={(ev) => setQuantity(ev.target.value)}/>
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
                                          <Input type="text" onChange={(ev) => setBudgetAllocated(ev.target.value)}/>
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
