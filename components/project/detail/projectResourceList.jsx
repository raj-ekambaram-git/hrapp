import React, { useEffect, useState } from "react";
import {
  TableContainer,
  AccordionItem,
  AccordionButton,
  Box,
  Heading,
  AccordionIcon,
  AccordionPanel,
  Badge,
  useToast
} from '@chakra-ui/react';
import {
  DeleteIcon
} from '@chakra-ui/icons';
import AddProjectResource from "../addProjectResourceSection";
import {MODE_EDIT} from "../../../constants/accountConstants";
import { projectService } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { removeProjectResourceByIndex, setSelectedProjectRemainingBudget, setSelectedProjectResources } from "../../../store/modules/Project/actions";
import SortTable from "../../common/SortTable";
import { ProjectConstants } from "../../../constants";




const ProjectResourceList = (props) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [projectResourceListTable, setProjectResourceListTable] = useState([]);
  const PROJECT_RESOURCE_TABLE_COLUMNS = React.useMemo(() => ProjectConstants.PROJECT_RESOURCE_TABLE_FIELDS)
  const projectResourceList = useSelector(state => state.project.projectResources);

  useEffect(() => {
    refreshProjectListforTableDisplay();
  })

  function refreshProjectListforTableDisplay() {
     const tempprojectResourceList =  [...projectResourceList].map((projectResource, index)=> {
        projectResource.editAction = <AddProjectResource data={{projectResource: projectResource, mode: MODE_EDIT}}/>
        projectResource.deleteAction = <DeleteIcon boxSize={4} onClick={() => deleteProjectResource(projectResource.id,projectResource.budgetAllocated, projectResource.billable, index)}/>;
        if(projectResource.billable) {
          projectResource.type = <Badge color="paid_status">Billable</Badge>;
        }else {
          projectResource.type = <Badge color="pending_status">Non Billable</Badge>;
        }
        projectResource.userName = projectResource?.user?.firstName+" "+projectResource?.user?.lastName;
        projectResource.budgetAllocatedWithDollar = "$ "+projectResource.budgetAllocated
        return projectResource;
      });
      setProjectResourceListTable(projectResourceList);
      
  }

  async function deleteProjectResource(projectResourceId, projectResourceAllocatedBudget, billable, selectIndex) {
    const projectResourceDeleteResponse = await projectService.deleteProjectResource(projectResourceId,projectResourceAllocatedBudget, billable);
    if(projectResourceDeleteResponse != undefined && !projectResourceDeleteResponse.error) {

      dispatch(removeProjectResourceByIndex(selectIndex))
      if(billable) {
        dispatch(setSelectedProjectRemainingBudget(projectResourceDeleteResponse.remaininBudgetToUpdate))
      }
      
      toast({
        title: 'Project Resource.',
        description: 'Successfully deleted project resource.',
        status: 'success',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })  

    }else {
      toast({
        title: 'Project Resource.',
        description: 'Error deleting project resource. Please try again or contact administrator.',
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })  
    }
  
  }

  return (

    <div>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex='1' textAlign='left'>
                <Heading size='xs'>
                  Project Allocation 
                </Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel>
              <AddProjectResource/>
              {projectResourceListTable.length > 0 ? (<>
                <TableContainer>
                  <SortTable variant="sortTable" columns={PROJECT_RESOURCE_TABLE_COLUMNS} data={projectResourceListTable} />
                </TableContainer>
              </>) : (<></>)}
          </AccordionPanel>
        </AccordionItem>   

    </div>


  );
};

export default ProjectResourceList;
