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
import { util } from "../../../helpers/util";
import ProjectTimesheeEntrySection from "./projectTimesheeEntrySection";
import { INVOICE_CALL_TYPE, TIMESHEET_STATUS } from "../../../constants/accountConstants";



const ProjectTimesheets = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    console.log("ProjectTimesheets::DATTA::::"+JSON.stringify(props))
    const projectId = props.data.projectId;
    const callType = props.data.callType;
    const [size, setSize] = useState('');
    
    const timesheetEntryList = useSelector(state => state.timesheet.projectTimesheets);

    console.log("ProjectTimesheets::timesheetList::::"+JSON.stringify(timesheetEntryList))

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
    
  return (

    <div>
        
        <Button
              onClick={() => handleProjectTimesheets("xl")}
              key="xl"
              m={1}
              >{`Project Timesheets`}
          </Button>

          <Drawer onClose={onClose} isOpen={isOpen} size="xl">
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            <Heading as="h1" size="lg" letterSpacing={'-.1rem'} marginBottom="1rem">
                                Project Timesheets
                            </Heading>
                            <Heading as="h3" size="md">
                                
                            </Heading>
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
                                {callType==INVOICE_CALL_TYPE ? (
                                  <>
                                  <Button className="btn" onClick={() => handleRejectedTimesheets()} width="timesheet.project_timesheets_button" bgColor="button.primary.color">
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
                                                <Checkbox
                                                  onChange={(e) => addTimesheetEntryAsInvoiceItem(e.target.checked)}
                                                />        
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                          </Th>
                                            <Th>
                                                {timesheetEntry.timesheet.name}
                                            </Th>
                                            <Th>
                                                {timesheetEntry.timesheet.user.firstName} {timesheetEntry.timesheet.user.lastName}
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
                                              
                                    ))};
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
