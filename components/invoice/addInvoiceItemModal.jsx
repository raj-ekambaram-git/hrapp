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
  Checkbox,
  InputArea
} from '@chakra-ui/react'
import { userService } from '../../services';
import {MODE_ADD, PROJECT_TYPE_GENERAL} from "../../constants/accountConstants";


const AddInvoiceItemModal = (props) => {
  const {data} = props;

console.log("Prop MOdal::::"+JSON.stringify(data.projectType));

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [projectResources, setProjectResources] = useState([]);
  const [projectType, setProjectType] = useState("General");
  const [generalNote, setGeneralNote] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [quantity, setQuantity] = useState("");
  const [uom, setUOM] = useState("Hours");
  const [total, setTotal] = useState(0.00);
  const [userId, setUserId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    if(props && props.data && props.data.mode != MODE_ADD) {

      setProjectType(data.projectType)
      setProjectResources(data.projectResources)
    }
    
  }, []);


 
  function handleInvoieItemList() {
    console.log("handleInvoieItemList::Modalll")
    /**
     * Construct the JSON and send it to the parent
     */

    if(
      // userId == ""
        // || userId == undefined
         unitPrice == ""
        || unitPrice == undefined
        || quantity == ""
        || quantity == undefined) {

          console.log("Error, Please enter the details");
    }else {
      const addedInvoiceItem = {
        userId: parseInt(userId),
        generalNote: generalNote,
        type: projectType,
        status: "Draft",
        unitPrice: unitPrice,
        quantity: parseInt(quantity),
        currency: currency,
        uom: uom,
        total: total
      };
      props.data.handleInvoieItemListModal(addedInvoiceItem);
        
    }
  } 



  return (

    <div>
          <ModalContent>
              <ModalHeader>Add Invoice Item</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box>
                  <TableContainer>
                    <Table>
                    <TableCaption></TableCaption>
                      <Thead>
                          <Tr bgColor="table_tile">
                            <Th>
                              {projectType === PROJECT_TYPE_GENERAL ? (
                                <>General</>
                              ) : (
                                <>User</>
                              )}
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
                              UOM
                            </Th> 
                            <Th>
                              Total Item
                            </Th>
                          </Tr>   
                        </Thead>                
                        <Tbody>
                          <Tr>
                                <Th>
                                  {projectType == PROJECT_TYPE_GENERAL ? (
                                    <><Input type="text" onChange={(ev) => setGeneralNote(ev.target.value)}/></>
                                  ) : (
                                    <>
                                      <Select width="50%%" onChange={(ev) => setUserId(ev.target.value)}>
                                        <option value="">Select Resource</option>
                                          {projectResources?.map((projectResource) => (
                                                  <option value={projectResource.userId}>{projectResource.user.firstName} {projectResource.user.lastName}</option>
                                          ))}   
                                      </Select>
                                    </>
                                  )}
                                </Th>
                                <Th>
                                  <Input type="text" onChange={(ev) => setUnitPrice(ev.target.value)}/>
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
                                 <Input type="text" onChange={(ev) => setTotal(ev.target.value)}/>
                                </Th>
                          </Tr>
                      </Tbody>    
                    </Table>
                  </TableContainer>      
                </Box>                            

                <Button className="btn" onClick={() => handleInvoieItemList()}>
                  Add
                </Button>
              </ModalBody>
          </ModalContent>      

    </div>


  );
};

export default AddInvoiceItemModal;
