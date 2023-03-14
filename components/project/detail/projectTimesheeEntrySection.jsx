import React, { useState } from "react";
import {
  TableContainer,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Table,
  Tbody,
  Thead,
  Th,
  Tr,
  Button,
  Checkbox,
  Badge
} from '@chakra-ui/react';
import { TimesheetConstants } from "../../../constants/timesheetConstants";
import { COST_CALL_TYPE, EMPTY_STRING, INVOICE_CALL_TYPE } from "../../../constants";
import { useSelector } from "react-redux";
import { ExpenseType, InvoiceType, TimesheetStatus } from "@prisma/client";


const ProjectTimesheeEntrySection = (props) => {
    const timesheetEntries = props.data;
    const initialFocusRef = React.useRef();
    const tsEntriesArray = [timesheetEntries];
    const [selectedInvoiceItem, setSelectedInvoiceItem] = useState();
    const invoiceItemList = useSelector(state => state.invoice.invoiceItemList);
    const costItemList = useSelector(state => state.cost.costItemList);

    const handleTimesheetEntryInvoiceItem = async() => {
        if(props.callType === INVOICE_CALL_TYPE) {
            const currentInvoiceItem = invoiceItemList.filter((invoiceItem) => (invoiceItem.type ==InvoiceType.Timesheet && invoiceItem.timesheetEntryId == props.tseId));

            if(currentInvoiceItem && currentInvoiceItem.length>0 && currentInvoiceItem[0].detail) {
                setSelectedInvoiceItem(currentInvoiceItem[0].detail?.map((invoieItemDtl) => {
                    return invoieItemDtl.day;
                }))    
            }
        }
        if(props.callType === COST_CALL_TYPE) {
            const currentCostItem = costItemList.filter((costItem) => (costItem.type == ExpenseType.Resource_Cost && parseInt(costItem.notes.split("_")[0]) == props.tseId));

            if(currentCostItem && currentCostItem.length>0 && currentCostItem[0].detail) {
                setSelectedInvoiceItem(currentCostItem[0].detail?.map((costItemDtl) => {
                    return costItemDtl.day;
                }))    
            }
        }
    }

  return (

    <div>

        <Popover
        initialFocusRef={initialFocusRef}
        placement='bottom'
        closeOnBlur={false}
        >
            <PopoverTrigger>
                <Button size="xs" bgColor="header_actions"  onClick={() => handleTimesheetEntryInvoiceItem()}
                    >{`Details`}
                </Button>
           </PopoverTrigger>
            <PopoverContent>
                <PopoverHeader>
                    Entry Details
                </PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                    <TableContainer>
                        <Table>
                            <Thead>
                                <Tr bgColor="table_tile">
                                    <Th>
                                        
                                    </Th>                                    
                                    <Th>
                                        Day
                                    </Th>
                                    <Th>
                                        Hours
                                    </Th>
                                    <Th>
                                        Date
                                    </Th>
                                    <Th>
                                        Notes
                                    </Th>
                                    <Th>
                                        Status
                                    </Th>                                    
                                </Tr>
                            </Thead>
                            <Tbody>
                                    <Tr>
                                        <Th>
                                        {(((props.callType == INVOICE_CALL_TYPE && timesheetEntries.day1?.status != TimesheetStatus.Invoiced) || 
                                            (props.callType == COST_CALL_TYPE && timesheetEntries.day1?.status == TimesheetStatus.Invoiced)) && timesheetEntries.day1?.hours>0)?<>
                                            <Checkbox value="day1" isChecked={selectedInvoiceItem&&selectedInvoiceItem.includes("day1")} onChange={(e) => props.addTimesheetEntryAsInvoiceItem(e, props.tseId, TimesheetConstants.Daily)}/></>:<></>}
                                        </Th>                                        
                                        <Th>
                                            Day1
                                        </Th>
                                        <Th>
                                            {timesheetEntries.day1.hours}
                                        </Th>
                                        <Th>
                                            {timesheetEntries.day1.date}
                                        </Th>
                                        <Th>
                                            {timesheetEntries.day1.notes}
                                        </Th>            
                                        <Th>
                                            {timesheetEntries.day1.status?<>
                                                <Badge color={timesheetEntries.day1.status === TimesheetStatus.Invoiced?"paid_status":"pending_status"}>{timesheetEntries.day1.status?timesheetEntries.day1.status:"Open"}</Badge> 
                                            </>:<></>}                                           
                                        </Th>                                                                                                                                          
                                    </Tr>
                                <Tr>
                                    <Th>
                                        {(((props.callType == INVOICE_CALL_TYPE && timesheetEntries.day2?.status != TimesheetStatus.Invoiced) || 
                                            (props.callType == COST_CALL_TYPE && timesheetEntries.day2?.status == TimesheetStatus.Invoiced)) && timesheetEntries.day2?.hours>0)?<>
                                            <Checkbox value="day2" isChecked={selectedInvoiceItem&&selectedInvoiceItem.includes("day2")} onChange={(e) => props.addTimesheetEntryAsInvoiceItem(e, props.tseId, TimesheetConstants.Daily)}/></>:<></>}
                                    </Th>  
                                    <Th>
                                        Day2
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day2.hours}
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day2.date}
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day2.notes}
                                    </Th>     
                                    <Th>
                                        {timesheetEntries.day2.status?<>
                                                <Badge color={timesheetEntries.day2.status === TimesheetStatus.Invoiced?"paid_status":"pending_status"}>{timesheetEntries.day2.status?timesheetEntries.day2.status:"Open"}</Badge> 
                                        </>:<></>}                                           
                                    </Th>                                                                                                                                          
                                </Tr>
                                <Tr>
                                    <Th>
                                        {(((props.callType == INVOICE_CALL_TYPE && timesheetEntries.day3?.status != TimesheetStatus.Invoiced) || 
                                            (props.callType == COST_CALL_TYPE && timesheetEntries.day3?.status == TimesheetStatus.Invoiced))  && timesheetEntries.day3?.hours>0)?<>
                                            <Checkbox value="day3" isChecked={selectedInvoiceItem&&selectedInvoiceItem.includes("day3")} onChange={(e) => props.addTimesheetEntryAsInvoiceItem(e, props.tseId, TimesheetConstants.Daily)}/></>:<></>}
                                    </Th>                                      
                                    <Th>
                                        Day3
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day3.hours}
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day3.date}
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day3.notes}
                                    </Th>          
                                    <Th>
                                        {timesheetEntries.day3.status?<>
                                                <Badge color={timesheetEntries.day3.status === TimesheetStatus.Invoiced?"paid_status":"pending_status"}>{timesheetEntries.day3.status?timesheetEntries.day3.status:"Open"}</Badge> 
                                        </>:<></>}                                           
                                    </Th>                                                                                                                                          
                                </Tr>
                                <Tr>
                                    <Th>
                                        {(((props.callType == INVOICE_CALL_TYPE && timesheetEntries.day4?.status != TimesheetStatus.Invoiced) || 
                                            (props.callType == COST_CALL_TYPE && timesheetEntries.day4?.status == TimesheetStatus.Invoiced)) && timesheetEntries.day4?.hours>0)?<>
                                            <Checkbox value="day4" isChecked={selectedInvoiceItem&&selectedInvoiceItem.includes("day4")} onChange={(e) => props.addTimesheetEntryAsInvoiceItem(e, props.tseId, TimesheetConstants.Daily)}/></>:<></>}
                                    </Th>                                      
                                    <Th>
                                        Day4
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day4.hours}
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day4.date}
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day4.notes}
                                    </Th>      
                                    <Th>
                                        {timesheetEntries.day4.status?<>
                                                <Badge color={timesheetEntries.day4?.status === TimesheetStatus.Invoiced?"paid_status":"pending_status"}>{timesheetEntries.day4?.status?timesheetEntries.day4.status:"Open"}</Badge> 
                                        </>:<></>}                                           
                                    </Th>                                                                                                                                          
                                </Tr>
                                <Tr>
                                    <Th>
                                        {(((props.callType == INVOICE_CALL_TYPE && timesheetEntries.day5?.status != TimesheetStatus.Invoiced) || 
                                            (props.callType == COST_CALL_TYPE && timesheetEntries.day5?.status == TimesheetStatus.Invoiced)) && timesheetEntries.day5?.hours>0)?<>
                                            <Checkbox value="day5" isChecked={selectedInvoiceItem&&selectedInvoiceItem.includes("day5")} onChange={(e) => props.addTimesheetEntryAsInvoiceItem(e, props.tseId, TimesheetConstants.Daily)}/></>:<></>}
                                    </Th>                                      
                                    <Th>
                                        Day5
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day5.hours}
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day5.date}
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day5.notes}
                                    </Th>                       
                                    <Th>
                                        {timesheetEntries.day5.status?<>
                                                <Badge color={timesheetEntries.day5.status === TimesheetStatus.Invoiced?"paid_status":"pending_status"}>{timesheetEntries.day5.status?timesheetEntries.day5.status:"Open"}</Badge> 
                                        </>:<></>}                                           
                                    </Th>                                                                                                                                          
                                </Tr>
                                <Tr>
                                    <Th>
                                        {(((props.callType == INVOICE_CALL_TYPE && timesheetEntries.day6?.status != TimesheetStatus.Invoiced) || 
                                            (props.callType == COST_CALL_TYPE && timesheetEntries.day6?.status == TimesheetStatus.Invoiced)) && timesheetEntries.day6?.hours>0)?<>
                                            <Checkbox value="day6" isChecked={selectedInvoiceItem&&selectedInvoiceItem.includes("day6")}  onChange={(e) => props.addTimesheetEntryAsInvoiceItem(e, props.tseId, TimesheetConstants.Daily)}/></>:<></>}
                                    </Th>                                      
                                    <Th>
                                        Day6
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day6.hours}
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day6.date}
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day6.notes}
                                    </Th>             
                                    <Th>
                                        {timesheetEntries.day6.status?<>
                                                <Badge color={timesheetEntries.day6.status === TimesheetStatus.Invoiced?"paid_status":"pending_status"}>{timesheetEntries.day6.status?timesheetEntries.day6.status:"Open"}</Badge> 
                                        </>:<></>}                                           
                                    </Th>                                                                                                                                          
                                </Tr>
                                <Tr>
                                    <Th>
                                        {(((props.callType == INVOICE_CALL_TYPE && timesheetEntries.day7?.status != TimesheetStatus.Invoiced) || 
                                            (props.callType == COST_CALL_TYPE && timesheetEntries.day7?.status == TimesheetStatus.Invoiced)) && timesheetEntries.day7?.hours>0)?<>
                                            <Checkbox value="day7" isChecked={selectedInvoiceItem&&selectedInvoiceItem.includes("day7")} onChange={(e) => props.addTimesheetEntryAsInvoiceItem(e, props.tseId, TimesheetConstants.Daily)}/></>:<></>}
                                    </Th>   
                                    <Th>
                                        Day7
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day7.hours}
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day7.date}
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day7.notes}
                                    </Th>               
                                    <Th>
                                        {timesheetEntries.day7.status?<>
                                                <Badge color={timesheetEntries.day7.status === TimesheetStatus.Invoiced?"paid_status":"pending_status"}>{timesheetEntries.day7.status?timesheetEntries.day7.status:"Open"}</Badge> 
                                        </>:<></>}                                           
                                    </Th>                                                                                                                                          
                                </Tr>                                                                                                                                                                                                
                            </Tbody>
                        </Table>                        
                    </TableContainer>                       
                </PopoverBody>
            </PopoverContent>
        </Popover>        
    </div>


  );
};

export default ProjectTimesheeEntrySection;
