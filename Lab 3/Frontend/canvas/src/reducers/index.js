import { combineReducers } from "redux";
import postReducer from './postReducer';
import { readFileSync } from "fs";

export default combineReducers({
    posts: postReducer
});