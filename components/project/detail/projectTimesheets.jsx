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
import { projectService, userService } from "../../../services";
import { useSelector, useDispatch } from "react-redux";
import {fetchAllProjectTimesheets, fetchProjectTimesheetsByStatus, getAllProjectTimesheets} from '../../../store/modules/Timesheet/actions';
import {removeTSFromInvoiceItems, setInvoiceTotal, setInvoiceItemList} from '../../../store/modules/Invoice/actions';
import { util } from "../../../helpers/util";
import ProjectTimesheeEntrySection from "./projectTimesheeEntrySection";
import { INVOICE_CALL_TYPE, TIMESHEET_STATUS, EMPTY_STRING } from "../../../constants/accountConstants";
import { InvoiceConstants } from "../../../constants/invoiceConstants";
import { DrawerMainHeader } from "../../common/drawerMainHeader";
import { ProjectConstants } from "../../../constants";
import { TimesheetStatus } from "@prisma/client";
import { CustomTable } from "../../customTable/Table";



const ProjectTimesheets = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const projectId = props.data.projectId;
    const callType = props.data.callType;
    const [size, setSize] = useState('');
    const [timsheetEntriesForTable, setTimsheetEntriesForTable] = useState([]);
    const [enableAddTimeSheetEntry, setEnableAddTimeSheetEntry] = useState(false);
    const TIMESHEET_LIST_TABLE_COLUMNS = React.useMemo(() => ProjectConstants.TIMESHEET_LIST_TABLE_META)

    const timesheetEntryList = useSelector(state => state.timesheet.projectTimesheets);
    const invoiceTotal = useSelector(state => state.invoice.invoiceTotal);


    useEffect(() => {

    }, []);

    function prepareTimesheetListForTable(projectTimesheeetByStatus) {
      if(projectTimesheeetByStatus != undefined && projectTimesheeetByStatus != EMPTY_STRING && projectTimesheeetByStatus.length != 0) {        
        const updatedTSEist =  projectTimesheeetByStatus.map((timesheetEntry, index)=> {
          if(callType == INVOICE_CALL_TYPE && timesheetEntry.status == TIMESHEET_STATUS.Approved && timesheetEntry.billable) {
            timesheetEntry.enableAddtoInvoiceCheckBox = <Checkbox value={timesheetEntry.id} onChange={(e) => addTimesheetEntryAsInvoiceItem(e)} />
          }
          timesheetEntry.name = timesheetEntry.timesheet?.name
          timesheetEntry.resource = timesheetEntry.timesheet?.user?.firstName?timesheetEntry.timesheet?.user?.firstName:EMPTY_STRING+" "+timesheetEntry.timesheet?.user?.lastName?timesheetEntry.timesheet?.user?.lastName:EMPTY_STRING
          timesheetEntry.totalHours = timesheetEntry.entries?(<HStack><Box marginRight={3}>{util.getTotalHours(timesheetEntry.entries)}</Box><ProjectTimesheeEntrySection data={timesheetEntry.entries}/></HStack>):""
          timesheetEntry.status = <Badge color={`${(timesheetEntry.status !== "Rejected" )? "paid_status": "pending_status"}`}>{timesheetEntry.status}</Badge>
          timesheetEntry.approvedOn = util.getFormattedDate(timesheetEntry.approvedDate)
          timesheetEntry.approvedBy = timesheetEntry?.approvedUser?.firstName?timesheetEntry?.approvedUser?.firstName:EMPTY_STRING+" "+timesheetEntry.approvedUser?.lastName?timesheetEntry.approvedUser?.lastName:EMPTY_STRING
          timesheetEntry.lastUpdated = util.getFormattedDate(timesheetEntry.lastUpdateDate)

          return timesheetEntry;
        });
        setTimsheetEntriesForTable(updatedTSEist);
      }else {
        setTimsheetEntriesForTable([]);
      }
    }

    const handleProjectTimesheets = async (newSize) => {
      const projectTimesheeetByStatus = await projectService.getAllTimesheetsByProject({projectId: projectId, accountId: userService.getAccountDetails().accountId });
      dispatch(getAllProjectTimesheets(projectTimesheeetByStatus));
      prepareTimesheetListForTable(projectTimesheeetByStatus)
      // projectService.getAllTimesheetsByProject(projectId, userService.getAccountDetails().accountId);
      setSize(newSize);
      onOpen();
    }

    async function handleInvoiceTimesheets(status) {
      
      const projectTimesheeetByStatus = await projectService.getProjectTimesheetsByStatus({projectId: projectId, accountId: userService.getAccountDetails().accountId, status: status });
      dispatch(getAllProjectTimesheets(projectTimesheeetByStatus));
      prepareTimesheetListForTable(projectTimesheeetByStatus)
    }

    function addTimesheetEntryAsInvoiceItem(e) {
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
              onClick={() => handleProjectTimesheets("xxl")}
              key="xxl"
              m={1}
              >{`Timesheets`}
          </Button>

          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                          Project Timesheets
                        </DrawerHeader>
                        <DrawerBody>
                          <Stack divider={<StackDivider />} spacing='1'>
                            <Box>
                              <HStack>
                                <Button className="btn" onClick={() => handleInvoiceTimesheets(TIMESHEET_STATUS.Pending)} width="timesheet.project_timesheets_button" bgColor="button.primary.color">
                                  Pending
                                </Button>     
                                <Button className="btn" onClick={() => handleInvoiceTimesheets(TimesheetStatus.Approved)} width="timesheet.project_timesheets_button" bgColor="button.primary.color">
                                  Approved
                                </Button> 
                                <Button className="btn" onClick={() => handleInvoiceTimesheets(TimesheetStatus.Invoiced)} width="timesheet.project_timesheets_button" bgColor="button.primary.color">
                                  Invoiced
                                </Button>  
                                <Button className="btn" onClick={() => handleInvoiceTimesheets(TimesheetStatus.Rejected)} width="timesheet.project_timesheets_button" bgColor="button.primary.color">
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
                                <CustomTable columns={TIMESHEET_LIST_TABLE_COLUMNS} rows={timsheetEntriesForTable} />
                            </Box>                            
                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
          </Drawer>

    </div>


  );
};

export default ProjectTimesheets;
