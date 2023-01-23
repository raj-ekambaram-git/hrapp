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
    useToast
  } from '@chakra-ui/react';
import TimesheetDateHeader from "./timesheetDateHeader";
import {
     DeleteIcon,ArrowBackIcon,ArrowForwardIcon, CheckCircleIcon
  } from '@chakra-ui/icons';  
import { useDispatch, useSelector } from "react-redux";
import {setnewTSWeekStartDimId, setSelectedTimesheetId, setTSEntries} from '../../store/modules/Timesheet/actions';
import { util } from "../../helpers/util";
import { ErrorMessage } from "../../constants/errorMessage";
import TimesheetEntryNotes from "../notes/timesheetEntryNotes";
import TimesheetDailyEntryNotes from "./timesheetEntryDailyNotes";
import { ShowInlineErrorMessage } from "../common/showInlineErrorMessage";


  
const WeeklyTimesheetEntry = (props) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const toast = useToast();
    const [showErrorMessage, setShowErrorMessage] = useState(EMPTY_STRING);
    const [isAddMode, setAddMode] = useState(true);
    // const [timesheetEntries, setTimesheetEntries] = useState([{projectId: "", status: "", entries: {day1: {hours: "", error: false, date: "", note: ""}, day2: {hours: "", error: false, date: "", note: ""},day3: {hours: "", error: false, date: "", note: ""},day4: {hours: "", error: false, date: "", note: ""},day5: {hours: "", error: false, date: "", note: ""},day6: {hours: "", error: false, date: "", note: ""},day7: {hours: "", error: false,date: "", note: ""}}}]);
    const [userProjectList, setUserProjectList] = useState([]);
    const [timesheetData, setTimesheetData] = useState([]);
    const [timesheetName, setTimesheetName] = useState(EMPTY_STRING);
    const [weekCalendar, setWeekCalendar] = useState({});
    const [timesheetStartDate, setTimesheetStartDate] = useState(EMPTY_STRING);
    const [previousWeekStart, setPreviousWeekStart] = useState(EMPTY_STRING);
    const [nextWeekStart, setNextWeekStart] = useState(EMPTY_STRING);
    const userId = props.data.userId;
    const newTSWeekStartDimId = useSelector(state => state.timesheet.newTSWeekStartDimId);
    const timesheetEntries = useSelector(state => state.timesheet.timesheetEntries);

    useEffect(() => {

        if(userService.isAccountAdmin() || userService.isSuperAdmin() || userService.isManager()) {
          getProjectForUser(userId);
        }else if(userService.isTimesheetEntryUser()) {
          // getProjectForUser(userService.getAccountDetails().accountId);
          getProjectForUser(userId);
        }
        setAddMode(props.data.isAddMode);
        getTimesheetDetailsAPICall();
    
      }, []);

      async function getTimesheetDetailsAPICall() {
        // Call only if the user is SUPER_ADMIN and accountId as zero
        if((userService.isAccountAdmin() || userService.isSuperAdmin() || userService.isTimesheetEntryUser() || userService.isManager()) 
              && (props && props.data && !props.data.isAddMode)) { // This is for EDIT 
                const timesheetResponse = await timesheetService.getTimesheetDetails(props.data.timesheetId, userService.getAccountDetails().accountId);
                setTimesheetData(timesheetResponse);
                setTimesheetName(timesheetResponse.name);
                // setTimesheetEntries(timesheetResponse?.timesheetEntries);
                dispatch(setTSEntries(timesheetResponse?.timesheetEntries));
                if(timesheetResponse?.timesheetEntries[0]) {
                    setWeekCalendar(timesheetResponse.timesheetEntries[0]?.entries);
                }else {
                    const timesheetDateStr = (new Date(timesheetResponse.startDate))?.getFullYear()+(String((new Date(timesheetResponse.startDate))?.getMonth()+1).padStart(2, "0"))+String((new Date(timesheetResponse.startDate))?.getDate()).padStart(2, "0");
                    const timesheetMetaData = await timesheetService.getTimesheetMetaForDate(timesheetDateStr);
                    setWeekCalendar(timesheetMetaData.currentWeekDates);
                }

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
            dispatch(setTSEntries([{projectId: "", status: "", entries: {day1: {hours: "", error: false, date: "", note: ""}, day2: {hours: "", error: false, date: "", note: ""},day3: {hours: "", error: false, date: "", note: ""},day4: {hours: "", error: false, date: "", note: ""},day5: {hours: "", error: false, date: "", note: ""},day6: {hours: "", error: false, date: "", note: ""},day7: {hours: "", error: false, date: "", note: ""}}}]));
            const timesheets = await timesheetService.getTimesheetByName(timesheetMetaData.weekOfYearISO, userService.userValue.id);
            if(timesheets != undefined && timesheets.length > 0) {
                setTimesheetData(timesheets[0]);
                props.data.isAddMode = false;
                // setTimesheetEntries(timesheets[0]?.timesheetEntries);
                dispatch(setTSEntries(timesheets[0]?.timesheetEntries));
            }

        }
    
      }      

    async function getProjectForUser(userId) {
        const projectsForUserResponse = await userService.getProjectsByUser(userId, userService.getAccountDetails().accountId);    
        setUserProjectList(projectsForUserResponse);
    }



    function addTimesheeEntry(timesheetEntryCountLength) {
        const inputData = [...timesheetEntries];
        inputData.push({projectId: "", status: "", entries: {day1: {hours: "", error: false, date: "", note: ""}, day2: {hours: "", error: false, date: "", note: ""},day3: {hours: "", error: false, date: "", note: ""},day4: {hours: "", error: false, date: "", note: ""},day5: {hours: "", error: false, date: "", note: ""},day6: {hours: "", error: false, date: "", note: ""},day7: {hours: "", error: false, date: "", note: ""}}});
        // setTimesheetEntries(inputData);
        dispatch(setTSEntries(inputData));

    }


    function submitTimesheet(status) {
        const inputData = [...timesheetEntries];
        for (let i = 0; i < inputData.length; i++) {
            if(inputData[i].status != TIMESHEET_STATUS.Approved && inputData[i].status != TIMESHEET_STATUS.Invoiced)
                inputData[i].status = status;
            inputData[i].entries.day1.date = weekCalendar.day1.date;
            inputData[i].entries.day2.date = weekCalendar.day2.date;
            inputData[i].entries.day3.date = weekCalendar.day3.date;
            inputData[i].entries.day4.date = weekCalendar.day4.date;
            inputData[i].entries.day5.date = weekCalendar.day5.date;
            inputData[i].entries.day6.date = weekCalendar.day6.date;
            inputData[i].entries.day7.date = weekCalendar.day7.date;

            if(inputData[i].projectId === null) {
                setShowErrorMessage(ErrorMessage.SELECT_PROJECT_REQUIRED)
                return false;
            }
            //Validate Notes for required
            if(inputData[i].notesRequired) {
                for(let j=1;j<8;j++){
                    if(inputData[i].entries["day"+j]?.hours && inputData[i].entries["day"+j]?.hours != EMPTY_STRING && (inputData[i].entries["day"+j]?.notes === EMPTY_STRING || inputData[i].entries["day"+j]?.notes === undefined)) {
                        setShowErrorMessage(ErrorMessage.DAILY_NOTES_REQUIRED)
                        return false;
                    }
                }
            }

            delete inputData[i]["projectName"]
        }
        // setTimesheetEntries(inputData);
        dispatch(setTSEntries(timesheetEntries));
        // props.data.handleTimeSheetEntries(timesheetEntries);
        props.data.onSubmit({status: status, timesheetName:timesheetName, timesheetStartDate: timesheetStartDate});
        
    }



    function setTimesheetEntry(index, ev, dayNumber) {
        const inputValue = ev.target.value;
        const inputData = [...timesheetEntries];
        let timeEntryRecord;

        //Condition when new record is updated for first time
        if(inputData.length === 0 || inputData.length <= index) {
            timeEntryRecord = TIMESHEET_ENTRY_DEFAULT;
            inputData.push(timeEntryRecord);
        } else { //Trying to update thhe record already created
            timeEntryRecord = inputData[index];
        }

        if(dayNumber != "projectId" && timeEntryRecord.projectId === EMPTY_STRING) {
            //Error to selecct the project firsst
            setShowErrorMessage(ErrorMessage.SELECT_PROJECT_REQUIRED)
            return;
        }else {
            setShowErrorMessage(EMPTY_STRING)
        }
        //Validate the value entered to be 24hrs max and sum of all the rows for that day is 24hrs too
        const dayN = "day"+dayNumber;
        if(dayNumber != "projectId" && (inputValue > 24 || enteredTotalHoursPerDay(dayNumber, index)+parseInt(inputValue) > 24)) {            
            timeEntryRecord.entries[dayN].error = true;
            toast({
                title: 'Timesheet Entry Error.',
                description: ErrorMessage.TIMESHEET_HOURS_ENTRY_ERROR,
                status: 'error',
                position: 'top',
                duration: 6000,
                isClosable: true,
              })
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
                timeEntryRecord.notesRequired = ev.target.options.item(ev.target.selectedIndex).getAttribute("data-dailyNotesRequired")==="true"?true:false
                timeEntryRecord.projectName = ev.target.options.item(ev.target.selectedIndex).getAttribute("data-projectName")
                break;
            default:
                console.log("default");                    
                break;
        }


        // setTimesheetEntries(inputData);
        dispatch(setTSEntries(inputData));
    }

    function enteredTotalHoursPerDay(dayNumber, index) {
        let timesheetTotalEntryHour = 0;
        console.log("timesheetTotalEntryHour IIIII:::"+JSON.stringify(timesheetEntries));
        const dayN = "day"+dayNumber;
        for (let i = 0; i < timesheetEntries.length; i++) {
            console.log("enteredTotalHoursPerDay[i]:::"+dayNumber+"-----"+JSON.stringify(timesheetEntries[i].entries[dayN].hours));
            if(timesheetEntries[i].entries[dayN].hours !== EMPTY_STRING && index != i) {
                timesheetTotalEntryHour = timesheetTotalEntryHour+parseInt(timesheetEntries[i].entries[dayN].hours);
            }
        }
      return timesheetTotalEntryHour;
    }

    async function changeTimesheet(moveBefore, weekStartDate ) {
        //Call calendar by bassing the timesheet name
        const timesheetMetaData = await timesheetService.getTimesheetMetaForDate(weekStartDate);

        //Call timesheet and see if that week timesheet name is present
        const timesheets = await timesheetService.getTimesheetByName(timesheetMetaData.weekOfYearISO, userService.userValue.id);
        if(timesheets != undefined && timesheets.length > 0) {
            dispatch(setSelectedTimesheetId(timesheets[0]?.id))
            router.push({ pathname: '/timesheet/', query: { }});
        }else {
            dispatch(setnewTSWeekStartDimId(timesheetMetaData.dateDimId ))
            router.push({ pathname: '/timesheet/add', query: {}});
        }
    }


    function deleteTimesheetEntry(removeIndex) {
        const inputEntriesData = [...timesheetEntries];
        inputEntriesData.splice(removeIndex, 1);
        // setTimesheetEntries(inputEntriesData);
        dispatch(setTSEntries(inputEntriesData))
    }
    

    return (
        <>
            <Stack spacing={2}>
              <Card variant="timesheet">
                <CardHeader> 
                    <HStack gap="13rem">
                        <Box>
                            <Heading size='sm'>Timesheet Entry</Heading>
                        </Box>
                        <Box width="timesheet.nameDropDown">
                            <HStack>
                                <ArrowBackIcon onClick={() => changeTimesheet(true, previousWeekStart)}/>
                                <Heading size='sm'>{isAddMode?timesheetName:timesheetData.name}</Heading>
                                <ArrowForwardIcon onClick={() => changeTimesheet(false, nextWeekStart)}/>
                            </HStack>
                        </Box>
                        <Box></Box>
                        <Box></Box>
                        <Box>
                            {isAddMode || (!isAddMode && (timesheetData.status != TIMESHEET_STATUS.Approved || timesheetData.status != TIMESHEET_STATUS.Invoiced)) ? (
                                <>
                                    <HStack>
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
                    <ShowInlineErrorMessage showErrorMessage={showErrorMessage}/>
                    <TimesheetDateHeader data={weekCalendar}></TimesheetDateHeader>
                    {timesheetEntries?.map((timesheetEntry, index) => (
                        <Grid gap="1rem" marginBottom="2rem" autoRows>
                            <GridItem colSpan={2} h='10'>
                                <HStack spacing="1em">    
                                {isAddMode || (!isAddMode && timesheetData.status != TIMESHEET_STATUS.Approved) ? (
                                    <>
                                        <Box>
                                            {(timesheetEntry.status != TIMESHEET_STATUS.Approved && timesheetEntry.status != TIMESHEET_STATUS.Invoiced && index !=0) ? <DeleteIcon onClick={() => deleteTimesheetEntry(index)}/> : <CheckCircleIcon color="header_actions"/>}
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
                                                <option value={project.projectId} data-unitprice={project.unitPrice} data-dailyNotesRequired={project.project?.timesheetNotesRequired} data-projectName={project.project?.name} >{project.project?.name} - {project.project?.referenceCode} - {project.billable?"Billable":"Non-Billable"} </option>
                                            ))}
                                        </Select>  
                                    </Box>  
                                    <Box width={14}>
                                        <TimesheetDailyEntryNotes index={index} dailyNotesRequired={timesheetEntry.notesRequired} weekCalendar={weekCalendar} projectName={timesheetEntry.projectName}/>
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
                                            }`}>{timesheetEntry.status?timesheetEntry.status:"Draft"}
                                        </Badge>
                                    </Box> 
                                    <Box>
                                        <TimesheetEntryNotes TimesheetEntryId={timesheetEntry.id}/>
                                    </Box>   
                                </HStack>                                                                         
                            </GridItem>
                        </Grid>
                    ))}
                    <HStack>
                        <Box marginRight="1rem">
                        </Box>
                        <Box>
                            <Button size="xs" bgColor="header_actions"  onClick={() => addTimesheeEntry(timesheetEntries.length)}>
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