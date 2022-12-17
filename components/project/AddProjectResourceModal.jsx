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
  Flex,
  Heading,
  TableContainer,
  TableCaption,
  Checkbox
} from '@chakra-ui/react'
import { userService } from '../../services';
import {MODE_ADD, PROJECT_VALIDATION_SCHEMA} from "../../constants/accountConstants";


const AddProjectResourceModal = (props) => {
  
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isAddMode, setAddMode] = useState(true);
  const [userList, setUserList] = useState([]);
  const [userId, setUserId] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [budgetAllocated, setBudgetAllocated] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [uom, setUOM] = useState("Hours");
  const [billable, setBillable] = useState(false);


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

  async function getUsersByVendor(vendorId) {
    // setPageAuthorized(true);
    const userListResponse = await userService.getUsersByVendor(vendorId, userService.getAccountDetails().accountId);
    setUserList(userListResponse);

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
        uom: uom
      };
      createProjectResource(addedResourceDetails);
      handleAddProjectResource(addedResourceDetails);
        
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
          <ModalContent>
              <ModalHeader>Add Project Resource</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box>
                  <TableContainer>
                    <Table>
                    <TableCaption></TableCaption>
                      <Thead>
                          <Tr bgColor="table_tile">
                            <Th>
                              Resource
                            </Th>
                            <Th>
                              Billable
                            </Th>
                            <Th>
                              Price
                            </Th>
                            <Th>
                              Currency
                            </Th>
                            <Th>
                              Quantity
                            </Th>
                            <Th>
                              Quantity
                            </Th> 
                            <Th>
                              Max Budget Allocated
                            </Th>
                          </Tr>   
                        </Thead>                
                        <Tbody>
                          <Tr>
                                <Th>
                                  <Select width="50%%" onChange={(ev) => setUserId(ev.target.value)}>
                                      {userList?.map((user) => (
                                              <option value={user.id}>{user.firstName} {user.lastName}</option>
                                      ))}   
                                  </Select>
                                </Th>
                                <Th>
                                  <Checkbox
                                    isChecked={billable}
                                    onChange={(e) => setBillable(e.target.checked)}
                                  />                                
                                </Th>
                                <Th>
                                  <Input type="text" onChange={(ev) => setPrice(ev.target.value)}/>
                                </Th>
                                <Th>
                                  <Select width="50%%" onChange={(ev) => setCurrency(ev.target.value)}>
                                      <option value="USD">USD</option>
                                    </Select>
                                </Th>                              
                                <Th>
                                  <Input type="text" onChange={(ev) => setQuantity(ev.target.value)}/>
                                </Th>
                                <Th>
                                  <Select width="50%%" onChange={(ev) => setUOM(ev.target.value)}>
                                      <option value="Hours">Hours</option>
                                      <option value="Item">General Item</option>
                                    </Select>
                                </Th>                               
                                <Th>
                                  <Input type="text" onChange={(ev) => setBudgetAllocated(ev.target.value)}/>
                                </Th>
                          </Tr>
                      </Tbody>    
                    </Table>
                  </TableContainer>      
                </Box>                            

                <Button className="btn" onClick={() => handleSelectedProjectResource()}>
                  Add Project Resource
                </Button>
              </ModalBody>
          </ModalContent>      

    </div>


  );
};

export default AddProjectResourceModal;
