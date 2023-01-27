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
import { getAllProjectTimesheets} from '../../../store/modules/Timesheet/actions';
import {removeTSFromInvoiceItems, setInvoiceTotal, setInvoiceItemList, setSelectedInvoiceTSEId, removeTSFromSelectedTSE} from '../../../store/modules/Invoice/actions';
import { util } from "../../../helpers/util";
import ProjectTimesheeEntrySection from "./projectTimesheeEntrySection";
import { INVOICE_CALL_TYPE, TIMESHEET_STATUS, EMPTY_STRING } from "../../../constants/accountConstants";
import { InvoiceConstants } from "../../../constants/invoiceConstants";
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
    const timesheetListRef = useRef([]);
    const selectedTSEIdsRef = useRef([]);
    const [enableAddTimeSheetEntry, setEnableAddTimeSheetEntry] = useState(false);
    const [invTotal, setInvTotal] = useState({total: 0});

    const TIMESHEET_LIST_TABLE_COLUMNS = React.useMemo(() => ProjectConstants.TIMESHEET_LIST_TABLE_META)

    const timesheetEntryList = useSelector(state => state.timesheet.projectTimesheets);
    const invoiceTotal = useSelector(state => state.invoice.invoiceTotal);
    const selectedTSEIds = useSelector(state => state.invoice.selectedInvoiceTSEId);

    useEffect(() => {
      invTotal.total = invoiceTotal;
      selectedTSEIdsRef.current = selectedTSEIds;
    }, [invoiceTotal, selectedTSEIds]);

    function prepareTimesheetListForTable(projectTimesheeetByStatus) {
      if(projectTimesheeetByStatus != undefined && projectTimesheeetByStatus != EMPTY_STRING && projectTimesheeetByStatus.length != 0) {        
        const updatedTSEist =  projectTimesheeetByStatus.map((timesheetEntry, index)=> {
          if(callType == INVOICE_CALL_TYPE && timesheetEntry.status == TIMESHEET_STATUS.Approved && timesheetEntry.billable) {
            timesheetEntry.enableAddtoInvoiceCheckBox = <Checkbox value={timesheetEntry.id} isChecked={selectedTSEIdsRef.current.includes(timesheetEntry.id)?true:false} onChange={(e) => addTimesheetEntryAsInvoiceItem(e)}/>
          }
          timesheetEntry.name = timesheetEntry.timesheet?.name
          timesheetEntry.resource = timesheetEntry.timesheet?.user?.firstName?timesheetEntry.timesheet?.user?.firstName:EMPTY_STRING+" "+timesheetEntry.timesheet?.user?.lastName?timesheetEntry.timesheet?.user?.lastName:EMPTY_STRING
          timesheetEntry.totalHours = timesheetEntry.entries?util.getTotalHours(timesheetEntry.entries):""
          timesheetEntry.detailAction =  <ProjectTimesheeEntrySection data={timesheetEntry.entries}/>
          timesheetEntry.status = timesheetEntry.status
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
      timesheetListRef.current = projectTimesheeetByStatus;
      dispatch(getAllProjectTimesheets(projectTimesheeetByStatus));
      prepareTimesheetListForTable(projectTimesheeetByStatus)
      // projectService.getAllTimesheetsByProject(projectId, userService.getAccountDetails().accountId);
      setSize(newSize);
      onOpen();
    }

    async function handleInvoiceTimesheets(status) {
      
      const projectTimesheeetByStatus = await projectService.getProjectTimesheetsByStatus({projectId: projectId, accountId: userService.getAccountDetails().accountId, status: status });
      timesheetListRef.current = projectTimesheeetByStatus;
      dispatch(getAllProjectTimesheets(projectTimesheeetByStatus));
      prepareTimesheetListForTable(projectTimesheeetByStatus)
    }

    function addTimesheetEntryAsInvoiceItem(e) {
      const selectedTimesheetEntry = [...timesheetListRef.current].find(x => x.id === parseInt(e.target.value));
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
          dispatch(setSelectedInvoiceTSEId(parseInt(e.target.value)))
          selectedTSEIdsRef.current.push(parseInt(e.target.value));
          if(invTotal != undefined) {
            invTotal.total = invTotal.total+parseFloat(selectedTSTotal)
            dispatch(setInvoiceTotal(invTotal.total));            
          }else {
            invTotal.total = invTotal.total+parseFloat(selectedTSTotal)
            dispatch(setInvoiceTotal(parseFloat(selectedTSTotal)));
          }          

          prepareTimesheetListForTable(timesheetListRef.current);
      } else { // Remove the timesheet entry form the invoice item list if exists
        dispatch(removeTSFromInvoiceItems(e.target.value));   
        dispatch(removeTSFromSelectedTSE(e.target.value))
        if(invTotal != undefined) {
            invTotal.total = invTotal.total-parseFloat(selectedTSTotal)
            dispatch(setInvoiceTotal(invTotal.total));
          }else {
            dispatch(setInvoiceTotal(parseFloat(total)));
        }

        const newSelecteTSEIds = [...selectedTSEIdsRef.current]
        const index = newSelecteTSEIds.indexOf(parseInt(e.target.value));
        if (index > -1) { // only splice array when item is found
          newSelecteTSEIds.splice(index, 1); // 2nd parameter means remove one item only
        }
        selectedTSEIdsRef.current = newSelecteTSEIds;

        prepareTimesheetListForTable(timesheetListRef.current);
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
                                <Button size="xs" bgColor="header_actions" onClick={() => handleInvoiceTimesheets(TIMESHEET_STATUS.Pending)} width="timesheet.project_timesheets_button" >
                                  Pending
                                </Button>     
                                <Button size="xs" bgColor="header_actions"  onClick={() => handleInvoiceTimesheets(TimesheetStatus.Approved)} width="timesheet.project_timesheets_button" >
                                  Approved
                                </Button> 
                                <Button size="xs" bgColor="header_actions"  onClick={() => handleInvoiceTimesheets(TimesheetStatus.Invoiced)} width="timesheet.project_timesheets_button" >
                                  Invoiced
                                </Button>  
                                <Button size="xs" bgColor="header_actions"  onClick={() => handleInvoiceTimesheets(TimesheetStatus.Rejected)} width="timesheet.project_timesheets_button" >
                                  Rejected
                                </Button>  
                                {(callType==INVOICE_CALL_TYPE && enableAddTimeSheetEntry)? (
                                  <>
                                  <Button size="xs" bgColor="header_actions"  onClick={() => handleAddTimesheetsToInvoice()} width="timesheet.project_timesheets_button" >
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
