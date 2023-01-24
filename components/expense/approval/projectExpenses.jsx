
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
import { useSelector } from 'react-redux';
import { ExpenseConstants } from '../../../constants';
import { util } from '../../../helpers/util';
import ExpenseEntryDetail from './expenseEntryDetail';

  
const ProjectExpenses = (props) => {
    
    const approvalList = useSelector(state => state.expense.approvalExpenses);

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
                        {approvalList?.map((expense) => (
                            <AccordionItem marginBottom="1rem" border="1px" width="80%">
                                <h2>
                                    <AccordionButton bgColor="table_tile">
                                        <Box as="span" flex='1' textAlign='left'>
                                            <Heading size='xs' textTransform='uppercase'>
                                                {expense.project.name} -- {expense.project.referenceCode}
                                            </Heading>
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <TableContainer marginTop="1rem">
                                        <Table variant="sortTable">
                                            <TableCaption></TableCaption>
                                            <Thead>
                                                <Tr bgColor="table_tile">
                                                    <Th>
                                                        Resource
                                                    </Th>
                                                    <Th>
                                                        Expense
                                                    </Th>      
                                                    <Th>
                                                        Total
                                                    </Th>                                                                
                                                    <Th>
                                                        
                                                    </Th>                                                                
                                                    <Th>
                                                        Status
                                                    </Th>
                                                    <Th>
                                                        Submitted On
                                                    </Th>
                                                </Tr>   
                                            </Thead>                
                                            <Tbody>
                                                {expense.project.expense?.map((expenseEntry) => (
                                                    <Tr>
                                                        {expenseEntry.status == ExpenseConstants.EXPENSE_STATUS.Submitted ? (
                                                            <>
                                                                <Th>
                                                                    {expenseEntry.user.firstName} {expenseEntry.user.lastName}
                                                                </Th>
                                                                <Th>
                                                                    {expenseEntry.name}
                                                                </Th>
                                                                <Th>
                                                                    $ {expenseEntry.total}
                                                                </Th>

                                                                <Th>
                                                                    <ExpenseEntryDetail expense={expenseEntry}/>
                                                                </Th> 
                                                                <Th>
                                                                    <Badge color={`${
                                                                            expenseEntry.status === "Approved"
                                                                            ? "timesheet.approved_status"
                                                                            : (expenseEntry.status === "Submitted" || expenseEntry.status === "Saved")
                                                                            ? "timesheet.approved_status"
                                                                            : "timesheet.pending_status"
                                                                        }`}>{expenseEntry.status}
                                                                    </Badge>                                                                    
                                                                </Th>     
                                                                <Th>
                                                                    {util.getFormattedDate(expenseEntry.lastUpdateDate)}
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


export default ProjectExpenses;