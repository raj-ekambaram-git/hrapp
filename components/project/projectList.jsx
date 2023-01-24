import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { accountService, userService } from "../../services";
import { PageNotAuthorized } from "../../components/common/pageNotAuthorized";
import {
  HStack,
  Button,
  Box,
  Flex,
  Badge
} from '@chakra-ui/react'
import {PageMainHeader} from '../../components/common/pageMainHeader'
import { useDispatch, useSelector } from "react-redux";
import { setSelectedProjectId } from "../../store/modules/Project/actions";
import { EMPTY_STRING, ProjectConstants } from "../../constants";
import { CustomTable } from "../customTable/Table";
import { util } from "../../helpers";


const ProjectList = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data } = props.projectList;
  const { isVendor } = props.projectList;
  const [projectList, setProjectList] = useState([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const accountId = useSelector(state => state.account.selectedAccountId);

  const PROJECT_LIST_TABLE_COLUMNS = React.useMemo(() => ProjectConstants.PROJECT_LIST_TABLE_META)

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
      //Since this is just the account call only accountId
      if(userService.isSuperAdmin()) {
        getProjectList("", data.accountId)
      }else {
        getProjectList("NaN", userService.getAccountDetails().accountId)
      }
      
     setPageAuthorized(true);

    }

  }, []);
  
    /**
   * Function to get the list of accounts for a drop down
   */
    async function getProjectList(vendorId, accountId) {
      if(accountId === undefined || accountId === EMPTY_STRING || accountId === null) {
        accountId = userService.getAccountDetails().accountId
      }
      console.log("7777777::::vendorId::"+vendorId+"----AccountID:::"+accountId)
      // setPageAuthorized(true);
      const responseData = await accountService.getProjectList(vendorId, accountId);

      if(responseData != undefined && responseData != EMPTY_STRING) {
        const updatedProjectList =  responseData.map((project, index)=> {
          project.detailAction = <Button size="xs" bgColor="header_actions" onClick={() => handleProjectDetailSelection(project.id)}>Details</Button>
          project.vendorName = project.vendor?.name?project.vendor?.name:"N/A"
          project.accountName = project.account?.name?project.account?.name:"N/A"
          project.createdDate = util.getFormattedDate(project.createdDate)
          return project;
        });
        setProjectList(updatedProjectList);
      }
      

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
                <CustomTable variant="sortTable" columns={PROJECT_LIST_TABLE_COLUMNS} rows={projectList} />
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
