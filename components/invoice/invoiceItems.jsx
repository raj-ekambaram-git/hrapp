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
    HStack
  
  } from '@chakra-ui/react';
  import {
    DeleteIcon
  } from '@chakra-ui/icons';
  import {INVOICE_CALL_TYPE, PROJECT_TYPE_GENERAL} from "../../constants/accountConstants";
import ProjectTimesheets from "../project/detail/projectTimesheets";
import { useSelector, useDispatch } from "react-redux";
import { removeItemFromInvoiceItemList } from "../../store/modules/Invoice/actions";

const InvoiceItems = (props) => {
    const dispatch = useDispatch();

    const invoiceItemListNew = useSelector(state => state.invoice.invoiceItemList);
    const projectResources = useSelector(state => state.invoice.projectResources);

    const projectId = props.data.projectId; 
    const projectType = props.data.projectType;

    useEffect(() => {
      }, []);
    
      const addInvoiceData = {
        projectType: projectType,
        projectResources: projectResources
      }

    function deleteInvoiceItem(removeIndex) {
        dispatch(removeItemFromInvoiceItemList(removeIndex));

    }
    

    return (
        <div>
            <HStack>
                <AddInvoiceItem data={addInvoiceData}></AddInvoiceItem>
                <ProjectTimesheets data={{projectId: projectId, callType: INVOICE_CALL_TYPE}}/>
            </HStack>
            {invoiceItemListNew.length > 0 ? (<>
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
                            {invoiceItemListNew?.map((invoiceItem, index) => (
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

                 
        </div>
  );
};

export default InvoiceItems;
