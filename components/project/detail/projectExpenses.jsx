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
import {fetchAllProjectTimesheets, fetchProjectTimesheetsByStatus} from '../../../store/modules/Timesheet/actions';
import {removeTSFromInvoiceItems, setInvoiceTotal, setInvoiceItemList} from '../../../store/modules/Invoice/actions';
import { util } from "../../../helpers/util";
import ProjectTimesheeEntrySection from "./projectTimesheeEntrySection";
import { INVOICE_CALL_TYPE, TIMESHEET_STATUS } from "../../../constants/accountConstants";
import { InvoiceConstants } from "../../../constants/invoiceConstants";
import { DrawerMainHeader } from "../../common/drawerMainHeader";



const ProjectTimesheets = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const projectId = props.data.projectId;
    const callType = props.data.callType;
    const [size, setSize] = useState('');
    const [enableAddTimeSheetEntry, setEnableAddTimeSheetEntry] = useState(false);
    
    const timesheetEntryList = useSelector(state => state.timesheet.projectTimesheets);
    const invoiceTotal = useSelector(state => state.invoice.invoiceTotal);


    useEffect(() => {

    }, []);

    const handleProjectTimesheets = (newSize) => {
        
        dispatch(fetchAllProjectTimesheets({projectId: projectId, accountId: userService.getAccountDetails().accountId }));
        // projectService.getAllTimesheetsByProject(projectId, userService.getAccountDetails().accountId);
        setSize(newSize);
        onOpen();
    }

    function handlePendingInvoiceTimesheets() {
      dispatch(fetchProjectTimesheetsByStatus({projectId: projectId, accountId: userService.getAccountDetails().accountId, status: TIMESHEET_STATUS.Pending }));
    }

    function handleApprovedTimesheets() {
      dispatch(fetchProjectTimesheetsByStatus({projectId: projectId, accountId: userService.getAccountDetails().accountId, status: TIMESHEET_STATUS.Approved }));
    }

    function handleInvoicedTimesheets() {
      dispatch(fetchProjectTimesheetsByStatus({projectId: projectId, accountId: userService.getAccountDetails().accountId, status: TIMESHEET_STATUS.Invoiced }));
    }

    function handleRejectedTimesheets() {
      dispatch(fetchProjectTimesheetsByStatus({projectId: projectId, accountId: userService.getAccountDetails().accountId, status: TIMESHEET_STATUS.Rejected }));
    }
    
    function addTimesheetEntryAsInvoiceItem(e) {
      console.log("Checked value:::"+e.target.checked+"----Value::"+e.target.value);
      const selectedTimesheetEntry = timesheetEntryList.find(x => x.id === parseInt(e.target.value));
      const selectedTSQuantity = util.getTotalHours(selectedTimesheetEntry.entries);
      const selectedTSTotal = parseFloat(selectedTSQuantity) * parseFloat(selectedTimesheetEntry.unitPrice);


      if(e.target.checked) { //Add the timesheet entry to the invoice item list
        if(!enableAddTimeSheetEntry) {
          setEnableAddTimeSheetEntry(true);
        }
        const addedTimesheetInvoiceItem = {
          timesheetEntryId: parseInt(e.target.value),
          userId: parseInt(selectedTimesheetEntry.timesheet?.user?.id),
          type: InvoiceConstants.INVOICE_ITEM_TYPE_TIMESHEET,
          status: InvoiceConstants.INVOICE_STATUS.Draft,
          unitPrice: selectedTimesheetEntry.unitPrice,
          quantity: parseInt(selectedTSQuantity),
          currency: InvoiceConstants.INVOICE_CURRENCY_USD,
          uom: InvoiceConstants.INVOICE_UOM_HOURS,
          total: selectedTSTotal,
          fromDate: new Date(selectedTimesheetEntry.entries?.day1.date),
          toDate: new Date(selectedTimesheetEntry.entries?.day7?.date)
        };
          dispatch(setInvoiceItemList(addedTimesheetInvoiceItem));
          if(invoiceTotal != undefined) {
            dispatch(setInvoiceTotal(parseFloat(invoiceTotal)+parseFloat(selectedTSTotal)));
          }else {
            dispatch(setInvoiceTotal(parseFloat(selectedTSTotal)));
          }
      } else { // Remove the timesheet entry form the invoice item list if exists
        dispatch(removeTSFromInvoiceItems(e.target.value));   
        if(invoiceTotal != undefined) {
            dispatch(setInvoiceTotal(parseFloat(invoiceTotal)-parseFloat(selectedTSTotal)));
          }else {
            dispatch(setInvoiceTotal(parseFloat(total)));
        }

      }

    }
    function handleAddTimesheetsToInvoice() {
      onClose();   
    }
  return (

    <div>
        
        <Button size="xs" bgColor="header_actions"
              onClick={() => handleProjectTimesheets("xl")}
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
                                <Button className="btn" onClick={() => handlePendingInvoiceTimesheets()} width="timesheet.project_timesheets_button" bgColor="button.primary.color">
                                  Pending
                                </Button>     
                                <Button className="btn" onClick={() => handleApprovedTimesheets()} width="timesheet.project_timesheets_button" bgColor="button.primary.color">
                                  Approved
                                </Button> 
                                <Button className="btn" onClick={() => handleInvoicedTimesheets()} width="timesheet.project_timesheets_button" bgColor="button.primary.color">
                                  Invoiced
                                </Button>  
                                <Button className="btn" onClick={() => handleRejectedTimesheets()} width="timesheet.project_timesheets_button" bgColor="button.primary.color">
                                  Rejected
                                </Button>  
                                {(callType==INVOICE_CALL_TYPE && enableAddTimeSheetEntry)? (
                                  <>
                                  <Button className="btn" onClick={() => handleAddTimesheetsToInvoice()} width="timesheet.project_timesheets_button" bgColor="button.primary.color">
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
                                            Hours
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
                                    {timesheetEntryList?.map((timesheetEntry) => (
                                    
                                        <Tr>
                                          <Th>
                                            {(callType == INVOICE_CALL_TYPE && timesheetEntry.status == TIMESHEET_STATUS.Approved) ? (
                                              <>
                                                <Checkbox value={timesheetEntry.id}
                                                  onChange={(e) => addTimesheetEntryAsInvoiceItem(e)}
                                                />        
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                          </Th>
                                            <Th>
                                                {timesheetEntry.timesheet?.name}
                                            </Th>
                                            <Th>
                                                {timesheetEntry.timesheet?.user?.firstName} {timesheetEntry.timesheet?.user?.lastName}
                                            </Th>
                                            <Th>
                                              {timesheetEntry.entries ? (
                                                <>
                                                <HStack>
                                                  <Box marginRight={3}>
                                                    {util.getTotalHours(timesheetEntry.entries)}
                                                  </Box>
                                                  <ProjectTimesheeEntrySection data={timesheetEntry.entries}/>
                                                  </HStack>
                                                </>
                                              ) : (
                                                <>
                                                </>
                                              )}
                                                

                                            </Th>
                                            <Th>
                                                <Badge color={`${
                                                    (timesheetEntry.status !== "Rejected" )
                                                    ? "paid_status"
                                                   : "pending_status"
                                                }`}>{timesheetEntry.status}</Badge>
                                            </Th>   
                                            <Th>
                                                {util.getFormattedDate(timesheetEntry.approvedDate)}
                                            </Th> 
                                            <Th>
                                                {timesheetEntry?.approvedUser?.firstName} {timesheetEntry.approvedUser?.lastName}
                                            </Th> 
                                            <Th>
                                                {util.getFormattedDate(timesheetEntry.lastUpdateDate)}
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

export default ProjectTimesheets;
