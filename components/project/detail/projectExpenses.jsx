import React, { useState, useEffect, useRef } from "react";
import {
    useDisclosure,
    Button,
    Box,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    Stack,
    StackDivider,
    HStack,
    Checkbox
  } from '@chakra-ui/react';
import { projectService, userService } from "../../../services";
import { useSelector, useDispatch } from "react-redux";
import { getAllProjectExpenses} from '../../../store/modules/Expense/actions';
import {removeExpenseFromInvoiceItems, setInvoiceTotal, setInvoiceItemList, setSelectedInvoiceExpId, removeExpFromSelectedExp} from '../../../store/modules/Invoice/actions';
import { util } from "../../../helpers/util";
import { EMPTY_STRING, EXPENSE_STATUS, INVOICE_CALL_TYPE } from "../../../constants/accountConstants";
import { InvoiceConstants } from "../../../constants/invoiceConstants";
import { ExpenseStatus } from "@prisma/client";
import ProjectExpenseEntriesSection from "./projectExpenseEntriesSection";
import { ProjectConstants } from "../../../constants";
import { CustomTable } from "../../customTable/Table";



const ProjectExpenses = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const projectId = props.data.projectId;
    const callType = props.data.callType;
    const [size, setSize] = useState('');
    const [enableAddExpense, setEnableAddExpense] = useState(false);
    const [expenseEntriesForTable, setExpenseEntriesForTable] = useState([]);
    const expenseListRef = useRef([]);
    const selectedExpIdsRef = useRef([]);
    const [invTotal, setInvTotal] = useState({total: 0});
    const EXPENSE_LIST_TABLE_COLUMNS = React.useMemo(() => ProjectConstants.EXPENSE_LIST_TABLE_META)
    const expenseList = useSelector(state => state.expense.projectExpenses);
    const invoiceTotal = useSelector(state => state.invoice.invoiceTotal);
    const selectedExpIds = useSelector(state => state.invoice.selectedInvoiceExpId);

    useEffect(() => {
      invTotal.total = invoiceTotal;
      selectedExpIdsRef.current = selectedExpIds;
    }, [invoiceTotal, selectedExpIds]);

    function prepareExpenseListForTable(projectExpenseByStatus) {
      if(projectExpenseByStatus != undefined && projectExpenseByStatus != EMPTY_STRING && projectExpenseByStatus.length != 0) {        
        const updatedExpenseist =  projectExpenseByStatus.map((expense, index)=> {
          
          if((callType == INVOICE_CALL_TYPE && expense.status == ExpenseStatus.Approved && util.getTotalBillableExpense(expense.expenseEntries).billableExpense > 0)) {
            expense.enableAddtoInvoiceCheckBox = <Checkbox value={expense.id} isChecked={selectedExpIdsRef.current.includes(expense.id)?true:false}  onChange={(e) => addExpenseAsInvoiceItem(e)}/>    
          }
          expense.name = expense.name
          expense.resource = expense.user?.firstName?expense.user?.firstName:EMPTY_STRING+" "+expense.user?.lastName?expense.user?.lastName:EMPTY_STRING
          const expenseAmount = util.getTotalBillableExpense(expense.expenseEntries)
          expense.totalAmount = expense.expenseEntries?util.getWithCurrency((util.getZeroPriceForNull(expenseAmount.billableExpense)+util.getZeroPriceForNull(expenseAmount.nonBillableExpense)+util.getZeroPriceForNull(expenseAmount.totalProjectCost))):""
          expense.detailAction =  <ProjectExpenseEntriesSection data={expense.expenseEntries}/>
          expense.status = expense.status
          expense.approvedOn = util.getFormattedDate(expense.approvedDate)
          expense.approvedBy = expense?.approvedBy?.firstName?expense?.approvedBy?.firstName:EMPTY_STRING+" "+expense?.approvedBy?.lastName?expense?.approvedBy?.lastName:EMPTY_STRING
          expense.lastUpdated = util.getFormattedDate(expense.lastUpdateDate)

          return expense;
        });
        setExpenseEntriesForTable(updatedExpenseist);
      }else {
        setExpenseEntriesForTable([]);
      }
    }

    const handleProjectExpenses = async (newSize) => {
        
      const projectTimesheeetByStatus = await projectService.getAllExpensesByProject({projectId: projectId, accountId: userService.getAccountDetails().accountId });
      expenseListRef.current = projectTimesheeetByStatus;
      dispatch(getAllProjectExpenses(projectTimesheeetByStatus));
      prepareExpenseListForTable(projectTimesheeetByStatus)

      // projectService.getAllTimesheetsByProject(projectId, userService.getAccountDetails().accountId);
      setSize(newSize);
      onOpen();
    }

    async function handleInvoiceExpenses(status) {
      const projectTimesheeetByStatus = await projectService.getProjectExpensesByStatus({projectId: projectId, accountId: userService.getAccountDetails().accountId, status: status });
      expenseListRef.current = projectTimesheeetByStatus;
      dispatch(getAllProjectExpenses(projectTimesheeetByStatus));
      prepareExpenseListForTable(projectTimesheeetByStatus)

    }

    function addExpenseAsInvoiceItem(e) {
      const selectedExpense = [...expenseListRef.current].find(x => x.id === parseInt(e.target.value));
      const totalExpenseAmount = util.getTotalBillableExpense(selectedExpense?.expenseEntries).billableExpense;

      if(e.target.checked) { //Add the timesheet entry to the invoice item list
        if(!enableAddExpense) {
          setEnableAddExpense(true);
        }
        const addedExpenseInvoiceItem = {
          expenseId: parseInt(e.target.value),
          userId: parseInt(selectedExpense.userId),
          type: InvoiceConstants.INVOICE_ITEM_TYPE_EXPENSE,
          status: InvoiceConstants.INVOICE_STATUS.Draft,
          unitPrice: totalExpenseAmount,
          quantity: parseInt(1),
          currency: InvoiceConstants.INVOICE_CURRENCY_USD,
          uom: InvoiceConstants.INVOICE_UOM_ITEM,
          total: totalExpenseAmount,
          // fromDate: new Date(selectedTimesheetEntry.entries?.day1.date),
          // toDate: new Date(selectedTimesheetEntry.entries?.day7?.date)
        };
          dispatch(setInvoiceItemList(addedExpenseInvoiceItem));
          dispatch(setSelectedInvoiceExpId(parseInt(e.target.value)))
          selectedExpIdsRef.current.push(parseInt(e.target.value));
          if(invTotal != undefined) {
            invTotal.total = invTotal.total+parseFloat(totalExpenseAmount)
            dispatch(setInvoiceTotal(invTotal.total));
          }else {
            invTotal.total = invTotal.total+parseFloat(totalExpenseAmount)
            dispatch(setInvoiceTotal(parseFloat(totalExpenseAmount)));
          }
          prepareExpenseListForTable(expenseListRef.current);
      } else { // Remove the timesheet entry form the invoice item list if exists
        dispatch(removeExpenseFromInvoiceItems(e.target.value));   
        dispatch(removeExpFromSelectedExp(e.target.value))
        if(invTotal != undefined) {
            invTotal.total = invTotal.total-parseFloat(totalExpenseAmount)
            dispatch(setInvoiceTotal(invTotal.total));
          }else {
            dispatch(setInvoiceTotal(parseFloat(total)));
        }

        const newSelecteExpenseIds = [...selectedExpIdsRef.current]
        const index = newSelecteExpenseIds.indexOf(parseInt(e.target.value));
        if (index > -1) { // only splice array when item is found
          newSelecteExpenseIds.splice(index, 1); // 2nd parameter means remove one item only
        }
        selectedExpIdsRef.current = newSelecteExpenseIds;

        prepareExpenseListForTable(expenseListRef.current);
      }

    }
    function handleAddExpensesToInvoice() {
      onClose();   
    }
  return (

    <div>
        
        <Button size="xs" bgColor="header_actions"
              onClick={() => handleProjectExpenses("xxl")}
              key="xxl"
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
                                <Button size="xs" bgColor="header_actions"  onClick={() => handleInvoiceExpenses(EXPENSE_STATUS.Pending)} width="timesheet.project_timesheets_button" >
                                  Pending
                                </Button>     
                                <Button size="xs" bgColor="header_actions"  onClick={() => handleInvoiceExpenses(ExpenseStatus.Approved)} width="timesheet.project_timesheets_button" >
                                  Approved
                                </Button> 
                                <Button size="xs" bgColor="header_actions"  onClick={() => handleInvoiceExpenses(ExpenseStatus.Invoiced)} width="timesheet.project_timesheets_button" >
                                  Invoiced
                                </Button>  
                                <Button size="xs" bgColor="header_actions"  onClick={() => handleInvoiceExpenses(ExpenseStatus.Rejected)} width="timesheet.project_timesheets_button" >
                                  Rejected
                                </Button>  
                                <Button size="xs" bgColor="header_actions"  onClick={() => handleInvoiceExpenses(ExpenseStatus.Paid)} width="timesheet.project_timesheets_button" >
                                  Paid
                                </Button>  
                                {(callType==INVOICE_CALL_TYPE && enableAddExpense)? (
                                  <>
                                  <Button size="xs" bgColor="header_actions"  onClick={() => handleAddExpensesToInvoice()} width="timesheet.project_timesheets_button" >
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
                                {/* <Table variant="sortTable">
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
                                  
                                </Table> */}
                                <CustomTable columns={EXPENSE_LIST_TABLE_COLUMNS} rows={expenseEntriesForTable} />
                            </Box>                            
                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
          </Drawer>

    </div>


  );
};

export default ProjectExpenses;
