import {
  LOGIN_USER_LOADING,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
} from "../action/actionType";
const initialState = {
  loginResponse: {
    isLoading: false,
    isLoggedIn: false,
    userDetails: null,
    loaderMessage: "Loading...",
    isInternetConnection: false,
  },
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER_LOADING:
      return {
        loginResponse: {
          ...state.loginResponse,
          isLoading: true,
          userDetails: null,
          loaderMessage: "Please wait...",
        },
      };
    case LOGIN_USER_SUCCESS:
      return {
        loginResponse: {
          ...state.loginResponse,
          isLoading: false,
          userDetails: action.payload,
          isLoggedIn: true,
          loaderMessage: "Please wait...",
        },
      };
    case LOGIN_USER_ERROR:
      return {
        loginResponse: {
          ...state.loginResponse,
          userDetails: action.payload,
          isLoading: false,
          loaderMessage: "Please wait...",
        },
      };
    default:
      return state;
  }
};

export default loginReducer;
