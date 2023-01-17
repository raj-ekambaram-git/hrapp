import React from "react";
import { Badge, Input, Button, Card, CardHeader, CardBody, Box, Text, Stack, Select, HStack, Checkbox, Textarea, FormControl, FormLabel, useToast } from "@chakra-ui/react";
import { ExpenseConstants } from "../../constants";
import { useSelector, useDispatch } from "react-redux";
import { setExpenseHeader } from "../../store/modules/Expense/actions";


const ExpenseHeader = (props) => {
  const dispatch = useDispatch();
  const expenseHeader = useSelector(state => state.expense.expenseHeader);

  function handleExpenseHeaderEntry(name, value) {
    const newExpenseHeader = {...expenseHeader};
    newExpenseHeader[name] = value;
    dispatch(setExpenseHeader(newExpenseHeader))
  }
  return (
    <Card variant="expenseProjectDetails">
      <CardHeader>
        <HStack spacing="55rem">
          <Box>
            <Text>
              Expense Details
            </Text>
          </Box>
          <Box>
              {props.isAddMode || (!props.isAddMode && (props.status != ExpenseConstants.EXPENSE_STATUS.Approved || props.status != ExpenseConstants.EXPENSE_STATUS.Paid  || props.status != ExpenseConstants.EXPENSE_STATUS.PartiallyPaid)) ? (
                  <>
                      <HStack>
                          <Box>
                              <Button size="xs" bgColor="header_actions" onClick={() => props.submitExpense(ExpenseConstants.EXPENSE_STATUS.Saved)}>
                                  Save
                              </Button>
                          </Box>
                          <Box>
                              <Button size="xs" bgColor="header_actions" onClick={() => props.submitExpense(ExpenseConstants.EXPENSE_STATUS.Submitted)}>
                                  {props.isAddMode ? (
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
        <Stack marginBottom="2rem" spacing={8}>
          <Box maxWidth="25%">
            <FormControl isRequired>
                <FormLabel>Expense Name</FormLabel>
                <Input type="text" id="name"  value={expenseHeader.name} onChange={(ev) => handleExpenseHeaderEntry("name",ev.target.value)}/>
            </FormControl>                
          </Box>
          <HStack spacing="20rem" marginBottom={5}>
            <Box>
              <FormControl isRequired>
                    <FormLabel>Project Details</FormLabel>
                    <Select id="projectId" value={expenseHeader.projectId} onChange={(ev) => handleExpenseHeaderEntry("projectId",ev.target.value)}>
                        <option value="">Select Project</option>
                        {props.userProjectList?.map((project) => (
                            <option value={project.projectId} data-unitprice={project.unitPrice} >{project.project.name} - {project.project.referenceCode}</option>
                        ))}
                    </Select>  
                </FormControl>    
            </Box>
            <Box>
              <FormControl>
                  <FormLabel>Billable</FormLabel>
                  <Checkbox isChecked={expenseHeader.billable} onChange={(e) => handleExpenseHeaderEntry("billable",e.target.checked)}/>    
              </FormControl>                 
            </Box>
          </HStack>    
          <HStack spacing="27rem">
              <Box>
                <FormControl>
                    <FormLabel>Expense Description</FormLabel>
                    <Textarea type="text" id="description" value={expenseHeader.description} onChange={(ev) => handleExpenseHeaderEntry("description",ev.target.value)}/>
                </FormControl>    
              </Box>              
              <Box>
                <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Badge color={`${expenseHeader.status === "Approved"? "timesheet.approved_status": (expenseHeader.status === "Submitted" || expenseHeader.status === "Saved")? "timesheet.approved_status": "timesheet.pending_status"}`}>{expenseHeader.status}</Badge>
                </FormControl>                   
              </Box>
          </HStack>  
        </Stack>        
      </CardBody>
    </Card>
  );
};

export default ExpenseHeader;


