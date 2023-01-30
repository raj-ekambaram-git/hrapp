import React from "react";
import CostList from "../../../../components/cost/costList";
import { userService } from "../../../../services";




export default function Cost(props) {

  // const userId = useSelector(state => state.user.loggedInUser?.id);
  const userId = userService?.userValue?.id;

  const data = {
    action: "userCostList",
    userId: userId
  }
  return (
    <CostList userData={{ data: data, isManager: true, isCostList: true }} /> 
  );
}
