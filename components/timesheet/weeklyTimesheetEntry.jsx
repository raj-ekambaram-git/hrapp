import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {EMPTY_STRING, TIMESHEET_STATUS,TIMESHEET_ENTRY_DEFAULT} from "../../constants/accountConstants";
import { userService, timesheetService } from "../../services";
import {
    HStack,
    Button,
    Box,
    Heading,
    Input,
    Select,
    Stack,
    Card,
    CardHeader,
    CardBody,
    StackDivider,
    Grid,
    GridItem,
    Badge,
    Spacer
  } from '@chakra-ui/react';
import TimesheetDateHeader from "./timesheetDateHeader";
import {
     DeleteIcon,ArrowBackIcon,ArrowForwardIcon, CheckCircleIcon
  } from '@chakra-ui/icons';  
import { useDispatch, useSelector } from "react-redux";
import {setnewTSWeekStartDimId, setSelectedTimesheetId, setTSEntries} from '../../store/modules/Timesheet/actions';
import { util } from "../../helpers/util";
import { InvoiceConstants } from "../../constants";


  
const WeeklyTimesheetEntry = (props) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const [isAddMode, setAddMode] = useState(true);
    const [timesheetEntries, setTimesheetEntries] = useState([{projectId: "", status: "", entries: {day1: {hours: "", error: false, date: "", note: ""}, day2: {hours: "", error: false, date: "", note: ""},day3: {hours: "", error: false, date: "", note: ""},day4: {hours: "", error: false, date: "", note: ""},day5: {hours: "", error: false, date: "", note: ""},day6: {hours: "", error: false, date: "", note: ""},day7: {hours: "", error: false,date: "", note: ""}}}]);
    const [showProjectError, setShowProjectError] = useState(false);
    const [userProjectList, setUserProjectList] = useState([]);
    const [timesheetData, setTimesheetData] = useState([]);
    const [timesheetName, setTimesheetName] = useState(EMPTY_STRING);
    const [weekCalendar, setWeekCalendar] = useState({});
    const [timesheetStartDate, setTimesheetStartDate] = useState(EMPTY_STRING);
    const [previousWeekStart, setPreviousWeekStart] = useState(EMPTY_STRING);
    const [nextWeekStart, setNextWeekStart] = useState(EMPTY_STRING);
    const userId = props.data.userId;
    const newTSWeekStartDimId = useSelector(state => state.timesheet.newTSWeekStartDimId);

    useEffect(() => {

        if(userService.isAccountAdmin() || userService.isSuperAdmin() || userService.isManager()) {
          getProjectForUser(userId);
        }else if(userService.isTimesheetEntryUser()) {
          // getProjectForUser(userService.getAccountDetails().accountId);
          getProjectForUser(userId);
        }
        console.log("props.data.isAddMode:::"+JSON.stringify(props.data.isAddMode))
        setAddMode(props.data.isAddMode);
        getTimesheetDetailsAPICall();
    
      }, []);

      async function getTimesheetDetailsAPICall() {
        console.log("getTimesheetDetailsAPICall::"+props.data.isAddMode);
        // Call only if the user is SUPER_ADMIN and accountId as zero
        if((userService.isAccountAdmin() || userService.isSuperAdmin() || userService.isTimesheetEntryUser() || userService.isManager()) 
              && (props && props.data && !props.data.isAddMode)) { // This is for EDIT 
                const timesheetResponse = await timesheetService.getTimesheetDetails(props.data.timesheetId, userService.getAccountDetails().accountId);
                setTimesheetData(timesheetResponse);
                setTimesheetName(timesheetResponse.name);
                setTimesheetEntries(timesheetResponse.timesheetEntries);
                setWeekCalendar(timesheetResponse.timesheetEntries[0].entries);
                setTimesheetStartDate(timesheetResponse.startDate);
                setNextWeekStart(util.getNextWeekStartDateString(new Date(timesheetResponse.startDate.toString()).toLocaleDateString( "en-US", { timeZone: "UTC" } ) ));
                setPreviousWeekStart(util.getPrevioustWeekStartDateString(new Date(timesheetResponse.startDate.toString()).toLocaleDateString( "en-US", { timeZone: "UTC" } ) ));

                //Condition to ebale the update buttong based on the status and mode
        }else if((userService.isAccountAdmin() || userService.isSuperAdmin() || userService.isTimesheetEntryUser() || userService.isManager()) 
        && (props && props.data && props.data.isAddMode)) { // This is for ADD

            //Only if its today is the new timesheet, if the date is passed then out this under condition
            let timesheetDate = new Date();
            if(newTSWeekStartDimId != undefined) {
                timesheetDate = new Date(newTSWeekStartDimId.toString().substring(4,6)+"/"+newTSWeekStartDimId.toString().substring(6,8)+"/"+newTSWeekStartDimId.toString().substring(0,4));
            }
            const timesheetDateStr = timesheetDate.getFullYear()+(String(timesheetDate.getMonth()+1).padStart(2, "0"))+String(timesheetDate.getDate()).padStart(2, "0");
            setNextWeekStart(util.getNextWeekStartDateString(timesheetDate.getTime()));
            setPreviousWeekStart(util.getPrevioustWeekStartDateString(timesheetDate.getTime()));

            //Get Calendar Data and Timesheet Name
            const timesheetMetaData = await timesheetService.getTimesheetMetaForDate(timesheetDateStr);
            setTimesheetName(timesheetMetaData.weekOfYearISO);
            setWeekCalendar(timesheetMetaData.currentWeekDates);
            setTimesheetStartDate(timesheetMetaData.firstDayOfWeek)

        }
    
      }      

    async function getProjectForUser(userId) {
        console.log("TimeSheet ADD EDIT ::"+JSON.stringify(userId));
        const projectsForUserResponse = await userService.getProjectsByUser(userId, userService.getAccountDetails().accountId);    
        setUserProjectList(projectsForUserResponse);
    }



    function addTimesheeEntry(timesheetEntryCountLength) {
        console.log("addTimesheeEntry::::"+timesheetEntryCountLength);

        const inputData = [...timesheetEntries];
        console.log("ISADDMODE:::"+isAddMode);
        inputData.push({projectId: "", status: "", entries: {day1: {hours: "", error: false, date: "", note: ""}, day2: {hours: "", error: false, date: "", note: ""},day3: {hours: "", error: false, date: "", note: ""},day4: {hours: "", error: false, date: "", note: ""},day5: {hours: "", error: false, date: "", note: ""},day6: {hours: "", error: false, date: "", note: ""},day7: {hours: "", error: false, date: "", note: ""}}});
        setTimesheetEntries(inputData);

    }


    function submitTimesheet(status) {
        const inputData = [...timesheetEntries];
        for (let i = 0; i < inputData.length; i++) {
            inputData[i].status = status;
            inputData[i].entries.day1.date = weekCalendar.day1.date;
            inputData[i].entries.day2.date = weekCalendar.day2.date;
            inputData[i].entries.day3.date = weekCalendar.day3.date;
            inputData[i].entries.day4.date = weekCalendar.day4.date;
            inputData[i].entries.day5.date = weekCalendar.day5.date;
            inputData[i].entries.day6.date = weekCalendar.day6.date;
            inputData[i].entries.day7.date = weekCalendar.day7.date;
        }
        setTimesheetEntries(inputData);
        props.data.handleTimeSheetEntries(timesheetEntries);
        props.data.onSubmit({status: status, timesheetName:timesheetName, timesheetStartDate: timesheetStartDate});
        dispatch(setTSEntries(timesheetEntries));
    }



    function setTimesheetEntry(index, ev, dayNumber) {
        const inputValue = ev.target.value;
        console.log("setDayHours:::"+index+"----"+ev.target.value+"--dayNumber:::"+dayNumber)
        
        const inputData = [...timesheetEntries];
        let timeEntryRecord;
        console.log("inputData.length::"+inputData.length)
        //Condition when new record is updated for first time
        if(inputData.length === 0 || inputData.length <= index) {
            timeEntryRecord = TIMESHEET_ENTRY_DEFAULT;
            inputData.push(timeEntryRecord);
        } else { //Trying to update thhe record already created
            timeEntryRecord = inputData[index];
            console.log("existingTimesheetRecord::"+JSON.stringify(timeEntryRecord));
        }

        if(dayNumber != "projectId" && timeEntryRecord.projectId === EMPTY_STRING) {
            //Error to selecct the project firsst
            setShowProjectError(true);
            return;
        }else {
            if(showProjectError) {
                setShowProjectError(false);
            }
        }
        //Validate the value entered to be 24hrs max and sum of all the rows for that day is 24hrs too
        const dayN = "day"+dayNumber;
        // if(dayNumber != "projectId" && (inputValue > 24 || enteredTotalHoursPerDay(dayNumber)+parseInt(inputValue) > 24)) {
        if(dayNumber != "projectId" && (inputValue > 24)) {            
            console.log("Hour Error happened...")
            timeEntryRecord.entries[dayN].error = true;
        }else if (dayNumber != "projectId"){
            timeEntryRecord.entries[dayN].error = false;
        }

        switch(dayNumber) {
            case "1": 
                timeEntryRecord.entries.day1.hours = inputValue;
                break;
            case "2": 
                timeEntryRecord.entries.day2.hours = inputValue;
                break;
            case "3": 
                timeEntryRecord.entries.day3.hours = inputValue;
                break;
            case "4": 
                timeEntryRecord.entries.day4.hours = inputValue;
                break;
            case "5": 
                timeEntryRecord.entries.day5.hours = inputValue;
                break;
            case "6": 
                timeEntryRecord.entries.day6.hours = inputValue;
                break;
            case "7": 
                timeEntryRecord.entries.day7.hours = inputValue;
                break;
            case "projectId":
                timeEntryRecord.projectId = parseInt(inputValue);
                timeEntryRecord.unitPrice = parseInt(ev.target.options.item(ev.target.selectedIndex).getAttribute("data-unitprice"));
                break;
            default:
                console.log("default");                    
                break;
        }

        console.log("timesheetEntries UPDATED:::inputData::"+JSON.stringify(inputData));

        setTimesheetEntries(inputData);
        console.log("timesheetEntries BEFOREE:::inputData::"+JSON.stringify(inputData));
        props.data.handleTimeSheetEntries(inputData);
    }

    function enteredTotalHoursPerDay(dayNumber) {
        let timesheetTotalEntryHour = 0;
        console.log("timesheetTotalEntryHour IIIII:::"+JSON.stringify(timesheetEntries));
        const dayN = "day"+dayNumber;
        for (let i = 0; i < timesheetEntries.length; i++) {
            console.log("enteredTotalHoursPerDay[i]:::"+dayNumber+"-----"+JSON.stringify(timesheetEntries[i].entries[dayN].hours));
            if(timesheetEntries[i].entries[dayN].hours !== EMPTY_STRING) {
                timesheetTotalEntryHour = timesheetTotalEntryHour+parseInt(timesheetEntries[i].entries[dayN].hours);
            }
        }
        console.log("timesheetTotalEntryHour:::"+timesheetTotalEntryHour);
        return timesheetTotalEntryHour;
    }

    async function changeTimesheet(moveBefore, weekStartDate ) {
        console.log("moveBefore:::"+moveBefore+"-----weekStartDate:::"+weekStartDate);
        //Call calendar by bassing the timesheet name
        const timesheetMetaData = await timesheetService.getTimesheetMetaForDate(weekStartDate);
        console.log("changeTimesheet::::Week Meta Dat::"+JSON.stringify(timesheetMetaData));

        //Call timesheet and see if that week timesheet name is present
        const timesheets = await timesheetService.getTimesheetByName(timesheetMetaData.weekOfYearISO, userService.userValue.id);
        if(timesheets != undefined && timesheets.length > 0) {
            console.log("Timesheets already exists, so go  to that time sheet id ");
            dispatch(setSelectedTimesheetId(timesheets[0]?.id))
            router.push({ pathname: '/timesheet/', query: { }});
        }else {
            dispatch(setnewTSWeekStartDimId(timesheetMetaData.dateDimId ))
            console.log("Timesheet not present, so go to add new time sheet with the start date passed");
            router.push({ pathname: '/timesheet/add', query: {}});
        }
    }


    function deleteTimesheetEntry(removeIndex) {
        console.log("deleteTimesheetEntry:::"+removeIndex+"========")
        const inputEntriesData = [...timesheetEntries];
        console.log("inputEntriesData:::BEFORE:::"+JSON.stringify(inputEntriesData))
        inputEntriesData.splice(removeIndex, 1);

        console.log("inputEntriesData:::"+JSON.stringify(inputEntriesData));
        setTimesheetEntries(inputEntriesData);
    }
    

    return (
        <>
            <Stack spacing={2}>
              <Card variant="timesheet">
                <CardHeader> 
                    <HStack gap="16rem">
                        <Box>
                            <Heading size='sm'>Timesheet Entry</Heading>
                        </Box>
                        <Box width="timesheet.nameDropDown">
                            <HStack>
                                
                                {isAddMode ? (
                                    <>
                                        <ArrowBackIcon onClick={() => changeTimesheet(true, previousWeekStart)}/>
                                        <Heading size='sm'>{timesheetName}</Heading>
                                        <ArrowForwardIcon onClick={() => changeTimesheet(false, nextWeekStart)}/>
                                    </>
                                ) : (
                                    <>
                                        <ArrowBackIcon onClick={() => changeTimesheet(true, previousWeekStart)}/>
                                        <Heading size='sm'>{timesheetData.name}</Heading>
                                        <ArrowForwardIcon onClick={() => changeTimesheet(false, nextWeekStart)}/>
                                    </>
                                )}
                                
                            </HStack>
                        </Box>
                        <Box></Box>
                        <Box>
                            {isAddMode || (!isAddMode && timesheetData.status != TIMESHEET_STATUS.Approved) ? (
                                <>
                                    <HStack>
                                        {!isAddMode ? (
                                            <>
                                                <Box>
                                                    {/* <NotesHistory data={{notesType: NotesConstants.NOTES_TYPE.Timesheet, notesTypeId: props.data.timesheetId, notesTypeTitle: timesheetData.name}}></NotesHistory> */}
                                                </Box>                                        
                                            </>
                                        ) : (
                                            <>
                                            </>
                                        )}
                                        <Box>
                                            <Button size="xs" bgColor="header_actions" onClick={() => submitTimesheet(TIMESHEET_STATUS.Saved)}>
                                                Save
                                            </Button>
                                        </Box>
                                        <Box>
                                            <Button size="xs" bgColor="header_actions" onClick={() => submitTimesheet(TIMESHEET_STATUS.Submitted)}>
                                                {isAddMode ? (
                                                    <>Submit</>
                                                ) : (
                                                    <>Submit</>
                                                )}
                                            </Button>
                                        </Box>
                                    </HStack>                                
                                </>
                            ) : (
                                <>
                                </>
                            )}

                        </Box>


                    </HStack>
                  
                </CardHeader>

                <CardBody>
                  <Stack spacing='20px' divider={<StackDivider />}>
                    {showProjectError ? (
                        <>
                            <Heading size='sm' color="red">Select Project First</Heading>
                        </>
                    ) : (
                        <></>
                    )} 
                    <TimesheetDateHeader data={weekCalendar}></TimesheetDateHeader>
                    {timesheetEntries?.map((timesheetEntry, index) => (
                        <Grid gap="1rem" marginBottom="2rem" autoRows>
                            <GridItem colSpan={2} h='10'>
                                <HStack spacing="1em">    
                                {isAddMode || (!isAddMode && timesheetData.status != TIMESHEET_STATUS.Approved) ? (
                                    <>
                                        <Box>
                                            {(timesheetEntry.status != TIMESHEET_STATUS.Approved && timesheetEntry.status != TIMESHEET_STATUS.Invoiced) ? <DeleteIcon onClick={() => deleteTimesheetEntry(index)}/> : <CheckCircleIcon color="header_actions"/>}
                                        </Box>                                      
                                    </>
                                ): (
                                    <>
                                    </>
                                )}
                                    <Box borderWidth="timesheet.entry_project" width="timesheet.project_drop_down">
                                        <Select id="projectId" value={timesheetEntry.projectId} onChange={(ev) => setTimesheetEntry(index, ev, "projectId")}>
                                            <option value="">Select Project</option>
                                            {userProjectList?.map((project) => (
                                                <option value={project.projectId} data-unitprice={project.unitPrice} >{project.project.name} - {project.project.referenceCode}</option>
                                            ))}
                                        </Select>  
                                    </Box>  
                                </HStack>
                            </GridItem>
                            <GridItem colStart={3} colEnd={6} h='10'>
                                <HStack spacing="1rem">
                                    <HStack spacing="2em">
                                        <Box borderWidth="timesheet.entry" borderColor={timesheetEntry.entries.day1.error ? 'timesheet.entryError' : ""}>
                                            <Input type="number" id="day1" isReadOnly={(timesheetEntry.status == TIMESHEET_STATUS.Approved || timesheetEntry.status == TIMESHEET_STATUS.Invoiced) ? true : false}  value= {timesheetEntry.entries.day1.error ? "" : timesheetEntry.entries.day1.hours}  size="md" onChange={(ev) => setTimesheetEntry(index, ev,"1")} boxSize="timesheet.entry.input"/>
                                        </Box>    
                                        <Box borderWidth="timesheet.entry" borderColor={timesheetEntry.entries.day2.error ? 'timesheet.entryError' : ""}>
                                            <Input type="number" id="day2"  isReadOnly={(timesheetEntry.status == TIMESHEET_STATUS.Approved || timesheetEntry.status == TIMESHEET_STATUS.Invoiced) ? true : false} size="md" value= {timesheetEntry.entries.day2.error ? "" : timesheetEntry.entries.day2.hours}   onChange={(ev) => setTimesheetEntry(index, ev,"2")} boxSize="timesheet.entry.input"/>
                                        </Box>    
                                        <Box borderWidth="timesheet.entry" borderColor={timesheetEntry.entries.day3.error ? 'timesheet.entryError' : ""}>
                                            <Input type="number" id="day3"  isReadOnly={(timesheetEntry.status == TIMESHEET_STATUS.Approved || timesheetEntry.status == TIMESHEET_STATUS.Invoiced) ? true : false} size="md" value= {timesheetEntry.entries.day3.error ? "" : timesheetEntry.entries.day3.hours}  onChange={(ev) => setTimesheetEntry(index, ev,"3")} boxSize="timesheet.entry.input"/>
                                        </Box>    
                                        <Box borderWidth="timesheet.entry" borderColor={timesheetEntry.entries.day4.error ? 'timesheet.entryError' : ""}>
                                            <Input type="number" id="day4"  isReadOnly={(timesheetEntry.status == TIMESHEET_STATUS.Approved || timesheetEntry.status == TIMESHEET_STATUS.Invoiced) ? true : false} size="md" value= {timesheetEntry.entries.day4.error ? "" : timesheetEntry.entries.day4.hours}  onChange={(ev) => setTimesheetEntry(index, ev,"4")}  boxSize="timesheet.entry.input"/>
                                        </Box>    
                                        <Box borderWidth="timesheet.entry" borderColor={timesheetEntry.entries.day5.error ? 'timesheet.entryError' : ""}>
                                            <Input type="number" id="day5"  isReadOnly={(timesheetEntry.status == TIMESHEET_STATUS.Approved || timesheetEntry.status == TIMESHEET_STATUS.Invoiced) ? true : false} size="md" value= {timesheetEntry.entries.day5.error ? "" : timesheetEntry.entries.day5.hours}  onChange={(ev) => setTimesheetEntry(index, ev,"5")} boxSize="timesheet.entry.input"/>
                                        </Box>    
                                        <Box borderWidth="timesheet.entry" borderColor={timesheetEntry.entries.day6.error ? 'timesheet.entryError' : ""}>
                                            <Input type="number" id="day6"  isReadOnly={(timesheetEntry.status == TIMESHEET_STATUS.Approved || timesheetEntry.status == TIMESHEET_STATUS.Invoiced) ? true : false} size="md" value= {timesheetEntry.entries.day6.error ? "" : timesheetEntry.entries.day6.hours}  onChange={(ev) => setTimesheetEntry(index, ev,"6")} boxSize="timesheet.entry.input"/>
                                        </Box>    
                                        <Box borderWidth="timesheet.entry" borderColor={timesheetEntry.entries.day7.error ? 'timesheet.entryError' : ""}>
                                            <Input type="number" id="day7"  isReadOnly={(timesheetEntry.status == TIMESHEET_STATUS.Approved || timesheetEntry.status == TIMESHEET_STATUS.Invoiced) ? true : false} size="md" value= {timesheetEntry.entries.day7.error ? "" : timesheetEntry.entries.day7.hours}  onChange={(ev) => setTimesheetEntry(index, ev,"7")}  boxSize="timesheet.entry.input"/>
                                        </Box>   
                                    </HStack>                                             
                                    <Box>
                                        <Badge color={`${
                                                (timesheetEntry.status === TIMESHEET_STATUS.Approved || timesheetEntry.status === TIMESHEET_STATUS.Invoiced)
                                                ? "timesheet.approved_status"
                                                : (timesheetEntry.status === "Submitted" || timesheetEntry.status === "Saved")
                                                ? "timesheet.pending_status"
                                                : "timesheet.pending_status"
                                            }`}>{timesheetEntry.status}
                                        </Badge>
                                    </Box>    
                                </HStack>                                                                         
                            </GridItem>
                        </Grid>
                    ))}
                    <HStack>
                        <Box marginRight="1rem">
                        </Box>
                        <Box>
                            <Button className="btn" onClick={() => addTimesheeEntry(timesheetEntries.length)}>
                                Add Entry
                            </Button>
                        </Box>

                    </HStack>
                  </Stack>
                </CardBody>
              </Card>              
            </Stack>
        </>
    );
};

export default WeeklyTimesheetEntry;