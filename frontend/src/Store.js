import { configureStore, combineReducers } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { genericsListReducer } from './reducers/genericsReducers'
import { lipidDictReducer } from './reducers/lipidReducers'



const reducer = combineReducers({
    genericsList:genericsListReducer,
    lipidDict : lipidDictReducer,
})

const initialState = {}
const middleware = [thunk];

const store = configureStore({
    reducer: reducer,
    preloadedState: initialState,
    middleware: middleware,
});

export default store