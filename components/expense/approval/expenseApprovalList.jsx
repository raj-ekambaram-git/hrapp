import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { userService } from "../../../services";

import { PageNotAuthorized } from "../../common/pageNotAuthorized";
import { useDispatch } from "react-redux";
import { fetchExpensesForApproval } from "../../../store/modules/Expense/actions";
import {PageMainHeader} from '../../common/pageMainHeader';
import ProjectExpenses from "./projectExpenses";
import { Box } from "@chakra-ui/react";

const ExpenseApprovalList = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { data } = props.userData;
  const { isManager } = props.userData;
  const { isApprovalList } = props.userData;
  const [isPageAuthprized, setPageAuthorized] = useState(false);

  useEffect(() => {

    if(isManager && isApprovalList && (userService.isManager() || userService.isAccountAdmin())) {
      //get API call with accountId and VendorId
      if(userService.isSuperAdmin()) {
        dispatch(fetchExpensesForApproval(userId, "NaN"));
      }else {
        dispatch(fetchExpensesForApproval(data.userId, userService.getAccountDetails().accountId));
      }
      setPageAuthorized(true);
    }

  }, []);
  
  return (

    <div>
      {isPageAuthprized ? (
          <Box width="page.sub_heading_width">
              {isManager ? (
                <PageMainHeader heading="Expenses to Approve"/>
              ) : (
                <PageMainHeader heading="Expenses"/>
              )}
              <ProjectExpenses/>
          </Box>
      ) : (
        <> 
        <PageNotAuthorized/>
        </>
      ) }
      </div>    
  );
};

export default ExpenseApprovalList;
