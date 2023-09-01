import {GENERICS_LIST_REQUEST,
    GENERICS_LIST_SUCCESS,
    GENERICS_LIST_FAIL
} from "../constants/genericsConstants"


export const genericsListReducer = (state = {generics : []}, action) => {
    switch (action.type){
        case 'GENERICS_LIST_REQUEST':
            return{loading: true, generics: []}
        
        case 'GENERICS_LIST_SUCCESS':
            return{loading: false, generics: action.payload}

        case 'GENERICS_LIST_FAIL':
            return{loading: false, error: action.payload}
        
        default:
            return state
}
}