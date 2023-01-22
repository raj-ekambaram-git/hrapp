import { configurationService } from '../../../services';
import { ActionTypes } from './constants';


export const setSelectedReportsProjectId = (selectedReportsProjectId) => {
    return {
        type: ActionTypes.SET_SELECTED_REPORTS_PROJECT_ID,
        payload: selectedReportsProjectId
    }
}