import api from "../../network/api";
import {
  GET_CATEGORY_ERROR,
  GET_CATEGORY_LOADING,
  GET_CATEGORY_SUCCESS,
  GET_STATE_ERROR,
  GET_STATE_LOADING,
  GET_STATE_SUCCESS,
  LOGIN_USER_ERROR,
  LOGIN_USER_LOADING,
  LOGIN_USER_SUCCESS,
  NOTIFICATION_ITEM_ERROR,
  NOTIFICATION_ITEM_LOADING,
  NOTIFICATION_ITEM_SUCCESS,
  REGISTER_USER_ERROR,
  REGISTER_USER_LOADING,
  REGISTER_USER_SUCCESS,
  SEARCH_ITEM_ERROR,
  SEARCH_ITEM_LOADING,
  SEARCH_ITEM_SUCCESS,
  VIEW_ITEM_ERROR,
  VIEW_ITEM_LOADING,
  VIEW_ITEM_SUCCESS,
} from "../action/actionType";

export const loginApiCall = (data) => async (dispatch) => {
  console.log("Param: " + data._parts[1][1]);
  try {
    dispatch({
      type: LOGIN_USER_LOADING,
      payload: true,
    });
    new Promise((resolve, reject) => {
      api
        .post("login", data, global.userToken)
        .then((response) => {
          console.log("Response" + JSON.stringify(response.body));
          if (response.body.success) {
            dispatch({
              type: LOGIN_USER_SUCCESS,
              payload: response.body,
            });
          } else {
            dispatch({
              type: LOGIN_USER_ERROR,
              payload: response.body,
            });
          }
        })
        .catch(reject);
    });
  } catch (error) {
    dispatch({
      type: LOGIN_USER_ERROR,
      payload: error,
    });
  }
};

export const viewItemApiCall = (url, data) => async (dispatch) => {
  console.log("url===>", url);
  try {
    dispatch({
      type: VIEW_ITEM_LOADING,
      payload: true,
    });
    new Promise((resolve, reject) => {
      api
        .post(url, data)
        .then((response) => {
          console.log("response ========>", JSON.stringify(response));
          if (response.body.success) {
            dispatch({
              type: VIEW_ITEM_SUCCESS,
              payload: response.body,
            });
          } else {
            dispatch({
              type: VIEW_ITEM_ERROR,
              payload: response.body,
            });
          }
        })
        .catch(reject);
    });
  } catch (error) {
    dispatch({
      type: VIEW_ITEM_ERROR,
      payload: error,
    });
  }
};



export const notificationCall = (url) => async (dispatch) => {
  console.log("url===>", url);
  try {
    dispatch({
      type: NOTIFICATION_ITEM_LOADING,
      payload: true,
    });
    new Promise((resolve, reject) => {
      api
        .get(url)
        .then((response) => {
          console.log("response ========>", JSON.stringify(response));
          if (response.body.success) {
            dispatch({
              type: NOTIFICATION_ITEM_SUCCESS,
              payload: response.body,
            });
          } else {
            dispatch({
              type: NOTIFICATION_ITEM_ERROR,
              payload: response.body,
            });
          }
        })
        .catch(reject);
    });
  } catch (error) {
    dispatch({
      type: NOTIFICATION_ITEM_ERROR,
      payload: error,
    });
  }
};


export const registrationApi = (data) => async (dispatch) => {
  try {
    dispatch({
      type: REGISTER_USER_LOADING,
      payload: true,
    });
    new Promise((resolve, reject) => {
      api
        .post("register", data, global.userToken)
        .then((response) => {
          console.log("responce" + JSON.stringify(response.body));
          if (response.body.success) {
            dispatch({
              type: REGISTER_USER_SUCCESS,
              payload: response.body,
            });
          } else {
            dispatch({
              type: REGISTER_USER_ERROR,
              payload: response.body,
            });
          }
        })
        .catch(reject);
    });
  } catch (error) {
    dispatch({
      type: REGISTER_USER_ERROR,
      payload: error,
    });
  }
};

export const stateApi = (data) => async (dispatch) => {
  try {
    dispatch({
      type: GET_STATE_LOADING,
      payload: true,
    });
    new Promise((resolve, reject) => {
      api
        .get("state/list", data, global.userToken)
        .then((response) => {
          console.log("responce", response.body);
          if (response.body.success) {
            dispatch({
              type: GET_STATE_SUCCESS,
              payload: response.body,
            });
          } else {
            dispatch({
              type: GET_STATE_ERROR,
              payload: response.body,
            });
          }
        })
        .catch(reject);
    });
  } catch (error) {
    dispatch({
      type: GET_STATE_ERROR,
      payload: error,
    });
  }
};

