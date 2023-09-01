import {LIPID_DICT_REQUEST,
    LIPID_DICT_SUCCESS,
    LIPID_DICT_FAIL
} from "../constants/lipidConstants"


export const lipidDictReducer = (state = {lipid : []}, action) => {
    switch (action.type){
        case 'LIPID_DICT_REQUEST':
            return{loading: true, lipid: []}
        
        case 'LIPID_DICT_SUCCESS':
            return{loading: false, lipid: action.payload}

        case 'LIPID_DICT_FAIL':
            return{loading: false, error: action.payload}
        
        default:
            return state
}
}