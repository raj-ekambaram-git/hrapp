import React from "react";
import { Input, Button, Card, CardHeader, CardBody, Box, Text, Stack, Select, HStack, Checkbox, Textarea, FormControl, FormLabel, useToast } from "@chakra-ui/react";
import { ExpenseConstants } from "../../constants";


const ExpenseHeader = (props) => {
 
  return (
    <Card variant="expenseProjectDetails">
      <CardHeader>
        <HStack spacing="55rem">
          <Box>
            <Text>
              Project Details
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
        <Stack marginBottom="2rem">
          <HStack>
            <Input type="text" id="name"  value={props.name} onChange={(ev) => props.setName(ev.target.value)}/>
          </HStack>
          <HStack spacing="20rem" marginBottom={5}>
            <HStack>
              <FormControl isRequired>
                    <FormLabel>Project Details</FormLabel>
                    <Select id="projectId" value={props.expenseProjectId} onChange={(ev) => props.setProjectId(ev.target.value)}>
                        <option value="">Select Project</option>
                        {props.userProjectList?.map((project) => (
                            <option value={project.projectId} data-unitprice={project.unitPrice} >{project.project.name} - {project.project.referenceCode}</option>
                        ))}
                    </Select>  
                </FormControl>    
            </HStack>
            <HStack>
              <Box>
                <Text>
                  Billable:
                </Text>
              </Box>
              <Checkbox
                onChange={(e) => props.setBillable(e.target.checked)}
              />    
            </HStack>
          </HStack>    
          <HStack>
              <FormControl isRequired>
                  <FormLabel>Project Details</FormLabel>
                  <Textarea type="text" id="description" size="md" maxWidth="30%" onChange={(ev) => props.setDescription(ev.target.value)}/>
              </FormControl>    
          </HStack>  
        </Stack>        
      </CardBody>
    </Card>
  );
};

export default ExpenseHeader;


