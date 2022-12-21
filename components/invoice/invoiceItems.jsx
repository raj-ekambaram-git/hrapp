import React, { useState, useEffect } from "react";
import AddInvoiceItemModal from "./addInvoiceItemModal";
import {
    Text,
    Button,
    Modal,
    ModalOverlay,
    Table,
    Thead,
    Tbody,
    Th,
    Tr,
    TableContainer,
    TableCaption,
    useDisclosure
  
  } from '@chakra-ui/react';
  import {
    DeleteIcon
  } from '@chakra-ui/icons';
  import {PROJECT_TYPE_GENERAL} from "../../constants/accountConstants";

const InvoiceItems = (props) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [invoiceItemList, setInvoiceItemList] = useState([]);

    props.data.handleInvoieItemListModal = handleInvoieItemListModal;
    setInvoiceItemList(props.data.invoiceItemList)

    async function handleInvoieItemListModal(invoiceItemListJSON) {
        invoiceItemList.push(invoiceItemListJSON)

        setInvoiceItemList(invoiceItemList)
        props.data.handleInvoieItemList(invoiceItemList);
        onClose();
    } 

    function deleteInvoiceItem(removeIndex) {

        const inputData = [...invoiceItemList];
        inputData.splice(removeIndex, 1);
        setInvoiceItemList(inputData);
        props.data.handleInvoieItemList(inputData);

    }
    

    return (
        <div>
            <Text pt='2' fontSize='sm'>
            <Button className="btn" onClick={onOpen}>Add Invoice Item</Button>
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay/>
                <AddInvoiceItemModal data={props.data}></AddInvoiceItemModal>
            </Modal>  
            {invoiceItemList.length > 0 ? (<>
                <TableContainer marginTop="1rem">
                    <Table>
                        <TableCaption></TableCaption>
                        <Thead>
                            <Tr bgColor="table_tile">
                                <Th>
                                    {props.data.projectType === PROJECT_TYPE_GENERAL ? (
                                        <>
                                        Genaral</>
                                    ) : (
                                        <>
                                        User
                                        </>
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
                                <Th>
                                </Th>                                
                            </Tr>   
                        </Thead>                
                        <Tbody>
                            {invoiceItemList?.map((invoiceItem, index) => (
                                <Tr>
                                    <Th>
                                        
                                        {props.data.projectType === PROJECT_TYPE_GENERAL ? (
                                            <>
                                            {invoiceItem.generalNote}</>
                                        ) : (
                                            <>
                                            {invoiceItem.userId}
                                            </>
                                        )}                                
                                    </Th>
                                    <Th>
                                        {invoiceItem.unitPrice}
                                    </Th>
                                    <Th>
                                        {invoiceItem.currency}
                                    </Th>                              
                                    <Th>
                                        {invoiceItem.quantity}
                                    </Th>
                                    <Th>
                                        {invoiceItem.uom}
                                    </Th>                               
                                    <Th>
                                        {invoiceItem.total} 
                                    </Th>
                                    <Th>
                                        <DeleteIcon onClick={() => deleteInvoiceItem(index)}/>
                                    </Th>                                    
                                </Tr>
                            ))}
                        </Tbody>    
                    </Table>
                </TableContainer>                 
            </>) : (<></>)}

            </Text>          
        </div>
  );
};

export default InvoiceItems;
