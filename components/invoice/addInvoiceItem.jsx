import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  StackDivider,
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
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';
import {EMPTY_STRING, MODE_ADD, PROJECT_TYPE_GENERAL} from "../../constants/accountConstants";
import {setInvoiceItemList, setInvoiceTotal} from '../../store/modules/Invoice/actions';
import { useDispatch,useSelector } from "react-redux";



const AddInvoiceItem = (props) => {
  const {data} = props;
  const dispatch = useDispatch();


  const [size, setSize] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure()
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

  const projectResources = useSelector(state => state.invoice.projectResources);
  const invoiceTotal = useSelector(state => state.invoice.invoiceTotal);

  useEffect(() => {
    if(props && props.data && props.data.mode != MODE_ADD) {
      setProjectType(data.projectType)
    }
    
  }, []);

  const handleClick = (newSize) => {
    setSize(newSize)
    onOpen()
  }
 
  function handleUnitPrice(unitPrice) {
    console.log("UnitPrice::"+unitPrice)
    setUnitPrice(unitPrice);
    if(quantity != undefined && quantity != EMPTY_STRING && unitPrice!= EMPTY_STRING && unitPrice != undefined) {
      setTotal(parseFloat(quantity) * parseFloat(unitPrice))
    }else {
      setTotal(EMPTY_STRING);
    }
  }

  function handleQuantity(quantity) {
    console.log("quantity::"+quantity)
    setQuantity(quantity);
    if(quantity != undefined && quantity != EMPTY_STRING && unitPrice!= EMPTY_STRING && unitPrice != undefined) {
      setTotal(parseFloat(quantity) * parseFloat(unitPrice));
    }else {
      setTotal(EMPTY_STRING);
    }
  }

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
        console.log("addedInvoiceItem:::::"+JSON.stringify(addedInvoiceItem))
        dispatch(setInvoiceItemList(addedInvoiceItem));
        if(invoiceTotal != undefined) {
          dispatch(setInvoiceTotal(parseFloat(invoiceTotal)+parseFloat(total)));
        }else {
          dispatch(setInvoiceTotal(parseFloat(total)));
        }
        
        
        onClose();
    }
  } 

  function handleClose() {
    onClose();
    setTotal(EMPTY_STRING);
  }


  return (

    <div>
            <Button
                size="xs"
                onClick={() => handleClick("md")}
                bgColor="header_actions" 
                key="md"
                m={1}
                >{`Add Invoice Item`}
            </Button>
            <Drawer onClose={handleClose} isOpen={isOpen} size="md">
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                            <DrawerHeader>
                                    Add Invoice Item
                            </DrawerHeader>
                            <DrawerBody>
                              <Stack divider={<StackDivider />} spacing='1'>
                                <Box border="box_border">
                                  <TableContainer >
                                    <Table>
                                      <TableCaption></TableCaption>
                                      <Thead></Thead>
                                      <Tbody>
                                        <Tr >
                                            <Th bgColor="table_tile">
                                              {projectType === PROJECT_TYPE_GENERAL ? (
                                                <>General</>
                                              ) : (
                                                <>User</>
                                              )}
                                            </Th>
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
                                        </Tr>
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
                                                <Input type="text" width="invoice.price_input" onChange={(ev) => handleUnitPrice(ev.target.value)}/>
                                              </InputGroup>                             
                                            </Th>
                                        </Tr>
                                        <Tr>
                                            <Th bgColor="table_tile">
                                              Currency
                                            </Th>
                                            <Th>
                                              <Select width="40%" onChange={(ev) => setCurrency(ev.target.value)}>
                                                <option value="USD">USD</option>
                                              </Select>

                                            </Th>
                                        </Tr>
                                        <Tr>
                                            <Th bgColor="table_tile">
                                              Quantity
                                            </Th>
                                            <Th>
                                              <Input type="text" width="invoice.quantity_input" onChange={(ev) => handleQuantity(ev.target.value)}/>
                                            </Th>
                                        </Tr>     
                                        <Tr>
                                            <Th bgColor="table_tile">
                                              Quantity UOM
                                            </Th>
                                            <Th>
                                            <Select width="50%%" onChange={(ev) => setUOM(ev.target.value)}>
                                              <option value="Hours">Hours</option>
                                              <option value="Item">General Item</option>
                                            </Select>
                                            </Th>
                                        </Tr>    
                                        <Tr>
                                            <Th bgColor="table_tile">
                                              Invoice Item Total
                                            </Th>
                                            <Th>
                                              <InputGroup>
                                                <InputLeftElement
                                                    pointerEvents='none'
                                                    color='dollor_input'
                                                    fontSize='dollar_left_element'
                                                    children='$'
                                                />      
                                                <Input type="text" width="invoice.total_input" value={total} onChange={(ev) => setTotal(ev.target.value)}/>
                                              </InputGroup>                             
                                            </Th>
                                        </Tr>                                                                                                     
                                      </Tbody>
                                    </Table>
                                  </TableContainer>      
                                </Box>                            

                                <Button className="btn" onClick={() => handleInvoieItemList()} size="xs" width="30%" bgColor="header_actions">
                                  Add
                                </Button>
                            </Stack>
                        </DrawerBody>
                    </DrawerContent>                    
            </Drawer>            
    </div>


  );
};

export default AddInvoiceItem;
