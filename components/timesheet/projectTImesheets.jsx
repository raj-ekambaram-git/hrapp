
import {
    Box,
    Heading,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    TableContainer,
    TableCaption,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Card,
    CardHeader,
    HStack,
    CardBody,
    Stack,
    StackDivider,
    Badge,
    AccordionIcon

  } from '@chakra-ui/react';

  import {TIMESHEET_STATUS} from "../../constants/accountConstants";
  import TimesheetEntryDetail from './timesheetEntryDetail';
import { useSelector } from 'react-redux';
  
const ProjectTimesheets = (props) => {
    
    const approvalList = useSelector(state => state.timesheet.approvalTimesheets);

    return (
        <div>
             <Card>
                <CardHeader>
                    <HStack spacing="50rem">
                    <Box>
                        <Heading size='xs'>Projects</Heading>
                    </Box>
                    </HStack>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing='1'>
                        <Accordion defaultIndex={[0]} variant="mainPage">
                        {approvalList?.map((timesheet) => (
                            <AccordionItem marginBottom="1rem" border="1px" width="80%">
                                <h2>
                                    <AccordionButton bgColor="table_tile">
                                        <Box as="span" flex='1' textAlign='left'>
                                            <Heading size='xs' textTransform='uppercase'>
                                                {timesheet.project.name} -- {timesheet.project.referenceCode} -- {timesheet.billable?"Billable":"Non-Billable"} 
                                            </Heading>
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <TableContainer marginTop="1rem">
                                        <Table variant="tableInsideAccoridion">
                                            <TableCaption></TableCaption>
                                            <Thead>
                                                <Tr bgColor="table_tile">
                                                    <Th>
                                                        Resource
                                                    </Th>
                                                    <Th>
                                                        Timesheet
                                                    </Th>      
                                                    <Th>
                                                        Billable
                                                    </Th>                                                        
                                                    <Th>
                                                        Entries
                                                    </Th>                                                                
                                                    <Th>
                                                        Status
                                                    </Th>
                                                </Tr>   
                                            </Thead>                
                                            <Tbody>
                                                {timesheet.project.timesheetEntries?.map((timesheetEntry) => (
                                                    <Tr>
                                                        {timesheetEntry.status == TIMESHEET_STATUS.Submitted ? (
                                                            <>
                                                                <Th>
                                                                    {timesheetEntry.timesheet.user.firstName} {timesheetEntry.timesheet.user.lastName}
                                                                </Th>
                                                                <Th>
                                                                    {timesheetEntry.timesheet.name}
                                                                </Th>
                                                                <Th>
                                                                    {timesheetEntry.billable?"Yes":"No"}
                                                                </Th>
                                                                <Th>
                                                                    <TimesheetEntryDetail tsEntryDetail={timesheetEntry}/>
                                                                </Th> 
                                                                <Th>
                                                                    <Badge color={`${
                                                                            timesheetEntry.status === "Approved"
                                                                            ? "timesheet.approved_status"
                                                                            : (timesheetEntry.status === "Submitted" || timesheetEntry.status === "Saved")
                                                                            ? "timesheet.pending_status"
                                                                            : "timesheet.pending_status"
                                                                        }`}>{timesheetEntry.status}
                                                                    </Badge>                                                                    
                                                                </Th>                                                            
                                                            </>
                                                        ) : (
                                                            <>
                                                            </>
                                                        )}

                                                    </Tr>
                                                ))}
                                            </Tbody>    
                                        </Table>
                                    </TableContainer>                                        
                                </AccordionPanel>
                            </AccordionItem>
                        ))}
                    </Accordion>                    
                  </Stack>
                </CardBody>
            </Card>
        </div>
    );
};


export default ProjectTimesheets;