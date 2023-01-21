import { configurationService } from '../../../services';
import { ActionTypes } from './constants';


export const setConfigurations = (configrations) => {
    return {
        type: ActionTypes.SET_CONFIGURATIONS,
        payload: configrations
    }
}

export const getAllConfigurations = (configurations) => {
    return {
        type: ActionTypes.GET_ALL_CONFIGURATIONS,
        payload: configurations
    }
}
export const fetchAllConfigurations = (inputParam) => {
    return async (dispatch) => {
        const allConfigurations = await configurationService.getAdminAppConfigList();
        dispatch(getAllConfigurations(allConfigurations));
      };
}


export const updateConfiguration = (configuration) => {
    return {
        type: ActionTypes.UPDATE_CONFIGURATION,
        payload: configuration
    }
}