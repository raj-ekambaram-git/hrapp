import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
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
  Heading,
  TableContainer,
  TableCaption,
  Badge
} from '@chakra-ui/react'
import {PageMainHeader} from '../../components/common/pageMainHeader'

const ProjectList = (props) => {
  const router = useRouter();
  const { data } = props.projectList;
  const { isVendor } = props.projectList;
  console.log("ProjectList::"+JSON.stringify(data))
  console.log("ProjectList:   isVendor:"+JSON.stringify(isVendor))
  const [projectList, setProjectList] = useState([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);

  useEffect(() => {

    if(isVendor) {
      console.log("111111")
      //get API call with accountId and VendorId
      if(userService.isSuperAdmin()) {
        console.log("2222222")
        getProjectList(data.vendorId, "NaN")
      }else {
        console.log("333333")
        getProjectList(data.vendorId, userService.getAccountDetails().accountId)
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

    
              <Flex marginBottom="2rem">
                <HStack>
                  <Box>
                    <Button onClick={navigatePage}>
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
                                <Link href={`/account/project/${project.id}/detail`} passref key={project.id}>
                                  <Button>
                                    Details
                                  </Button>
                                </Link>
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
