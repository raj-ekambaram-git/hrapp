import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { accountService, userService } from '../../../../services';
import {MODE_ADD} from "../../../../constants/accountConstants";
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
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import ProjectResourceList from "../../../../components/project/projectResourceList";
import ProjectDetailSection from "../../../../components/project/projectDetailSection";
import ProjectAccountSection from "../../../../components/project/projectAccountSection";
import ProjectContactDetailSection from "../../../../components/project/projectContactDetailSection";
import ProjectLocationSection from "../../../../components/project/projectLocationSection";


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

    console.log("responseData: ProjectDetail:::"+JSON.stringify(responseData))
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
      status: responseData.status,
      contactName: responseData.contactName,
      contactEmail: responseData.contactEmail,
      contactPhone: responseData.contactPhone
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
                        <ProjectDetailSection data={{project}}/>
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
                      <ProjectAccountSection data={{projectAccountName: projectAccountName, projectVendorName: projectVendorName}}/>
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
                      
                      <ProjectContactDetailSection data={{project}}/>
                                     
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
                      <ProjectLocationSection data={{projectLocation}}/>
                      {/* <Text pt='2' fontSize='sm'>
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
                      </Text>                       */}
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
                        <ProjectResourceList data={{projectResourceList: projectResourceList, addProjectResourceRequest: addProjectResourceRequest}}/>
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
