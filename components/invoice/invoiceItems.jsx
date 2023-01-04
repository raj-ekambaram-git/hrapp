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
  import {INVOICE_CALL_TYPE, PROJECT_TYPE_GENERAL, PROJECT_TYPE_STAFFING} from "../../constants/accountConstants";
import ProjectTimesheets from "../project/detail/projectTimesheets";
import { useSelector, useDispatch } from "react-redux";
import { removeItemFromInvoiceItemList, setInvoiceTotal } from "../../store/modules/Invoice/actions";
import { InvoiceConstants } from "../../constants/invoiceConstants";

const InvoiceItems = (props) => {
    const dispatch = useDispatch();

    const invoiceItemListNew = useSelector(state => state.invoice.invoiceItemList);
    const projectResources = useSelector(state => state.invoice.projectResources);
    const invoiceTotal = useSelector(state => state.invoice.invoiceTotal);

    const projectId = props.data.projectId; 
    const projectType = props.data.projectType;
    const invoiceType = props.data.invoiceType;


    useEffect(() => {
      }, []);
    
      const addInvoiceData = {
        projectType: projectType,
        projectResources: projectResources
      }

    function deleteInvoiceItem(removeIndex, invoiceItemTotal) {
        dispatch(removeItemFromInvoiceItemList(removeIndex));   

        if(invoiceTotal != undefined) {
            dispatch(setInvoiceTotal(parseFloat(invoiceTotal)-parseFloat(invoiceItemTotal)));
          }else {
            dispatch(setInvoiceTotal(parseFloat(total)));
          }
    }
    

    return (
        <div>
            <HStack>
                {invoiceType == InvoiceConstants.INVOICE_ITEM_TYPE_TIMESHEET ? (
                    <ProjectTimesheets data={{projectId: projectId, callType: INVOICE_CALL_TYPE}}/>
                ) : (
                    <AddInvoiceItem data={addInvoiceData}></AddInvoiceItem>
                )}
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
                                        <DeleteIcon onClick={() => deleteInvoiceItem(index, invoiceItem.total)}/>
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
