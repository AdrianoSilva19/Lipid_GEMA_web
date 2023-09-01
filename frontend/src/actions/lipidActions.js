import {LIPID_DICT_REQUEST,
    LIPID_DICT_SUCCESS,
    LIPID_DICT_FAIL
} from "../constants/lipidConstants"
import axios from 'axios';


export const dictLipid = (id) => async(dispach) => {
    try{
        dispach({type: LIPID_DICT_REQUEST})
        const {data} = await axios.get(`/api/lipid/L_ID/${id}`)
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