import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { userService } from "../../services";
import {
  HStack,
  Box,
  Flex,
} from '@chakra-ui/react'
import { PageMainHeader } from "../common/pageMainHeader";
import { useDispatch, useSelector } from "react-redux";
import {fetchAllConfigurations} from "../../store/modules/Configuration/actions"
import { ConfigConstants, EMPTY_STRING } from "../../constants";
import { CustomTable } from "../customTable/Table";
import { util } from "../../helpers";
import AddEditConfigAdmin from "./addEditConfigAdmin";


const ConfigAdminList = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const ADMIN_APP_CONFIG_LIST_TABLE_COLUMNS = React.useMemo(() => ConfigConstants.CONFOG_APP_ADMIN_LIST_TABLE_META)
  // const [appConfigAdminList, setAppConfigAdminList] = useState([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const appConfigAdminList = useSelector(state => state.configuration.allConfigurations);

  useEffect(() => {
    if(userService.isSuperAdmin() ) {
      setPageAuthorized(true);
      dispatch(fetchAllConfigurations());
    }

  }, []);
  
  return (


    <div>
      {isPageAuthprized ? (
        <div>
              <PageMainHeader heading="Admin Configuraitons"/>    
              <Flex marginBottom="1rem">
                <HStack>
                  <Box>
                    <AddEditConfigAdmin/>
                  </Box>
                </HStack>
              </Flex>
              <CustomTable columns={ADMIN_APP_CONFIG_LIST_TABLE_COLUMNS} rows={appConfigAdminList} />
          </div>
      ) : (
        <> 
        </>
      ) }



      
      </div>

  );
};

export default ConfigAdminList;
