import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { accountService, userService } from '../../../services';
import {MODE_ADD, MODE_EDIT, PROJECT_CALL_TYPE} from "../../../constants/accountConstants";
import {
  Box,
  Stack,
  Flex,
  HStack,
  Button,
  useDisclosure,
  Accordion
} from '@chakra-ui/react'
import ProjectResourceList from "../../../components/project/detail/projectResourceList";
import ProjectDetailSection from "../../../components/project/detail/projectDetailSection";
import ProjectAccountSection from "../../../components/project/detail/projectAccountSection";
import ProjectContactDetailSection from "../../../components/project/detail/projectContactDetailSection";
import ProjectLocationSection from "../../../components/project/detail/projectLocationSection";
import ProjectFinancialSection from "../../../components/project/detail/projectFinancialSection";
import ProjectStatusSection from "../../../components/project/detail/projectStatusSection";
import ProjectTimesheets from "../../../components/project/detail/projectTimesheets";
import {PageMainHeader} from '../../../components/common/pageMainHeader';
import { NotesConstants } from "../../../constants";
import { useDispatch, useSelector } from "react-redux";


const ProjectDetail = (props) => {
  
  const dispatch = useDispatch();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure()

  const projectId = useSelector(state => state.project.selectedProjectId);
  
  const [project, setProject] = useState({});
  const [projectLocation, setProjectLocation] = useState({});
  const [projectAccountName, setProjectAccountName] = useState('');
  const [projectVendorName, setProjectVendorName] = useState('');
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const [projectResourceList, setProjectResourceList] = useState([]);
  const [addProjectResourceRequest, setAddProjectResourceRequest] = useState({});
  const [editProjectResourceRequest, setEditProjectResourceRequest] = useState({});
  


  //To Enable Notes
  const notesData = {
    type: NotesConstants.NOTES_TYPE.Project,
    typeId: parseInt(projectId),
    typeName: project.name
  }

  // set default input data
  useEffect(() => {
    getProjetDetails(projectId, userService.getAccountDetails().accountId);
  }, []);


  const handleAddProjectResource = (e, vendorId, remainingBudget) => {
    console.log("handleAddProjectResource::::::"+JSON.stringify(e));
    console.log("remainingBudget::::::"+remainingBudget);
    setProjectResourceList(e);
    setProject(e[0].project);
    const addProjectResourceRequestData = {
      mode: MODE_ADD,
      projectId: projectId,
      vendorId: vendorId,
      remainingBudget: remainingBudget,
      onClose: onClose,
      handleAddProjectResource: handleAddProjectResource
    }
    setAddProjectResourceRequest(addProjectResourceRequestData)
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
      remainingBudgetToAllocate: responseData.remainingBudgetToAllocate,
      usedBudget: responseData.usedBudget,
      paymentTerms: responseData.paymentTerms,
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

    let alreadyConsumedBudget = 0;
    for (const projectRsrc of responseData.projectResource) {
      alreadyConsumedBudget = parseFloat(alreadyConsumedBudget) + parseFloat(projectRsrc.budgetAllocated);
      console.log("projectRsrc.allocted::"+projectRsrc.budgetAllocated);
    }

    console.log("Consumed Budget:::"+alreadyConsumedBudget);

    const addProjectResourceRequestData = {
      mode: MODE_ADD,
      projectId: projectId,
      vendorId: responseData.vendorId,
      remainingBudget: parseFloat(responseData.budget)-alreadyConsumedBudget,
      onClose: onClose,
      handleAddProjectResource: handleAddProjectResource
    }
    setAddProjectResourceRequest(addProjectResourceRequestData);

    const editProjectResourceRequestData = {
      mode: MODE_EDIT,
      projectId: projectId,
      vendorId: responseData.vendorId,
      remainingBudget: parseFloat(responseData.budget)-alreadyConsumedBudget,
      onClose: onClose,
      handleAddProjectResource: handleAddProjectResource
    }
    setEditProjectResourceRequest(editProjectResourceRequestData);

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

          <PageMainHeader heading="Project Details for" param1={project.name} notesData={notesData}/>
          <Flex>
              <Stack width="page.sub_heading_width">
                {/* <Accordion marginBottom="1rem" border="1px" width="60%"> */}

                <Accordion variant="mainPage">
                  <ProjectDetailSection data={{project}}/>
                  <ProjectAccountSection data={{projectAccountName: projectAccountName, projectVendorName: projectVendorName}}/>
                  <ProjectContactDetailSection data={{project}}/>
                  <ProjectLocationSection data={{projectLocation}}/>
                  <ProjectFinancialSection data={{project}}/>
                  <ProjectResourceList data={{projectResourceList: projectResourceList, addProjectResourceRequest: addProjectResourceRequest, editProjectResourceRequest: editProjectResourceRequest}}/>
                </Accordion>                
                <ProjectStatusSection data={{project}}/>
              </Stack>
          </Flex>
          <Flex marginTop="2rem">
                <HStack spacing={2}>
                  <Box>
                    <Button onClick={() => router.push("/account/project/edit")}>
                      Edit
                    </Button>
                  </Box>
                  <Box>
                    <Button onClick={() => router.push("/account/project/invoices")}>
                      Invoices
                    </Button>
                  </Box>   
                  <Box>
                  <ProjectTimesheets data={{projectId: projectId, callType: PROJECT_CALL_TYPE}}/>
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
