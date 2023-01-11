import React, { useState, useEffect } from "react";
import {
  useDisclosure,
  Button,
  Table,
  Thead,
  Tbody,
  Box,
  TableContainer,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  FormControl,
  FormLabel,
  Select,
  Th,
  Tr,
  useToast,
  Text,
  Tooltip,
  HStack
} from '@chakra-ui/react';
import {
  DeleteIcon,InfoIcon
} from '@chakra-ui/icons';
import { useDispatch, useSelector } from "react-redux";
import { userService } from "../../../services";
import { EMPTY_STRING } from "../../../constants/accountConstants";
import { ErrorMessage } from "../../../constants/errorMessage";
import { ShowInlineErrorMessage } from "../../common/showInlineErrorMessage";
import { fetchAvailableProjectsForUser } from "../../../store/modules/User/actions";



const AllocateProject = (props) => {
  const [size, setSize] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {data} = props;
  const dispatch = useDispatch();
  const toast = useToast();
  const [userProjectId, setUserProjectId] = useState(EMPTY_STRING);
  const [showErrorMessage, setShowErrorMessage] = useState(EMPTY_STRING);

  const userProjects = useSelector(state => state.user?.userProjects);
  const availableProjectsForUser = useSelector(state => state.user?.availableProjectsForUser);

  function handleAllocateProject(newSize) {
    setSize(newSize);
    onOpen();
  }

  useEffect(() => {
    setShowErrorMessage(EMPTY_STRING);
    dispatch(fetchAvailableProjectsForUser(data.userId, userService.getAccountDetails().accountId))
  }, []);

  async function handleRemoveProjectFromUser(projectResourceId, removedIndex) {
    const userProjectRequest = {
      id: parseInt(projectResourceId),
      accountId: userService.getAccountDetails().accountId
    };
    const responseData = await userService.removeUserProject(userVendorRequest,);
    if(responseData != undefined && responseData!= EMPTY_STRING && responseData.error) {
      toast({
        title: 'Remove Project from an user.',
        description: 'Error removing project from an user. Details::'+responseData.errorMessage,
        status: 'error',
        position: 'top',
        duration: 9000,
        isClosable: true,
      })
    }else {
      dispatch(removeUserProjectByIndex(removedIndex));
      toast({
        title: 'Remvoe Project from an user.',
        description: 'Successfully removed project to this user.',
        status: 'success',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })
    }
  }


  async function handleAddProjectToUser() {

    if(userProjectId != undefined && userProjectId != EMPTY_STRING) {
      const userProjectRequest = {
        userId: parseInt(data.userId),
        vendorId: parseInt(userProjectId),
        status: "Active"
      };
      const responseData = await userService.addUserProject(userProjectRequest, userService.getAccountDetails().accountId);
      if(responseData != undefined && responseData!= EMPTY_STRING && responseData.error) {
        toast({
          title: 'Add Project to an user.',
          description: 'Error adding project to an user. Details::'+responseData.errorMessage,
          status: 'error',
          position: 'top',
          duration: 9000,
          isClosable: true,
        })
      }else {
        dispatch(setUserProjects(responseData));
        toast({
          title: 'Add Project to an user.',
          description: 'Successfully added project to this user.',
          status: 'success',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })
      }
    }else {
      setShowErrorMessage(ErrorMessage.SELECT_VENDOR_REQUIRED);
      return;
    }
  }
  return (

    <div>

          <Button
              onClick={() => handleAllocateProject("lg")}
              key="lg"
              m={1}
              >{`Allocate Project`}
          </Button>

          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            Allocate Project user {data.userFirstName} {data.userLastName}
                        </DrawerHeader>
                        <DrawerBody>
                          <Stack spacing={8}>
                            <Box>
                              <Text>
                                Assign user to vendor first to select a project.
                              </Text>
                            </Box>
                            <Box border="box_border">
                              <TableContainer>
                                <Table variant="manageUserVendors">
                                <Thead>
                                    <Tr bgColor="table_tile">
                                      <Th>
                                      </Th>
                                      <Th>
                                        Project
                                      </Th>                                      
                                    </Tr>
                                  </Thead>
                                  <Tbody> 
                                  {userProjects?.map((projectResource, index) => (
                                    <Tr>
                                      <Th>
                                        <DeleteIcon onClick={() => handleRemoveProjectFromUser(projectResource.id, index)}/>
                                      </Th>
                                      <Th>
                                        {projectResource.project?.name} 
                                      </Th>                                      
                                    </Tr>
                                  ))}                                    
                                  </Tbody>
                                </Table>
                              </TableContainer>      
                            </Box>                            
                            <Box>
                              <Box>
                                <ShowInlineErrorMessage showErrorMessage={showErrorMessage}/>
                            </Box>                          
                            <FormControl isRequired>
                              <HStack>
                              <Text>
                                <FormLabel>
                                  Project
                                </FormLabel>
                              </Text>
                              <Tooltip label="Assign user to at least one vendor to have the project listed">
                                <InfoIcon/>
                              </Tooltip>
                              </HStack>                              
                              <Select width="50%" onChange={(ev) => setUserProjectId(ev.target.value)}>
                                  <option value="">Select a Project</option>
                                  {availableProjectsForUser?.map((userVendor) => {
                                    return(
                                      <>
                                        {userVendor?.vendor?.project.map((project) => {
                                           return(<>
                                            <option value={project.id}>{project.name}</option>
                                           </>);
                                        })}
                                      </>
                                    )
                                  })}                                     
                              </Select>
                              
                            </FormControl>     
                            </Box> 
                            <Button onClick={() => handleAddProjectToUser()} size="sm" width="30%" bgColor="button.primary.color">
                              Add Vendor
                            </Button>                            
                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
          </Drawer>

    </div>


  );
};

export default AllocateProject;
