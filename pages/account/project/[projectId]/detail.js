import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { accountService, userService } from '../../../../services';
import {MODE_ADD} from "../../../../constants/accountConstants";
import Link from "next/link";
import {
  Card,
  CardHeader,
  Box,
  Heading,
  CardBody,
  Stack,
  Text,
  StackDivider,
  Badge,
  Flex,
  HStack,
  Button,
  Modal,
  ModalOverlay,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  TableContainer,
  TableCaption

} from '@chakra-ui/react'
import AddProjectResourceModal from "../../../../components/project/AddProjectResourceModal";


const ProjectDetail = (props) => {
  const projectId = props.data.projectId;

  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  
  const [project, setProject] = useState({});
  const [projectLocation, setProjectLocation] = useState({});
  const [projectAccountName, setProjectAccountName] = useState('');
  const [projectVendorName, setProjectVendorName] = useState('');
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const [projectResourceList, setProjectResourceList] = useState([]);
  const [addProjectResourceRequest, setAddProjectResourceRequest] = useState({});
  

  const navigateProjectEditPage = () => router.push("/account/project/"+project.id);
  const navigateProjectInvoicesPage = () => router.push("/account/project/"+project.id+"/invoices");
  


  // set default input data
  useEffect(() => {
    getProjetDetails(projectId, userService.getAccountDetails().accountId);
  }, []);

  const handleAddProjectResource = (e) => {
    console.log("handleAddProjectResource::::::"+JSON.stringify(projectResourceList));
    projectResourceList.push(e);
    setProjectResourceList(projectResourceList);
    console.log("handleAddProjectResource After Pushing::::::"+JSON.stringify(projectResourceList));
  };
 
  /**
   * Function to get the list of accounts for a drop down
   */
  async function getProjetDetails(projectId, accountId) {
    setPageAuthorized(true);

    let accoutIdToPas;
    if(userService.isSuperAdmin()) {
      accoutIdToPas = "NaN";
    }else {
      accoutIdToPas = accountId;
    }

    console.log("332322322 ::"+projectId+":::accoutIdToPas"+accoutIdToPas)
    
    const responseData = await accountService.getProjectDetail(projectId, accoutIdToPas);

    console.log("responseData::::"+JSON.stringify(responseData))
    const projectData =  {
      id: responseData.id.toString(),
      name: responseData.name,
      description: responseData.description,
      referenceCode: responseData.referenceCode,
      type: responseData.type,
      invoiceCycle: responseData.invoiceCycle,
      addressId: responseData.addressId,
      vendorId: responseData.vendorId,
      accountId: responseData.accountId,
      // projectResource: [],
      // invoice: [],
      budget: responseData.budget,
      totalHours: responseData.totalHours,
      averageRate: responseData.averageRate,
      status: responseData.status
   };

    const projectLocation =  {
      addressName: responseData.address.addressName,
      address1: responseData.address.address1,
      address2: responseData.address.address2,
      address3: responseData.address.address3,
      city: responseData.address.city,
      state: responseData.address.state,
      zipCode: responseData.address.zipCode,
      country: responseData.address.country,

    };

    const addProjectResourceRequestData = {
      mode: MODE_ADD,
      projectId: projectId,
      vendorId: responseData.vendorId,
      onClose: onClose,
      handleAddProjectResource: handleAddProjectResource
    }
    setAddProjectResourceRequest(addProjectResourceRequestData);
    setProjectLocation(projectLocation);
    setProjectAccountName(responseData.account.name)
    setProjectVendorName(responseData.vendor.name)
    setProjectResourceList(responseData.projectResource);


    console.log("project Resource list::"+JSON.stringify(projectResourceList))
    setProject(projectData)

    
  }

  return (

    <div>
      {isPageAuthprized ? (
        <>
          <Card>
            <CardHeader bgColor="heading">
              <HStack spacing="50rem">
                <Box>
                  <Heading size='md'>Project Details for {project.name}</Heading>
                </Box>
              </HStack>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing='1'>
                <Accordion>
                  <AccordionItem marginBottom="1rem" border="1px" width="60%">
                    <h2>
                      <AccordionButton bgColor="table_tile">
                        <Box as="span" flex='1' textAlign='left'>
                          <Heading size='xs' textTransform='uppercase'>
                            Project Details
                          </Heading>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                    <Text pt='2' fontSize='sm'>
                        Project ID: {project.id}
                      </Text>             
                      <Text pt='2' fontSize='sm'>
                        Project Name: {project.name}
                      </Text>                
                      <Text pt='2' fontSize='sm'>
                        Project Description: {project.description}
                      </Text>    
                      <Text pt='2' fontSize='sm'>
                        Project Type: {project.type}
                      </Text>                                       
                      <Text pt='2' fontSize='sm'>
                        Invoice Cycle: {project.invoiceCycle}
                      </Text>                                       
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem marginBottom="1rem" border="1px" width="60%">
                      <h2>
                        <AccordionButton bgColor="table_tile">
                          <Box as="span" flex='1' textAlign='left'>
                            <Heading size='xs' textTransform='uppercase'>
                              Project Account/Vendor Details
                            </Heading>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                    <AccordionPanel pb={4}>
                      <Text pt='2' fontSize='sm'>
                        Account Name: {projectAccountName}
                      </Text>
                      <Text pt='2' fontSize='sm'>
                        Vendor Name: {projectVendorName}
                      </Text>
                    </AccordionPanel>
                  </AccordionItem>                          
                  <AccordionItem marginBottom="1rem" border="1px" width="60%">
                    <h2>
                      <AccordionButton bgColor="table_tile">
                        <Box as="span" flex='1' textAlign='left'>
                          <Heading size='xs' textTransform='uppercase'>
                            Project Contact
                          </Heading>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Text pt='2' fontSize='sm'>
                        Contact Name: {project.contactName}
                      </Text>
                      <Text pt='2' fontSize='sm'>
                        Contact Email: {project.contactEmail}
                      </Text>
                      <Text pt='2' fontSize='sm'>
                        Contact Phone: {project.contactPhone}
                      </Text>                     
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem marginBottom="1rem" border="1px" width="60%">
                    <h2>
                      <AccordionButton bgColor="table_tile">
                        <Box as="span" flex='1' textAlign='left'>
                          <Heading size='xs' textTransform='uppercase'>
                            Project Location
                          </Heading>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Text pt='2' fontSize='sm'>
                        {projectLocation.addressName}
                      </Text>
                      <Text pt='2' fontSize='sm'>
                        {projectLocation.address1}
                      </Text>
                      <Text pt='2' fontSize='sm'>
                        {projectLocation.address2}
                      </Text>
                      <Text pt='2' fontSize='sm'>
                        {projectLocation.address3}
                      </Text>
                      <Text pt='2' fontSize='sm'>
                        {projectLocation.city}, {projectLocation.state} {projectLocation.zipCode} 
                      </Text>
                      <Text pt='2' fontSize='sm'>
                        {projectLocation.country}
                      </Text>                      
                     </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem marginBottom="1rem" border="1px" width="60%">
                    <h2>
                      <AccordionButton bgColor="table_tile">
                        <Box as="span" flex='1' textAlign='left'>
                          <Heading size='xs' textTransform='uppercase'>
                            Project Resource
                          </Heading>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Text pt='2' fontSize='sm'>
                        <Button className="btn" onClick={onOpen}>Add New Project Resource</Button>
                        <Modal isOpen={isOpen} onClose={onClose} size="xl">
                          <ModalOverlay/>
                          <AddProjectResourceModal data={addProjectResourceRequest}></AddProjectResourceModal>
                        </Modal>  
                        <TableContainer marginTop="1rem">
                          <Table>
                          <TableCaption></TableCaption>
                            <Thead>
                                <Tr bgColor="table_tile">
                                  <Th>
                                    Resource
                                  </Th>
                                  <Th>
                                    Type
                                  </Th>      
                                  <Th>
                                    Timesheet Approver
                                  </Th>                                                                
                                  <Th>
                                    Price
                                  </Th>
                                  <Th>
                                    Currency
                                  </Th>
                                  <Th>
                                    Quantity
                                  </Th>
                                  <Th>
                                    Quantity
                                  </Th> 
                                  <Th>
                                    Max Budget Allocated
                                  </Th>
                                </Tr>   
                              </Thead>                
                              <Tbody>
                                
                                {projectResourceList?.map((projectResourceList) => (
                                  <Tr>
                                        <Th>
                                          {projectResourceList.userId}
                                        </Th>
                                        <Th>
                                          {projectResourceList.billable ? "Billable" : "Non Billable"}
                                        </Th>
                                        <Th>
                                          {projectResourceList.isTimesheetApprover ? "Approver" : ""}
                                        </Th> 
                                        <Th>
                                          {projectResourceList.unitPrice}
                                        </Th>
                                        <Th>
                                          {projectResourceList.currency}
                                        </Th>                              
                                        <Th>
                                          {projectResourceList.quantity}
                                        </Th>
                                        <Th>
                                          {projectResourceList.uom}
                                        </Th>                               
                                        <Th>
                                          {projectResourceList.budgetAllocated}
                                        </Th>
                                  </Tr>
                                ))}
                            </Tbody>    
                          </Table>
                        </TableContainer>     
                      </Text>  
                    </AccordionPanel>
                  </AccordionItem>   
                </Accordion>                
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    Project Status
                  </Heading>
                  <Badge color={`${
                        (project.status === "Created" || project.status === "Open")
                          ? "paid_status"
                          : project.status === "Closed"
                          ? "pending_status"
                          : "pending_status"
                      }`}>{project.status}
                  </Badge>              
                </Box>                
              </Stack>
            </CardBody>
          </Card>             

          <Flex marginTop="2rem">
                <HStack spacing={2}>
                  <Box>
                    <Button className="btn" onClick={navigateProjectEditPage}>
                      Edit
                    </Button>
                  </Box>
                  <Box>
                    <Button className="btn" onClick={navigateProjectInvoicesPage}>
                      Invoices
                    </Button>
                  </Box>   
                                                 
                </HStack>
              </Flex>          
        </>
      ) : (
        <div className="account__header">
          <div className="iaccount_header-logo">
            <h3>Not Authorized to view this page. Please contact administrator.</h3>
          </div>
        </div>

      )}
    </div>    
  );
};

export default ProjectDetail;



export async function getStaticPaths() {

  return {
    paths: [{ params: { projectId: "1" } }],
    fallback: true,
  };

} 

export async function getStaticProps(context) {
  const { projectId } = context.params;

  return {
    props: {
      data: {
        projectId: projectId
      }
    },
    revalidate: 1,
  };

}
