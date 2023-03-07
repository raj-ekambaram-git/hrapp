import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { userService } from "../../services";

import { useDispatch } from "react-redux";
import {PageMainHeader} from '../../components/common/pageMainHeader';
import { PageNotAuthorized } from "../common/pageNotAuthorized";
import { AccountConstants } from "../../constants";
import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import { CustomTable } from "../customTable/Table";
import { ExpenseStatus } from "@prisma/client";
import { DeleteIcon } from "@chakra-ui/icons";
import { util } from "../../helpers";
import CostPayment from "./costPayment";
import ExpenseEntryPayment from "../expense/payment/expenseEntryPayment";


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
    setCostList(updateCostsForDisplay(respponseData))

  }
  
  
  function updateCostsForDisplay(responseData) {
    return responseData.map((cost)=> {
      cost.deleteAction = <><HStack spacing={6}>{(cost.status === ExpenseStatus.Saved)?(<DeleteIcon color="red" size="xs" onClick={() => handleCostDeleteSelection(cost.id)}/>):(<Box marginRight={3}></Box>)}<Box>{cost.id}</Box></HStack></>
      cost.detailAction = <CostPayment isAddMode={false} costId={cost.id} costData={cost}/>      
      // invoice.status = <Badge color={`${(invoice.status === "Paid" || invoice.status === "PartiallyPaid") ? "paid_status": invoice.status === "Pending" ? "pending_status": "pending_status"}`}>{invoice.status}</Badge>
      cost.amount = "$ "+(parseFloat(cost.total))
      cost.balance = <Text color={(parseFloat(cost.total)-util.getZeroPriceForNull(cost.paidAmount))>0?"credit_amount":"debit_amount"}>{util.getWithCurrency((parseFloat(cost.total)-util.getZeroPriceForNull(cost.paidAmount)))}</Text>
      cost.paidAmount = "$ "+(util.getZeroPriceForNull(cost.paidAmount))
      cost.createdDate = util.getFormattedDate(cost.createdDate)
      cost.lastUpdateDate = util.getFormattedDate(cost.lastUpdateDate)
      cost.vendorName = cost.project?.vendor?.name
      cost.projectName = cost.project?.name
      cost.resource = cost.user?.firstName+" "+cost.user?.lastName
      cost.payAction = <ExpenseEntryPayment expense={cost} isCost={true}/>
      return cost;
    });
    // setInvoiceList(updatedInvoiceList)
  }

  const handleCostDeleteSelection = () => {

  }

  const handleCostDetailSelection = () => {

  }

  return (

    <>
      {isPageAuthprized ? (
          <>
              <PageMainHeader heading="Manage Account Cost"/>
              <Flex marginBottom="1rem">
                <HStack>
                  <Box>
                    <CostPayment isAddMode={true}/>
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
