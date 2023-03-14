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

export const removeTSFromCostItems = (timesheetEntryId) => {
    return {
        type: ActionTypes.REMOVE_TS_COST_ITEM,
        payload: timesheetEntryId
    }
}

export const setCostTotal = (costTotal) => {
    return {
        type: ActionTypes.SET_COST_TOTAL,
        payload: costTotal
    }
}


export const setCostItemList = (costItemList) => {
    return {
        type: ActionTypes.SET_COST_ITEM_LIST,
        payload: costItemList
    }
}

export const setSelectedCostTSEId = (selectedCostTSEId) => {
    return {
        type: ActionTypes.SET_SELECTED_COST_TSE_ITEMS,
        payload: selectedCostTSEId
    }
}

export const removeTSFromSelectedCost = (tseId) => {
    return {
        type: ActionTypes.REMOVE_SELECTED_COST_TSE_ITEMS,
        payload: tseId
    }
}

export const removeItemFromCostItemList = (removeIndex) => {
    return {
        type: ActionTypes.REMOVE_ITEM_COST_ITEM_LIST,
        payload: removeIndex
    }
}


export const updateCostItemListByTimesheetEntryId = (costItemList) => {
    return {
        type: ActionTypes.UPDATE_COST_ITEM_LIST_BY_TIMESHEET_ENTRY_ID,
        payload: costItemList
    }
}