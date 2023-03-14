import { ActionTypes } from "./constants";



const initialState = {
    accountCosts: [],
    costItemList: [],
    costTotal: null,
    selectedCostTSEId: [],
};

const costReducer = (state = initialState, {type, payload}) => {
    const newState = {...state}; 

    if (type === ActionTypes.GET_ALL_ACCOUNT_COSTS) {
        if(!payload.error) {
            newState.accountCosts = payload;
        }
    } else if(type === ActionTypes.REMOVE_TS_COST_ITEM) {
        
        const newCostList = [...newState.costItemList];
        const timesheetEntryToRemoveIndex = newCostList.findIndex(x => parseInt(x.notes.split("_")[0]) === parseInt(payload));
        newCostList.splice(timesheetEntryToRemoveIndex, 1);
        newState.costItemList = newCostList;

    } else if(type === ActionTypes.SET_COST_TOTAL) {
        newState.costTotal = parseFloat(payload);
    } else if(type === ActionTypes.SET_COST_ITEM_LIST) {
        const newCostItemList = [...newState.costItemList]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.costItemList = payload;
        }else {
            //Add New Condtion or udpate
            newCostItemList.push(payload);
            newState.costItemList = newCostItemList;
        }        
    } else if(type === ActionTypes.UPDATE_COST_ITEM_LIST_BY_TIMESHEET_ENTRY_ID) {
        const newCostItemList = [...newState.costItemList]
        const timesheetEntryToUpdateIndex = newCostItemList.findIndex(x =>parseInt(x.notes.split("_")[0]) === parseInt(payload.notes.split("_")[0]));
        newCostItemList[timesheetEntryToUpdateIndex] = payload;
        newState.costItemList = newCostItemList;         
    } else if(type === ActionTypes.SET_SELECTED_COST_TSE_ITEMS) {
        const newSelectedCostTSEId = [...newState.selectedCostTSEId]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.selectedCostTSEId = payload;
        }else {
            //Add New Condtion or udpate
            newSelectedCostTSEId.push(payload);
            newState.selectedCostTSEId = newSelectedCostTSEId;
        }
    } else if( type === ActionTypes.REMOVE_SELECTED_COST_TSE_ITEMS) {
        const newSelectedCostTSEId = [...newState.selectedCostTSEId]
        const teseToRemoveIndex = newSelectedCostTSEId.findIndex(x => x === parseInt(payload));
        newSelectedCostTSEId.splice(teseToRemoveIndex, 1);
        newState.selectedCostTSEId = newSelectedCostTSEId;
    } else if( type === ActionTypes.REMOVE_ITEM_COST_ITEM_LIST) {
        const newCostList = [...newState.costItemList]
        newCostList.splice(payload, 1);
        newState.costItemList = newCostList;
    }

    return newState;
};

export default costReducer;