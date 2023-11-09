import {GENERICS_LIST_REQUEST,
    GENERICS_LIST_SUCCESS,
     GENERICS_LIST_FAIL
} from "../constants/genericsConstants"
import axios from 'axios';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT

export const listGenerics = () => async(dispach) => {
    try{
        dispach({type: GENERICS_LIST_REQUEST})
        const {data} = await axios.get(`${API_ENDPOINT}/api/generics`)
        dispach({
            type: GENERICS_LIST_SUCCESS,
            payload: data
        })
    }catch(error){
        dispach({
            type: GENERICS_LIST_FAIL,
            payload:error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
        })
    }

} 