import {
  EMAIL_UPDATE_RESET,
  NOTIFICATION_ITEM_CLEAR,
  NOTIFICATION_TERMINATED_EVENT,
  SEARCH_ITEM_CLEAR,
  USER_LOGGED_OUT,
  VIEW_ITEM_CLEAR,
} from "./actionType";

export const updateEmailReset = (params) => ({
  type: EMAIL_UPDATE_RESET,
});
export const notificationTerminated = (data) => {
  console.log("event : testing data");
  return {
    type: NOTIFICATION_TERMINATED_EVENT,
    payload: data,
  };
};
export const DEEP_LINKING_EVENT = "DEEP_LINKING_EVENT";
export const LOAD_MORE_EVENT = "LOAD_MORE_EVENT";
export const CATEGORY_DETAIL_LIST_EVENT = "CATEGORY_DETAIL_LIST_EVENT";
export const CLAER_CATEGORY_DETAIL_LIST_EVENT = "CLAER_CATEGORY_DETAIL_LIST_EVENT";


export const removeStore = () => {
  return {
    type: USER_LOGGED_OUT,
    payload: undefined,
  };
};

export const clearViewData = () => {
  return {
    type: VIEW_ITEM_CLEAR,
  };
};

export const clearSearchItem = () => {
  return {
    type: SEARCH_ITEM_CLEAR,
  };
};


export const clearNotificationData = () => {
  return {
    type: NOTIFICATION_ITEM_CLEAR,
  };
};



export const clearCategoryEvent = () => {
  return {
    type: CLAER_CATEGORY_DETAIL_LIST_EVENT,
  };
};