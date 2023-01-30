import { userService } from '../../../services';
import { ActionTypes } from './constants';


export const getAllAccountCost = (costs) => {
    return {
        type: ActionTypes.GET_ALL_ACCOUNT_COSTS,
        payload: costs
    }
}
export const fetchAllProjectExpenses = (inputParam) => {
    return async (dispatch) => {
        const allAccountCosts = await userService.getAllAccountCosts(inputParam);
        dispatch(getAllAccountCost(allAccountCosts));
      };
}
