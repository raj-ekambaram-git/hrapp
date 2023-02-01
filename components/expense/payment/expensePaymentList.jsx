import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { userService } from "../../../services";

import { PageNotAuthorized } from "../../common/pageNotAuthorized";
import { useDispatch } from "react-redux";
import { fetchExpensesForPayment } from "../../../store/modules/Expense/actions";
import {PageMainHeader} from '../../common/pageMainHeader';
import ProjectExpensesPayment from "./projectExpensesPayment";
import { Box } from "@chakra-ui/react";

const ExpensePaymentList = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { data } = props.userData;
  const { isManager } = props.userData;
  const { isPaymentList } = props.userData;
  const [isPageAuthprized, setPageAuthorized] = useState(false);

  useEffect(() => {

    if(isManager && isPaymentList && (userService.isManager() || userService.isAccountAdmin())) {
      //get API call with accountId and VendorId
      if(userService.isSuperAdmin()) {
        dispatch(fetchExpensesForPayment(userId, "NaN"));
      }else {
        dispatch(fetchExpensesForPayment(data.userId, userService.getAccountDetails().accountId));
      }
      setPageAuthorized(true);
    }

  }, []);
  
  return (

    <div>
      {isPageAuthprized ? (
          <Box width="page.sub_heading_width">
              {isManager ? (
                <PageMainHeader heading="Expenses to Pay"/>
              ) : (
                <PageMainHeader heading="Expenses"/>
              )}
              <ProjectExpensesPayment/>
          </Box>
      ) : (
        <> 
        <PageNotAuthorized/>
        </>
      ) }
      </div>    
  );
};

export default ExpensePaymentList;
