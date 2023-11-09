import {LIPID_DICT_REQUEST,
    LIPID_DICT_SUCCESS,
    LIPID_DICT_FAIL
} from "../constants/lipidConstants"
import axios from 'axios';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT

export const dictLipid = (id) => async(dispach) => {
    try{
        dispach({type: LIPID_DICT_REQUEST})
        const {data} = await axios.get(`${API_ENDPOINT}/api/lipid/L_ID/${id}`)
        dispach({
            type: LIPID_DICT_SUCCESS,
            payload: data
        })
    }catch(error){
        dispach({
            type: LIPID_DICT_FAIL,
            payload:error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
        })
    }

} 