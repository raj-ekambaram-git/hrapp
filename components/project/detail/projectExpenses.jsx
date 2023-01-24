import React, { useState, useEffect } from "react";
import {
    useDisclosure,
    Button,
    Table,
    Thead,
    Tbody,
    Th,
    Tr,
    Box,
    Heading,
    TableCaption,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    Stack,
    StackDivider,
    Badge,
    HStack,
    Checkbox
  } from '@chakra-ui/react';
import { userService } from "../../../services";
import { useSelector, useDispatch } from "react-redux";
import {fetchAllProjectExpenses, fetchProjectExpensesByStatus} from '../../../store/modules/Expense/actions';
import {removeExpenseFromInvoiceItems, setInvoiceTotal, setInvoiceItemList} from '../../../store/modules/Invoice/actions';
import { util } from "../../../helpers/util";
import { INVOICE_CALL_TYPE, TIMESHEET_STATUS } from "../../../constants/accountConstants";
import { InvoiceConstants } from "../../../constants/invoiceConstants";
import { ExpenseStatus } from "@prisma/client";
import ProjectExpenseEntriesSection from "./projectExpenseEntriesSection";



const ProjectExpenses = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const projectId = props.data.projectId;
    const callType = props.data.callType;
    const [size, setSize] = useState('');
    const [enableAddExpense, setEnableAddExpense] = useState(false);
    
    const expenseList = useSelector(state => state.expense.projectExpenses);
    const invoiceTotal = useSelector(state => state.invoice.invoiceTotal);


    useEffect(() => {

    }, []);

    const handleProjectExpenses = (newSize) => {
        
        dispatch(fetchAllProjectExpenses({projectId: projectId, accountId: userService.getAccountDetails().accountId }));
        // projectService.getAllTimesheetsByProject(projectId, userService.getAccountDetails().accountId);
        setSize(newSize);
        onOpen();
    }

    function handlePendingInvoiceExpenses() {
      dispatch(fetchProjectExpensesByStatus({projectId: projectId, accountId: userService.getAccountDetails().accountId, status: TIMESHEET_STATUS.Pending }));
    }

    function handleApprovedExpenses() {
      dispatch(fetchProjectExpensesByStatus({projectId: projectId, accountId: userService.getAccountDetails().accountId, status: TIMESHEET_STATUS.Approved }));
    }

    function handleInvoicedExpenses() {
      dispatch(fetchProjectExpensesByStatus({projectId: projectId, accountId: userService.getAccountDetails().accountId, status: TIMESHEET_STATUS.Invoiced }));
    }

    function handleRejectedExpenses() {
      dispatch(fetchProjectExpensesByStatus({projectId: projectId, accountId: userService.getAccountDetails().accountId, status: TIMESHEET_STATUS.Rejected }));
    }
    
    function addExpenseAsInvoiceItem(e) {
      const selectedExpense = expenseList.find(x => x.id === parseInt(e.target.value));
      const totalExpenseAmount = util.getTotalBillableExpense(selectedExpense.expenseEntries).billableExpense;

      if(e.target.checked) { //Add the timesheet entry to the invoice item list
        if(!enableAddExpense) {
          setEnableAddExpense(true);
        }
        const addedExpenseInvoiceItem = {
          expenseId: parseInt(e.target.value),
          userId: parseInt(selectedExpense.user?.id),
          type: InvoiceConstants.INVOICE_ITEM_TYPE_EXPENSE,
          status: InvoiceConstants.INVOICE_STATUS.Draft,
          unitPrice: totalExpenseAmount.billableExpense,
          quantity: parseInt(1),
          currency: InvoiceConstants.INVOICE_CURRENCY_USD,
          uom: InvoiceConstants.INVOICE_UOM_HOURS,
          total: totalExpenseAmount.billableExpense,
          // fromDate: new Date(selectedTimesheetEntry.entries?.day1.date),
          // toDate: new Date(selectedTimesheetEntry.entries?.day7?.date)
        };
          dispatch(setInvoiceItemList(addedExpenseInvoiceItem));
          if(invoiceTotal != undefined) {
            dispatch(setInvoiceTotal(parseFloat(invoiceTotal)+parseFloat(totalExpenseAmount)));
          }else {
            dispatch(setInvoiceTotal(parseFloat(totalExpenseAmount)));
          }
      } else { // Remove the timesheet entry form the invoice item list if exists
        dispatch(removeExpenseFromInvoiceItems(e.target.value));   
        if(invoiceTotal != undefined) {
            dispatch(setInvoiceTotal(parseFloat(invoiceTotal)-parseFloat(totalExpenseAmount)));
          }else {
            dispatch(setInvoiceTotal(parseFloat(total)));
        }

      }

    }
    function handleAddExpensesToInvoice() {
      onClose();   
    }
  return (

    <div>
        
        <Button size="xs" bgColor="header_actions"
              onClick={() => handleProjectExpenses("xl")}
              key="xl"
              m={1}
              >{`Expenses`}
          </Button>

          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                          Project Expenses
                        </DrawerHeader>
                        <DrawerBody>
                          <Stack divider={<StackDivider />} spacing='1'>
                            <Box>
                              <HStack>
                                <Button className="btn" onClick={() => handlePendingInvoiceExpenses()} width="timesheet.project_timesheets_button" bgColor="button.primary.color">
                                  Pending
                                </Button>     
                                <Button className="btn" onClick={() => handleApprovedExpenses()} width="timesheet.project_timesheets_button" bgColor="button.primary.color">
                                  Approved
                                </Button> 
                                <Button className="btn" onClick={() => handleInvoicedExpenses()} width="timesheet.project_timesheets_button" bgColor="button.primary.color">
                                  Invoiced
                                </Button>  
                                <Button className="btn" onClick={() => handleRejectedExpenses()} width="timesheet.project_timesheets_button" bgColor="button.primary.color">
                                  Rejected
                                </Button>  
                                {(callType==INVOICE_CALL_TYPE && enableAddExpense)? (
                                  <>
                                  <Button className="btn" onClick={() => handleAddExpensesToInvoice()} width="timesheet.project_timesheets_button" bgColor="button.primary.color">
                                    Add to Invoice
                                  </Button>  
                                  </>
                                ) : (
                                  <>
                                  </>
                                )}
                              </HStack>                                                   
                            </Box>
                            <Box border="box_border">
                                <Table>
                                  <TableCaption></TableCaption>
                                  <Thead></Thead>
                                  <Tbody>
                                    <Tr bgColor="table_tile">
                                      <Th>

                                      </Th>
                                        <Th width="timesheet.project_timesheets_name">
                                            Name
                                        </Th>
                                        <Th width="timesheet.project_timesheets_resource">
                                            Resoure
                                        </Th>
                                        <Th width="timesheet.project_timesheets_hours">
                                            Amount
                                        </Th>
                                        <Th width="timesheet.project_timesheets_status">
                                            Status
                                        </Th>
                                        <Th width="timesheet.project_timesheets_approved_on">
                                            Approved On
                                        </Th>
                                        <Th width="timesheet.project_timesheets_approved_by">
                                            Approved By
                                        </Th>                                                                                
                                        <Th width="timesheet.project_timesheets_last_update">
                                            Last Updated
                                        </Th>
                                    </Tr>
                                    {expenseList?.map((expense) => (
                                    
                                        <Tr>
                                          <Th>
                                            {(callType == INVOICE_CALL_TYPE && expense.status == ExpenseStatus.Approved && util.getTotalBillableExpense(expense.expenseEntries).billableExpense > 0) ? (
                                              <>
                                                <Checkbox value={expense.id}
                                                  onChange={(e) => addExpenseAsInvoiceItem(e)}
                                                />        
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                          </Th>
                                            <Th>
                                                {expense.name}
                                            </Th>
                                            <Th>
                                                {expense.user?.firstName} {expense.user?.lastName}
                                            </Th>
                                            <Th>
                                              {expense.expenseEntries ? (
                                                <>
                                                <HStack>
                                                  <Box marginRight={3}>
                                                    {util.getWithCurrency(util.getTotalBillableExpense(expense.expenseEntries).billableExpense)}
                                                  </Box>
                                                  <ProjectExpenseEntriesSection data={expense.expenseEntries}/>
                                                  </HStack>
                                                </>
                                              ) : (
                                                <>
                                                </>
                                              )}
                                                

                                            </Th>
                                            <Th>
                                                <Badge color={`${
                                                    (expense.status !== "Rejected" )
                                                    ? "paid_status"
                                                   : "pending_status"
                                                }`}>{expense.status}</Badge>
                                            </Th>   
                                            <Th>
                                                {util.getFormattedDate(expense.approvedDate)}
                                            </Th> 
                                            <Th>
                                                {expense?.approvedBy?.firstName} {expense.approvedBy?.lastName}
                                            </Th> 
                                            <Th>
                                                {util.getFormattedDate(expense.lastUpdateDate)}
                                            </Th>                                                                                    
                                    </Tr>
                                              
                                    ))}
                                  </Tbody>
                                  
                                </Table>
                            </Box>                            
                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
          </Drawer>

    </div>


  );
};

export default ProjectExpenses;
