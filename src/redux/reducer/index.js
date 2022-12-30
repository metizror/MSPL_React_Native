import loginReducer from "./loginReducer";
import registrationReducer from "./registrationReducer";
import stateListReducer from "./stateListReducer";
import deepLinkingReducer from "./deepLinkingReducer";
import loadMoreReducer from "./loadMoreReducer";
import categoryDetailListReducer from "./categoryDetailListReducer";
import categoryReducer from "./categoryReducer";
import viewItemReducer from "./viewItemReducer";
import searchItemReducer from "./searchItemReducer";
import notificationReducer from "./notificationReducer";


import { combineReducers } from "redux";
import { USER_LOGGED_OUT } from "../action/actionType";
const appReducer = combineReducers({
  loginReducer,
  registrationReducer,
  stateListReducer,
  deepLinkingReducer,
  loadMoreReducer,
  categoryDetailListReducer,
  categoryReducer,
  viewItemReducer,
  searchItemReducer,
  notificationReducer
});

const rootReducer = (state, action) => {
  // when a logout action is dispatched it will reset redux state
  if (action.type === USER_LOGGED_OUT) {
    state = undefined;
  }
  

  return appReducer(state, action);
};

export default rootReducer;
