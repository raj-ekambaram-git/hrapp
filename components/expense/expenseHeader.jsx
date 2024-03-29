import React, { useEffect, useState } from "react";
import { Badge, Input, Button, Card, CardHeader, CardBody, Box, Text, Stack, Select, HStack, Checkbox, Textarea, FormControl, FormLabel, useToast } from "@chakra-ui/react";
import { ExpenseConstants } from "../../constants";
import { useSelector, useDispatch } from "react-redux";
import { setExpenseHeader } from "../../store/modules/Expense/actions";
import { ExpenseStatus, ExpenseType, ProjectStatus } from "@prisma/client";
import { util } from "../../helpers/util";
import ExpenseAttachment from "./expenseAttachment";


const ExpenseHeader = (props) => {
  const dispatch = useDispatch();
  const expenseHeader = useSelector(state => state.expense.expenseHeader);
  console.log("props.isAddMode::"+props.isAddMode)
  const [isAddMode, setAddMode] = useState(props.isAddMode);

  function handleExpenseHeaderEntry(name, value) {
    const newExpenseHeader = {...expenseHeader};
    newExpenseHeader[name] = value;
    dispatch(setExpenseHeader(newExpenseHeader))
  }
  return (
    <Card variant="expenseProjectDetails">
      <CardHeader>
        <HStack spacing="70rem">
          <Box>
            <Text>
              Expense Details
            </Text>
          </Box>
          <Box>
            <>
              <HStack>
              {props.isAddMode || ((!props.isAddMode && props.status != ExpenseConstants.EXPENSE_STATUS.Approved && props.status != ExpenseConstants.EXPENSE_STATUS.Paid  && props.status != ExpenseConstants.EXPENSE_STATUS.PartiallyPaid)) ? (
                <>
                  <Button size="xs" bgColor="header_actions" onClick={() => props.submitExpense(ExpenseConstants.EXPENSE_STATUS.Saved)}>
                      Save
                  </Button>
                  <Button size="xs" bgColor="header_actions" onClick={() => props.submitExpense(ExpenseConstants.EXPENSE_STATUS.Submitted)}>
                      {isAddMode == "true" ? (
                          <>Submit</>
                      ) : (
                          <>Submit</>
                      )}
                  </Button>
                  {props.isAddMode ?(<></>):(
                      // <ExpenseAttachment/>
                      <></>
                  )}      
                </>
                  
              ) : (
                  <>
                  {props.isAddMode ?(<></>):(
                      // <ExpenseAttachment/>
                      <></>
                  )}                  
                  </>
              )}
              </HStack>    
            </>
          </Box>      
        </HStack>  
      </CardHeader>
      <CardBody>
        <Stack marginBottom="2rem" spacing={8}>
          <Box maxWidth="25%">
            <FormControl isRequired>                
                <Input  placeholder=" " type="text" id="name"  value={expenseHeader.name} onChange={(ev) => handleExpenseHeaderEntry("name",ev.target.value)}/>
                <FormLabel>Expense Name</FormLabel>
            </FormControl>                
          </Box>
          <HStack spacing="20rem" marginBottom={5}>
            <Box>
              <FormControl isRequired>                    
                    <Select id="projectId" value={expenseHeader.projectId} onChange={(ev) => handleExpenseHeaderEntry("projectId",ev.target.value)}>
                        <option value="">Select Project</option>
                        {props.userProjectList?.map((project) => (
                          {...project.project?.status === ProjectStatus.Open?(<>
                            <option value={project.projectId} data-unitprice={project.unitPrice} >{project.project.name} - {project.project.referenceCode}</option>
                            </>):(<></>)}
                        ))}
                    </Select>  
                    <FormLabel>Project Details</FormLabel>
                </FormControl>    
            </Box>
            <Box>
              <FormControl>
                  {/* <FormLabel>Billable</FormLabel>
                  <Checkbox isChecked={expenseHeader.billable} onChange={(e) => handleExpenseHeaderEntry("billable",e.target.checked)}/>     */}
              </FormControl>                 
            </Box>
          </HStack>    
          <HStack spacing="27rem">
              <Box>
                <FormControl>                    
                    <Textarea type="text" id="description" value={expenseHeader.description} onChange={(ev) => handleExpenseHeaderEntry("description",ev.target.value)}/>
                    <FormLabel>Expense Description</FormLabel>
                </FormControl>    
              </Box>              
              <Stack>
                {props.isAddMode?(<></>):(<>
                  <Box>
                    <FormControl>                                                
                        <Badge color={`${expenseHeader.status === "Approved"? "timesheet.approved_status": (expenseHeader.status === "Submitted" || expenseHeader.status === "Saved")? "timesheet.approved_status": "timesheet.pending_status"}`}>{expenseHeader.status}</Badge>
                    </FormControl>                   
                  </Box>
                </>)}
                {(expenseHeader.status === ExpenseStatus.Approved || expenseHeader.status === ExpenseStatus.Rejected) ? (<>
                  <Box>
                    <FormControl>
                      <HStack>
                        <Box>by</Box>
                        <Box fontWeight="bold">{expenseHeader.approvedBy?.firstName} {expenseHeader.approvedBy?.lastName}</Box>
                        <Box>on </Box>
                        <Box fontWeight="bold">{util.getFormattedDate(expenseHeader.approvedDate)}</Box>
                      </HStack>
                    </FormControl>                   
                  </Box>                
                </>) : (<></>)}
              </Stack>                
          </HStack>  
        </Stack>        
      </CardBody>
    </Card>
  );
};

export default ExpenseHeader;


