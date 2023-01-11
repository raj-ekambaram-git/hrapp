import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { accountService, userService } from "../../services";
import { PageNotAuthorized } from "../../components/common/pageNotAuthorized";
import {
  HStack,
  Button,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Box,
  Flex,
  TableContainer,
  TableCaption,
  Badge
} from '@chakra-ui/react'
import {PageMainHeader} from '../../components/common/pageMainHeader'
import { useDispatch, useSelector } from "react-redux";
import { setSelectedProjectId } from "../../store/modules/Project/actions";


const ProjectList = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data } = props.projectList;
  const { isVendor } = props.projectList;
  console.log("ProjectList::"+JSON.stringify(data))
  console.log("ProjectList:   isVendor:"+JSON.stringify(isVendor))
  const [projectList, setProjectList] = useState([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const accountId = useSelector(state => state.account.selectedAccountId);

  useEffect(() => {

    if(isVendor) {
      //get API call with accountId and VendorId
      if(userService.isSuperAdmin()) {
        getProjectList(data.vendorId, "NaN")
      }else {
        getProjectList(data.vendorId, accountId)
      }
      setPageAuthorized(true);
      
      
    }else {
      console.log("444444")
      //Since this is just the account call only accountId
      if(userService.isSuperAdmin()) {
        console.log("5555555")
        getProjectList("", data.accountId)
      }else {
        console.log("66666666")
        getProjectList("NaN", userService.getAccountDetails().accountId)
      }
      
     setPageAuthorized(true);

    }

  }, []);
  
    /**
   * Function to get the list of accounts for a drop down
   */
    async function getProjectList(vendorId, accountId) {
      console.log("7777777::::vendorId::"+vendorId+"----AccountID:::"+accountId)
      // setPageAuthorized(true);
      const responseData = await accountService.getProjectList(vendorId, accountId);
      setProjectList(responseData);

    }

    function handleProjectDetailSelection(projectId){
      dispatch(setSelectedProjectId(projectId))
      router.push("/account/project/detail");
    }

  
  const navigatePage = () => router.push({ pathname: '/account/project/add', query: { vendor: isVendor, vendorId: data.vendorId }});
  

  return (

    <div>
      {isPageAuthprized ? (
        <div>

              {isVendor ? (
                <PageMainHeader heading="Vendor Projects"/>
              ) : (
                <PageMainHeader heading="Account Projects"/>
              )}

    
              <Flex marginBottom="1rem">
                <HStack>
                  <Box>
                    <Button size="xs" bgColor="header_actions"  onClick={navigatePage}>
                      {isVendor ? (
                        <>Add New Vendor Project</>
                      ) : (
                        <>Add New Project</>
                      )}
                    </Button>
                  </Box>
                </HStack>
              </Flex>
              <TableContainer display="flex">
              <Table>
              <TableCaption></TableCaption>
                <Thead>
                    <Tr bgColor="table_tile">
                      <Th>
                        Project ID
                      </Th>
                      <Th>
                        Project Name
                      </Th>
                      <Th>
                        Project Type
                      </Th>
                      <Th>
                        Project Budget
                      </Th>
                      <Th>
                        Account Name
                      </Th>
                      <Th>
                        Vendor Name
                      </Th>
                      <Th>
                        Created Date
                      </Th>
                      <Th>
                        Project Status
                      </Th>
                    </Tr>   
                  </Thead>                
                  <Tbody>
                    {projectList?.map((project) => (
                      <Tr>
                            <Th>
                            {project.id}
                            </Th>
                            <Th>
                              {project.name}
                            </Th>
                            <Th>
                              {project.type}
                            </Th>
                            <Th>
                              {project.budget}
                            </Th>
                            <Th>
                              {project.account.name}
                            </Th>
                            <Th>
                              {project.vendor ? (
                                <>{project.vendor.name}</>
                              ) : "N/A"}
                            </Th>
                            <Th>
                              {project.createdDate}
                            </Th>
                            <Th>
                              <HStack>
                                  <Button size="xs" bgColor="header_actions" onClick={() => handleProjectDetailSelection(project.id)}>
                                    Details
                                  </Button>
                                <Badge color={`${
                                    (project.status === "Created" || project.status === "Open" )
                                      ? "paid_status"
                                      : project.status === "Closed"
                                      ? "pending_status"
                                      : "pending_status"
                                  }`}>{project.status}</Badge>
                              </HStack>
                            </Th>
                          
                        </Tr>

                    ))}
                </Tbody>    
              </Table>
              </TableContainer>
          </div>
      ) : (
        <> 
         <PageNotAuthorized/>      
        </>
      ) }



      
      </div>    
  );
};

export default ProjectList;
