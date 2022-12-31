import React, { useState, useEffect } from "react";
import AddInvoiceItem from "./addInvoiceItem";
import {
    Text,
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

    useEffect(() => {
        setInvoiceItemList(props.data.invoiceItemList)
      }, []);
    
      const addInvoiceData = {
        handleInvoieItemList: handleInvoieItemList,
        projectType: props.data.projectType,
        projectResources: props.data.projectResources

      }

    async function handleInvoieItemList(invoiceItemListJSON) {
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
            <AddInvoiceItem data={addInvoiceData}></AddInvoiceItem>
            {invoiceItemList.length > 0 ? (<>
                <TableContainer marginTop="1rem">
                    <Table>
                        <TableCaption></TableCaption>
                        <Thead>
                            <Tr bgColor="table_tile">
                                <Th>
                                </Th>   
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
                            </Tr>   
                        </Thead>                
                        <Tbody>
                            {invoiceItemList?.map((invoiceItem, index) => (
                                <Tr>
                                    <Th>
                                        <DeleteIcon onClick={() => deleteInvoiceItem(index)}/>
                                    </Th>                                      
                                    <Th>
                                        <Text pt='table_display_value' fontSize='table_display_value'>
                                            {props.data.projectType === PROJECT_TYPE_GENERAL ? (
                                                <>
                                                {invoiceItem.generalNote}</>
                                            ) : (
                                                <>
                                                {invoiceItem.userId}
                                                </>
                                            )}                                
                                        </Text>
                                    </Th>
                                    <Th>
                                        <Text pt='table_display_value' fontSize='table_display_value'>
                                            {invoiceItem.unitPrice}
                                        </Text>
                                    </Th>
                                    <Th>
                                        <Text pt='table_display_value' fontSize='table_display_value'>
                                            {invoiceItem.currency}
                                        </Text>
                                    </Th>                              
                                    <Th>
                                        <Text pt='table_display_value' fontSize='table_display_value'>
                                            {invoiceItem.quantity}
                                        </Text>
                                    </Th>
                                    <Th>
                                        <Text pt='table_display_value' fontSize='table_display_value'>
                                            {invoiceItem.uom}
                                        </Text>
                                    </Th>                               
                                    <Th>
                                        <Text pt='table_display_value' fontSize='table_display_value'>  
                                            {invoiceItem.total} 
                                        </Text>
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
