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
    HStack,
    Badge
  
  } from '@chakra-ui/react';
  import {
    DeleteIcon
  } from '@chakra-ui/icons';
  import {EMPTY_STRING, EXPENSE_CALL_TYPE, INVOICE_CALL_TYPE, PROJECT_TYPE_GENERAL, PROJECT_TYPE_STAFFING} from "../../constants/accountConstants";
import ProjectTimesheets from "../project/detail/projectTimesheets";
import { useSelector, useDispatch } from "react-redux";
import { removeItemFromInvoiceItemList, setInvoiceTotal } from "../../store/modules/Invoice/actions";
import { InvoiceConstants } from "../../constants/invoiceConstants";
import ProjectExpenses from "../project/detail/projectExpenses";
import { ExpenseStatus, InvoiceType, TimesheetStatus } from "@prisma/client";

const InvoiceItems = (props) => {
    const dispatch = useDispatch();

    const invoiceItemListNew = useSelector(state => state.invoice.invoiceItemList);
    const projectResources = useSelector(state => state.invoice.projectResources);
    const invoiceTotal = useSelector(state => state.invoice.invoiceTotal);

    // console.log("InvoiceItems ALL Data::"+JSON.stringify(props));

    const projectId = props.data.projectId; 
    const projectType = props.data.projectType;
    const invoiceType = props.data.invoiceType;

    console.log("invoiceType:::"+JSON.stringify(invoiceType)+"******projectType::"+projectType)

    useEffect(() => {
      }, []);
    
      const addInvoiceData = {
        projectType: invoiceType,
        projectResources: projectResources
      }

    function deleteInvoiceItem(removeIndex, invoiceItemTotal) {
        console.log("invoiceTotal:::"+JSON.stringify(invoiceTotal))
        dispatch(removeItemFromInvoiceItemList(removeIndex));   

        if(invoiceTotal != undefined) {
            console.log("Not Null")
            dispatch(setInvoiceTotal(parseFloat(invoiceTotal)-parseFloat(invoiceItemTotal)));
          }else {
            console.log("Null Conidtion")
            dispatch(setInvoiceTotal(parseFloat(invoiceItemTotal)));
          }
    }
    

    return (
        <div>
            <HStack>
                {invoiceType == InvoiceConstants.INVOICE_ITEM_TYPE_TIMESHEET ? (
                    <>
                        <ProjectTimesheets data={{projectId: projectId, callType: INVOICE_CALL_TYPE}}/>
                        <ProjectExpenses data={{projectId: projectId, callType: INVOICE_CALL_TYPE}}/>
                    </>
                ) : (invoiceType == InvoiceConstants.INVOICE_ITEM_TYPE_EXPENSE) ? (
                    <ProjectExpenses data={{projectId: projectId, callType: INVOICE_CALL_TYPE}}/>
                ) : (invoiceType == InvoiceConstants.INVOICE_ITEM_TYPE_PROJECT) ? (
                    <>
                        <ProjectTimesheets data={{projectId: projectId, callType: INVOICE_CALL_TYPE}}/>
                        <ProjectExpenses data={{projectId: projectId, callType: INVOICE_CALL_TYPE}}/>
                    </>
                ) : (invoiceType != undefined && invoiceType != EMPTY_STRING) ? (
                    <AddInvoiceItem data={addInvoiceData}></AddInvoiceItem>
                )
    
                : (
                    <></>
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
                                    Type
                                </Th>   
                                <Th>
                                    {props.data.invoiceType === PROJECT_TYPE_GENERAL ? (
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
                                Status
                                </Th>                                
                            </Tr>   
                        </Thead>                
                        <Tbody>
                            {invoiceItemListNew?.map((invoiceItem, index) => (
                                <Tr>
                                    <Th>
                                        <DeleteIcon color="red" onClick={() => deleteInvoiceItem(index, invoiceItem.total)}/>
                                    </Th>       
                                    <Th>
                                        {invoiceItem.type}
                                    </Th>                                                                      
                                    <Th>
                                        <Text pt='table_display_value' fontSize='table_display_value'>
                                            {props.data.invoiceType === PROJECT_TYPE_GENERAL ? (
                                                <>
                                                {invoiceItem.generalNote}</>
                                            ) : (
                                                <>
                                                {/* {invoiceItem.user?.firstName} {invoiceItem.user?.lastName} */}
                                                {invoiceItem.userId}
                                                </>
                                            )}                                
                                        </Text>
                                    </Th>
                                    <Th>
                                        <Text pt='table_display_value' fontSize='table_display_value'>
                                            $ {invoiceItem.unitPrice}
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
                                           $ {invoiceItem.total} 
                                        </Text>
                                    </Th>
                                    <Th>
                                        {(invoiceItem.type == InvoiceType.Expense)
                                        ?<>
                                            <Badge color={`${
                                                invoiceItem.expense?.status === ExpenseStatus.Invoiced
                                                ? "pending_status"
                                                : "paid_status"
                                            }`}>{invoiceItem.expense?.status}</Badge>   
                                        </>
                                        : (invoiceItem.type == InvoiceType.Timesheet)
                                        ?<>
                                            <Badge color={`${
                                                (invoiceItem.timesheetEntry?.status === TimesheetStatus.Invoiced || invoiceItem.timesheetEntry?.status === TimesheetStatus.PartiallyInvoiced)
                                                ? "pending_status"
                                                : "paid_status"
                                            }`}>{invoiceItem.timesheetEntry?.status}</Badge>   
                                        </>                                            
                                        : <></>}
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
