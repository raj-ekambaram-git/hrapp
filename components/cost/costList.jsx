import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { userService } from "../../services";

import { useDispatch } from "react-redux";
import {PageMainHeader} from '../../components/common/pageMainHeader';
import { PageNotAuthorized } from "../common/pageNotAuthorized";
import { AccountConstants } from "../../constants";
import { Box, Button, Flex, HStack } from "@chakra-ui/react";
import { CustomTable } from "../customTable/Table";


const CostList = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { data } = props.userData;
  const { isManager } = props.userData;
  const { isCostList } = props.userData;
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const [costList, setCostList] = useState([]);
  const COST_LIST_TABLE_COLUMNS = React.useMemo(() => AccountConstants.COST_LIST_TABLE_META)

  useEffect(() => {

    if(isManager && isCostList && (userService.isManager() || userService.isAccountAdmin())) {
      //get API call with accountId and VendorId
      if(userService.isSuperAdmin()) {
        getCostList(userId, "NaN");
      }else {
        getCostList(data.userId, userService.getAccountDetails().accountId);
      }
      setPageAuthorized(true);
    }

  }, []);
  
  async function getCostList(userId, accountId) {

    const respponseData = await userService.getAllAccountCosts(userId, accountId);
    console.log("respponseData:::"+JSON.stringify(respponseData))

  }
  
  
  return (

    <>
      {isPageAuthprized ? (
          <>
              <PageMainHeader heading="Manage Account Cost"/>
              <Flex marginBottom="1rem">
                <HStack>
                  <Box>
                    <Button size="xs" bgColor="header_actions">
                      Add New
                    </Button>
                  </Box>
                </HStack>
              </Flex>
              <CustomTable columns={COST_LIST_TABLE_COLUMNS} rows={costList} />
          </>
      ) : (
        <> 
        <PageNotAuthorized/>
        </>
      ) }
      </>    
  );
};

export default CostList;
