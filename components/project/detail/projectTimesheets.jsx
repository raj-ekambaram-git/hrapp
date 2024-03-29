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
import {removeTSFromInvoiceItems, setInvoiceTotal, setInvoiceItemList, setSelectedInvoiceTSEId, removeTSFromSelectedTSE, updateInvoiceItemListByTimesheetEntryId} from '../../../store/modules/Invoice/actions';
import {removeTSFromCostItems, setCostTotal, setCostItemList, setSelectedCostTSEId, removeTSFromSelectedCost, updateCostItemListByTimesheetEntryId} from '../../../store/modules/Cost/actions';
import { util } from "../../../helpers/util";
import ProjectTimesheeEntrySection from "./projectTimesheeEntrySection";
import { INVOICE_CALL_TYPE, TIMESHEET_STATUS, EMPTY_STRING, COST_CALL_TYPE } from "../../../constants/accountConstants";
import { InvoiceConstants } from "../../../constants/invoiceConstants";
import { ProjectConstants } from "../../../constants";
import { ExpenseStatus, ExpenseType, TimesheetStatus } from "@prisma/client";
import { CustomTable } from "../../customTable/Table";
import { TimesheetConstants } from "../../../constants/timesheetConstants";



const ProjectTimesheets = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const projectId = props.data.projectId;
    const callType = props.data.callType;
    const [size, setSize] = useState('');
    const [timsheetEntriesForTable, setTimsheetEntriesForTable] = useState([]);
    const timesheetListRef = useRef([]);
    const selectedTSEIdsRef = useRef([]);
    const selectedInvoiceItemListRef = useRef([]);
    const selectedCostItemListRef = useRef([]);
    const selectedCostTSEIdsRef = useRef([]);
    const [enableAddTimeSheetEntry, setEnableAddTimeSheetEntry] = useState(false);
    const [invTotal, setInvTotal] = useState({total: 0});
    const [cstTotal, setCstTotal] = useState({total: 0});

    const TIMESHEET_LIST_TABLE_COLUMNS = React.useMemo(() => ProjectConstants.TIMESHEET_LIST_TABLE_META)

    const timesheetEntryList = useSelector(state => state.timesheet.projectTimesheets);
    const invoiceTotal = useSelector(state => state.invoice.invoiceTotal);
    const costTotal = useSelector(state => state.cost.costTotal);
    const selectedTSEIds = useSelector(state => state.invoice.selectedInvoiceTSEId);
    const selectedInvoiceItemList = useSelector(state => state.invoice.invoiceItemList);
    const selectedCostItemList = useSelector(state => state.cost.costItemList);
    const selectedCostTSEIds = useSelector(state => state.cost.selectedCostTSEId);

    useEffect(() => {
      invTotal.total = invoiceTotal;
      cstTotal.total = costTotal;
      selectedTSEIdsRef.current = selectedTSEIds;
      selectedCostTSEIdsRef.current = selectedCostTSEIds;
      selectedInvoiceItemListRef.current = selectedInvoiceItemList;
      selectedCostItemListRef.current = selectedCostItemList;
    }, [invoiceTotal, selectedTSEIds, costTotal, selectedCostTSEIds, selectedInvoiceItemList, selectedCostItemList]);

    function prepareTimesheetListForTable(projectTimesheeetByStatus) {
      if(projectTimesheeetByStatus != undefined && projectTimesheeetByStatus != EMPTY_STRING && projectTimesheeetByStatus.length != 0) {        
        const updatedTSEist =  projectTimesheeetByStatus.map((timesheetEntry, index)=> {
          if(callType == INVOICE_CALL_TYPE && timesheetEntry.status == TIMESHEET_STATUS.Approved && timesheetEntry.billable) {
            timesheetEntry.enableAddtoInvoiceCheckBox = <Checkbox value={timesheetEntry.id} isChecked={selectedTSEIdsRef.current.includes(timesheetEntry.id)?true:false} onChange={(e) => addTimesheetEntryAsInvoiceItem(e, timesheetEntry.id, TimesheetConstants.Weekly)}/>
          } else if(callType == COST_CALL_TYPE && (timesheetEntry.status == TIMESHEET_STATUS.Invoiced || timesheetEntry.status == TIMESHEET_STATUS.PartiallyInvoiced) && !timesheetEntry.settled && timesheetEntry.billable) {
            timesheetEntry.enableAddtoInvoiceCheckBox = <Checkbox value={timesheetEntry.id} isChecked={selectedCostTSEIdsRef.current.includes(timesheetEntry.id)?true:false} onChange={(e) => addTimesheetEntryAsCostItem(e, timesheetEntry.id, TimesheetConstants.Weekly)}/>
          }
          timesheetEntry.name = timesheetEntry.timesheet?.name
          timesheetEntry.startDate = timesheetEntry.timesheet?.startDate
          timesheetEntry.resource = timesheetEntry.timesheet?.user?.firstName?timesheetEntry.timesheet?.user?.firstName:EMPTY_STRING+" "+timesheetEntry.timesheet?.user?.lastName?timesheetEntry.timesheet?.user?.lastName:EMPTY_STRING
          timesheetEntry.totalHours = timesheetEntry.entries?util.getTotalHours(timesheetEntry.entries):""
          timesheetEntry.detailAction =  <ProjectTimesheeEntrySection data={timesheetEntry.entries} tseId={timesheetEntry.id} addTimesheetEntryAsInvoiceItem={callType == COST_CALL_TYPE?addTimesheetEntryAsCostItem:addTimesheetEntryAsInvoiceItem} callType={callType}/>
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

    function addTimesheetEntryAsCostItem(e, tsEntryId, requestType) {
      const selectedTimesheetEntry = [...timesheetListRef.current].find(x => x.id === parseInt(tsEntryId));
      let selectedTSQuantity = util.getTotalHours(selectedTimesheetEntry.entries);
      let selectedTSTotal = parseFloat(selectedTSQuantity) * parseFloat(selectedTimesheetEntry.cost);


      let detail = [];    
      let updateNow = false;
      let existingQuantity = 0;
      let existingTotal = 0;


      if(requestType === TimesheetConstants.Weekly) {
        detail = util.getTSEntriesArray(selectedTimesheetEntry.entries)
      } else if (requestType === TimesheetConstants.Daily) {
        // if(selectedTSEIdsRef.current && selectedTSEIdsRef.current.length>0) {
          const timesheetEntryAlreadyPresent = selectedCostItemListRef.current.findIndex(x =>parseInt(x.notes.split("_")[0]) === parseInt(tsEntryId));
          if(timesheetEntryAlreadyPresent >=0) { //Meanse the id is already in the list              
            updateNow = true;
            detail = [...selectedCostItemListRef.current[timesheetEntryAlreadyPresent].detail]
            existingQuantity = parseInt((selectedCostItemListRef.current[timesheetEntryAlreadyPresent].notes.split("_")[4]).split(":")[1])
            existingTotal = parseFloat(selectedTimesheetEntry.cost)*existingQuantity
          }

          const dayObj = {
            day: e.target.value,
            date: selectedTimesheetEntry.entries[e.target.value].date,
            hours: selectedTimesheetEntry.entries[e.target.value].hours
          }    
          //Get the quantity
          if(e.target.checked) {
            selectedTSQuantity = existingQuantity+parseInt(selectedTimesheetEntry.entries[e.target.value].hours)
            selectedTSTotal=selectedTSQuantity*parseFloat(selectedTimesheetEntry.cost)  
            detail.push(dayObj)
          } else {
            selectedTSQuantity = existingQuantity-parseInt(selectedTimesheetEntry.entries[e.target.value].hours)
            selectedTSTotal=selectedTSQuantity*parseFloat(selectedTimesheetEntry.cost)  
          }
        
          
        // }
      }

      if(e.target.checked) { //Add the timesheet entry to the invoice item list
        if(!enableAddTimeSheetEntry) {
          setEnableAddTimeSheetEntry(true);
        }
        const addedTimesheetInvoiceItem = {
          type: ExpenseType.Resource_Cost,
          billable: true,
          expenseDate: new Date(),
          amount: (parseFloat(selectedTimesheetEntry.cost)*parseInt(selectedTSQuantity)),
          status: ExpenseStatus.Approved,
          detail: detail,
          notes: parseInt(tsEntryId)+"_User ID: "+selectedTimesheetEntry.timesheet?.user?.id
                    +"_Resource Name: "+selectedTimesheetEntry.timesheet?.user?.firstName+" "+selectedTimesheetEntry.timesheet?.user?.lastName
                    +"_Timesheet: "+selectedTimesheetEntry.timesheet?.name
                    +"_Hours: "+selectedTSQuantity
                    +"_Start: "+new Date(selectedTimesheetEntry.entries?.day1.date)
                    +"_End: "+new Date(selectedTimesheetEntry.entries?.day7?.date)
        };

        if(updateNow) {
          dispatch(updateCostItemListByTimesheetEntryId(addedTimesheetInvoiceItem))
        } else {
          dispatch(setCostItemList(addedTimesheetInvoiceItem));
          dispatch(setSelectedCostTSEId(parseInt(tsEntryId)))
          selectedCostTSEIdsRef.current.push(parseInt(tsEntryId));
        }
        if(cstTotal != undefined) {
          cstTotal.total = cstTotal.total+parseFloat(selectedTSTotal)-existingTotal
          dispatch(setCostTotal(cstTotal.total));            
        }else {
          cstTotal.total = cstTotal.total+parseFloat(selectedTSTotal)-existingTotal
          dispatch(setCostTotal(parseFloat(selectedTSTotal)));
        }          

        prepareTimesheetListForTable(timesheetListRef.current);
      } else { // Remove the timesheet entry form the invoice item list if exists
        let origninalTotal = 0;
        let removeTSEntry = true;
        const timesheetEntryAlreadyPresent = selectedCostItemListRef.current.findIndex(x =>parseInt(x.notes.split("_")[0]) === parseInt(tsEntryId));
        const gettingUpdatedEntry = {...selectedCostItemListRef.current[timesheetEntryAlreadyPresent]}

        // console.log("gettingUpdatedEntry::::"+JSON.stringify(gettingUpdatedEntry))
        // console.log("selectedCostItemListRef.current::::"+JSON.stringify(selectedCostItemListRef.current))
        origninalTotal = gettingUpdatedEntry.amount
        if(updateNow) {

          if(detail && detail.length == 1) { //This is the last day to be removed, so remove the whole entry
            dispatch(removeTSFromCostItems(tsEntryId));   
            dispatch(removeTSFromSelectedCost(tsEntryId));
            selectedTSTotal = origninalTotal - selectedTSTotal;
          } else if (detail && detail.length > 1){ //There are more than one is already selected, so lets remove just that and keep the entry updated
            removeTSEntry = false;
            //Remove the day entry from detail array
            const detailDayAlreadyPresentIndex = detail.findIndex(x => x.day === e.target.value);
            detail.splice(detailDayAlreadyPresentIndex, 1);            
            gettingUpdatedEntry.detail = detail;
            gettingUpdatedEntry.notes = parseInt(tsEntryId)+"_User ID: "+selectedTimesheetEntry.timesheet?.user?.id
                    +"_Resource Name: "+selectedTimesheetEntry.timesheet?.user?.firstName+" "+selectedTimesheetEntry.timesheet?.user?.lastName
                    +"_Timesheet: "+selectedTimesheetEntry.timesheet?.name
                    +"_Hours: "+selectedTSQuantity
                    +"_Start: "+new Date(selectedTimesheetEntry.entries?.day1.date)
                    +"_End: "+new Date(selectedTimesheetEntry.entries?.day7?.date)
            gettingUpdatedEntry.amount = selectedTSTotal
            selectedTSTotal = origninalTotal - selectedTSTotal;
            dispatch(updateCostItemListByTimesheetEntryId(gettingUpdatedEntry));
          }

        } else {
          dispatch(removeTSFromCostItems(tsEntryId));   
          dispatch(removeTSFromSelectedCost(tsEntryId))  
          selectedTSTotal = origninalTotal;
        }

        // dispatch(removeTSFromCostItems(tsEntryId));   
        // dispatch(removeTSFromSelectedCost(tsEntryId))
        if(cstTotal != undefined) {
          cstTotal.total = cstTotal.total-parseFloat(selectedTSTotal)
            dispatch(setCostTotal(cstTotal.total));
          }else {
            dispatch(setCostTotal(parseFloat(total)));
        }

        const newSelecteTSEIds = [...selectedCostTSEIdsRef.current]
        const index = newSelecteTSEIds.indexOf(parseInt(tsEntryId));
        if (index > -1) { // only splice array when item is found
          newSelecteTSEIds.splice(index, 1); // 2nd parameter means remove one item only
        }
        selectedCostTSEIdsRef.current = newSelecteTSEIds;

        prepareTimesheetListForTable(timesheetListRef.current);
      }      
    }

    function addTimesheetEntryAsInvoiceItem(e, tsEntryId, requestType) {
      const selectedTimesheetEntry = [...timesheetListRef.current].find(x => x.id === parseInt(tsEntryId));
      let selectedTSQuantity = util.getTotalHours(selectedTimesheetEntry.entries);
      let selectedTSTotal = parseFloat(selectedTSQuantity) * parseFloat(selectedTimesheetEntry.unitPrice);


      /**
       * If Checked Daily
       *  Check if that timesheetEntryId is already present in the list
       *    if Yes, then update the total, quantity, and detail 
       *    if no, then create new with the total for that day
       *  if UnChecked Daily
       *  Check if that timesheetEntryId is already preset in the list
       *    if Yes, then update hte total, quantity and detail
       */
      let detail = [];    
      let updateNow = false;
      let existingQuantity = 0;
      let existingTotal = 0;


      if(requestType === TimesheetConstants.Weekly) {
        detail = util.getTSEntriesArray(selectedTimesheetEntry.entries)
      } else if (requestType === TimesheetConstants.Daily) {
        // if(selectedTSEIdsRef.current && selectedTSEIdsRef.current.length>0) {
          const timesheetEntryAlreadyPresent = selectedInvoiceItemListRef.current.findIndex(x => x.timesheetEntryId === parseInt(tsEntryId));
          if(timesheetEntryAlreadyPresent >=0) { //Meanse the id is already in the list              
            updateNow = true;
            detail = [...selectedInvoiceItemListRef.current[timesheetEntryAlreadyPresent].detail]
            existingQuantity = parseInt(selectedInvoiceItemListRef.current[timesheetEntryAlreadyPresent].quantity)
            existingTotal = parseFloat(selectedTimesheetEntry.unitPrice)*existingQuantity
          }

          const dayObj = {
            day: e.target.value,
            date: selectedTimesheetEntry.entries[e.target.value].date,
            hours: selectedTimesheetEntry.entries[e.target.value].hours
          }    
          //Get the quantity
          if(e.target.checked) {
            selectedTSQuantity = existingQuantity+parseInt(selectedTimesheetEntry.entries[e.target.value].hours)
            selectedTSTotal=selectedTSQuantity*parseFloat(selectedTimesheetEntry.unitPrice)  
            detail.push(dayObj)
          } else {
            selectedTSQuantity = existingQuantity-parseInt(selectedTimesheetEntry.entries[e.target.value].hours)
            selectedTSTotal=selectedTSQuantity*parseFloat(selectedTimesheetEntry.unitPrice)  
          }
        
          
        // }
      }

      if(e.target.checked) { //Add the timesheet entry to the invoice item list
        if(!enableAddTimeSheetEntry) {
          setEnableAddTimeSheetEntry(true);
        }

        const addedTimesheetInvoiceItem = {
          timesheetEntryId: parseInt(tsEntryId),
          userId: parseInt(selectedTimesheetEntry.timesheet?.user?.id),
          type: InvoiceConstants.INVOICE_ITEM_TYPE_TIMESHEET,
          status: InvoiceConstants.INVOICE_STATUS.Draft,
          unitPrice: selectedTimesheetEntry.unitPrice,
          quantity: parseInt(selectedTSQuantity),
          currency: InvoiceConstants.INVOICE_CURRENCY_USD,
          uom: InvoiceConstants.INVOICE_UOM_HOURS,
          total: selectedTSTotal,
          fromDate: new Date(selectedTimesheetEntry.entries?.day1.date),
          toDate: new Date(selectedTimesheetEntry.entries?.day7?.date),
          detail: detail
        };

        if(updateNow) {
          dispatch(updateInvoiceItemListByTimesheetEntryId(addedTimesheetInvoiceItem));
        } else {
          dispatch(setInvoiceItemList(addedTimesheetInvoiceItem));
          dispatch(setSelectedInvoiceTSEId(parseInt(tsEntryId)))
          selectedTSEIdsRef.current.push(parseInt(tsEntryId));
        }
        if(invTotal != undefined) {
          invTotal.total = invTotal.total+parseFloat(selectedTSTotal)-existingTotal
          dispatch(setInvoiceTotal(invTotal.total));            
        }else {
          invTotal.total = invTotal.total+parseFloat(selectedTSTotal)-existingTotal
          dispatch(setInvoiceTotal(parseFloat(selectedTSTotal)));
        }          

          prepareTimesheetListForTable(timesheetListRef.current);
      } else { // Remove the timesheet entry form the invoice item list if exists
        let origninalTotal = 0;
        let removeTSEntry = true;
        const timesheetEntryAlreadyPresent = selectedInvoiceItemListRef.current.findIndex(x => x.timesheetEntryId === parseInt(tsEntryId));
        const gettingUpdatedEntry = {...selectedInvoiceItemListRef.current[timesheetEntryAlreadyPresent]}
        origninalTotal = gettingUpdatedEntry.quantity*gettingUpdatedEntry.unitPrice
        
        if(updateNow) {
          
         if(detail && detail.length == 1) { //This is the last day to be removed, so remove the whole entry
            dispatch(removeTSFromInvoiceItems(tsEntryId));   
            dispatch(removeTSFromSelectedTSE(tsEntryId));
            selectedTSTotal = origninalTotal - selectedTSTotal;
          } else if (detail && detail.length > 1){ //There are more than one is already selected, so lets remove just that and keep the entry updated
            removeTSEntry = false;
            //Remove the day entry from detail array
            const detailDayAlreadyPresentIndex = detail.findIndex(x => x.day === e.target.value);
            detail.splice(detailDayAlreadyPresentIndex, 1);            
            gettingUpdatedEntry.detail = detail;
            gettingUpdatedEntry.quantity = parseInt(selectedTSQuantity)
            gettingUpdatedEntry.total = selectedTSTotal
            selectedTSTotal = origninalTotal - selectedTSTotal;
            dispatch(updateInvoiceItemListByTimesheetEntryId(gettingUpdatedEntry));
          }
        } else {
          dispatch(removeTSFromInvoiceItems(tsEntryId));   
          dispatch(removeTSFromSelectedTSE(tsEntryId))  
          selectedTSTotal = origninalTotal;
        }        
       if(invTotal != undefined) {
            invTotal.total = invTotal.total-parseFloat(selectedTSTotal);
            dispatch(setInvoiceTotal(invTotal.total));
          }else {
            dispatch(setInvoiceTotal(parseFloat(total)));
        }

        if(removeTSEntry) {
          const newSelecteTSEIds = [...selectedTSEIdsRef.current]
          const index = newSelecteTSEIds.indexOf(parseInt(tsEntryId));
          if (index > -1) { // only splice array when item is found
            newSelecteTSEIds.splice(index, 1); // 2nd parameter means remove one item only
          }
          selectedTSEIdsRef.current = newSelecteTSEIds;  
        }

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
                                <Button size="xs" bgColor="header_actions"  onClick={() => handleInvoiceTimesheets(TimesheetStatus.Settled)} width="timesheet.project_timesheets_button" >
                                  Settled
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