export const getListing1 = (page, data) => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post("listing?page=" + page, data)
        .then((response) => {
          if (response.body.success) {
            resolve(response.body);
          } else {
            reject(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const getListing = (url, data) => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post(url, data)
        .then((response) => {
          if (response.body.success) {
            resolve(response.body);
          } else {
            reject(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};
export const addUpdatePopularity = (data) => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post("user/add-update/popularity", data, "")
        .then((response) => {
          console.log("addUpdatePopularity", response.body);
          if (response.body.success) {
            resolve(response.body);
          } else {
            reject(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};
export const addRemoveUserFavorite = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("user/favorite/add/remove", data, "")
      .then((response) => {
        console.log("addRemoveUserFavorite", response.body);
        if (response.body.success) {
          resolve(response.body);
        } else {
          reject(response.body);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const getUserById = (userId) => {
  return new Promise((resolve, reject) => {
    api
      .get("user/" + userId + "/view", "", global.userToken)
      .then((response) => {
        console.log("getUserById", response.body);
        if (response.body.success) {
          resolve(response.body);
        } else {
          reject(response.body);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const getViewItemUser = (data, itemId) => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post("listing/" + itemId + "/view", data, "")
        .then((response) => {
          console.log("getViewItemUser", response.body);
          if (response.body.success) {
            resolve(response.body);
          } else {
            reject(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};
export const getUserListing = (data, itemId) => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post("listing/" + itemId + "/user-listing", data, "")
        .then((response) => {
          console.log("getUserListing", response.body);
          if (response.body.success) {
            resolve(response.body);
          } else {
            reject(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};
export const getMyListing = (data) => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post("listing/my-listing", data, "")
        .then((response) => {
          console.log("getMyListing", response.body);
          if (response.body.success) {
            resolve(response.body);
          } else {
            reject(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};
export const addRemoveFavorite = (data) => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post("favorite/add/remove", data, "")
        .then((response) => {
          console.log("addRemoveFavorite", response.body);
          if (response.body.success) {
            resolve(response.body);
          } else {
            reject(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const getFavoriteListing = (data) => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post("favorite/listing", data)
        .then((response) => {
          console.log("getFavoriteListing", response.body);
          if (response.body.success) {
            resolve(response.body);
          } else {
            reject(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};
export const getCategoryApiCall = (data) => {
  return new Promise((resolve, reject) => {
    api
      .get("category", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getSubCategoryApiCall = (id, data) => {
  return new Promise((resolve, reject) => {
    api
      .get("sub-category/" + id, data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getTernAndConditionsApiCall = (data) => {
  return new Promise((resolve, reject) => {
    api
      .get("cms?slug=terms_and_conditions", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getPrivacyPolicyApiCall = (data) => {
  return new Promise((resolve, reject) => {
    api
      .get("cms?slug=privacy_policy", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getChatList = (data) => {
  return new Promise((resolve, reject) => {
    api
      .get("chat/my/user-list", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const changeEmailApiCall = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("user/email/update", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const getMyChatList = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("chat/my/user-list", data,)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const changePasswordApi = (data) => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post("user/change/password", data, global.userToken)
        .then((response) => {
          console.log("change-user-password", response.body);
          if (response) {
            resolve(response.body);
          } else {
            reject(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const FAQApiCall = (data) => {
  try {
    return new Promise((resolve, reject) => {
      api
        .get("faq", data, global.userToken)
        .then((response) => {
          console.log("faq", response.body);
          if (response.body.success) {
            resolve(response.body);
          } else {
            reject(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const updateProfileApiCall = async (data) => {
  try {
    return new Promise((resolve, reject) => {
      api
        .post("user/profile/update", data, global.userToken)
        .then((response) => {
          console.log("profile_update", response.body);
          if (response.body.success) {
            resolve(response.body);
          } else {
            reject(response.body);
          }
        })
        .catch(reject);
    });
  } catch (error) {
    reject(error);
  }
};

export const getSMSApiCall = (id, data) => {
  return new Promise((resolve, reject) => {
    api
      .post("chat/user/" + id + "/message", data,)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const sendSMSApiCall = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("chat/send-message", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteListingApiCall = (id) => {
  return new Promise((resolve, reject) => {
    api
      .delete("listing/" + id + "/delete", "", global.userToken)
      .then((response) => {
        if (response.body.success) {
          resolve(response.body);
        } else {
          reject(response.body);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getUserProfileApiCall = (data) => {
  return new Promise((resolve, reject) => {
    api
      .get("user/view", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const logOutApiCall = () => {
  return new Promise((resolve, reject) => {
    api
      .post("logout")
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const createListingApiCall = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("listing/create", data, global.userToken)
      .then((response) => {
        console.log("createListingApiCall", response.body);
        if (response.body) {
          resolve(response.body);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateListingApiCall = (id, data) => {
  return new Promise((resolve, reject) => {
    api
      .post("listing/" + id + "/update", data, global.userToken)
      .then((response) => {
        console.log("updateListingApi --> result", response.body);
        if (response.body.success) {
          resolve(response.body);
        } else {
          reject(response.body);
        }
      })
      .catch((error) => {
        console.log("updateListingApi --> error", error);
        reject(error);
      });
  });
};

export const getFormCategoryDetailsApiCall = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("category-detail", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getSubscribePlan = (data) => {
  return new Promise((resolve, reject) => {
    api
      .get("subscribe-plan", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const changeUserProfileApiCall = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("user/profile/photo", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getListingView = (id, data) => {
  return new Promise((resolve, reject) => {
    api
      .post("listing/" + id + "/view", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getMapDataApi = (data) => {
  return new Promise((resolve, reject) => {
    api
      .get("map", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getContactUsApiCall = (data) => {
  return new Promise((resolve, reject) => {
    api
      .get("contact-us", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const forgotPasswordApi = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("forget-password", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getNotificationApi = (data) => {
  return new Promise((resolve, reject) => {
    api
      .get("notification", data,)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const readNotificationApi = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("notification-read", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const readChatApiCall = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("chat/message/read", data)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const converToBusinessAccountApi = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("user/change-account/standard-to-pro", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getCategory = (data) => async (dispatch) => {
  try {
    dispatch({
      type: GET_CATEGORY_LOADING,
      payload: true,
    });
    new Promise((resolve, reject) => {
      api
        .get("category", data, global.userToken)
        .then((response) => {
          console.log("responce", response.body);
          if (response.body.success) {
            dispatch({
              type: GET_CATEGORY_SUCCESS,
              payload: response.body,
            });
          } else {
            dispatch({
              type: GET_STATE_ERROR,
              payload: response.body,
            });
          }
        })
        .catch(reject);
    });
  } catch (error) {
    dispatch({
      type: GET_CATEGORY_ERROR,
      payload: error,
    });
  }
};

export const loginWithFacebookApiCall = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("login/with/facebook", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const loginWithGoogleApiCall = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("login/with/google", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const loginWithAppleApiCall = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("login/with/apple", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const registrationApiCall = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("register", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const checkFacebookLoginApiCall = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("login/check/facebook", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const checkGoogleLoginApiCall = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("login/check/google", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const checkAppleLoginApiCall = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("login/check/apple", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const checkBoostAmountApiCall = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("listing-boosts/check/amount", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const callBoostPostApi = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("listing-boosts/store", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        console.log("Eror", error);

        reject(error);
      });
  });
};

export const callSubScriptionApi = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("subscription/payment/store", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        console.log("Eror", error);
        reject(error);
      });
  });
};

export const callBusinessUserPaymentCreateListingApiCall = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("business-standard/listing/payment", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        console.log("Eror", error);
        reject(error);
      });
  });
};

export const searchItemApiCall = (url, data) => async (dispatch) => {
  console.log("url===>", url);
  try {
    dispatch({
      type: SEARCH_ITEM_LOADING,
      payload: true,
    });
    new Promise((resolve, reject) => {
      api
        .post(url, data)
        .then((response) => {
          if (response.body.success) {
            dispatch({
              type: SEARCH_ITEM_SUCCESS,
              payload: response.body,
            });
          } else {
            dispatch({
              type: SEARCH_ITEM_ERROR,
              payload: response.body,
            });
          }
        })
        .catch(reject);
    });
  } catch (error) {
    dispatch({
      type: SEARCH_ITEM_ERROR,
      payload: error,
    });
  }
};

export const deleteAccountApiCall = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("user/delete/account", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const CheckBoostListingExist = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("listing-boosts/check/excised", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const soldOutItemApiCall = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("listing/sold", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        console.log("Eror", error);

        reject(error);
      });
  });
};


export const renewListingApi = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("business-standard/listing/renew/payment", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        console.log("Eror", error);

        reject(error);
      });
  });
};



export const renewListingStandardApi = (data) => {
  return new Promise((resolve, reject) => {
    api
      .post("individual/standard/listing/renew", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        console.log("Eror", error);

        reject(error);
      });
  });
};

export const getProListingCountApi = (data) => {
  return new Promise((resolve, reject) => {
    api
      .get("listing_count", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};





export const createAddListApi = (data) => {
  return new Promise((resolve, reject) => {
    api
      .get("advertisement/type/list", data, global.userToken)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
  });
};


