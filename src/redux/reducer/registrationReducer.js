import {
  REGISTER_USER_ERROR,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_LOADING,
} from "../action/actionType";
const initialState = {
  registrationResponse: {
    isLoading: false,
    isLoggedIn: false,
    userDetails: null,
    loaderMessage: "Loading...",
    isInternetConnection: false,
  },
};


const registrationReducer = (state = initialState, action) => {
  //
  switch (action.type) {
    case REGISTER_USER_LOADING:
      return {
        registrationResponse: {
          ...state.registrationResponse,
          isLoading: true,
          userDetails: null,
          loaderMessage: "Please wait...",
        },
      };
    case REGISTER_USER_SUCCESS:
      return {
        registrationResponse: {
          ...state.registrationResponse,
          isLoading: false,
          userDetails: action.payload,
          isLoggedIn: true,
          loaderMessage: "Please wait...",
        },
      };
    case REGISTER_USER_ERROR:
      return {
        registrationResponse: {
          ...state.registrationResponse,
          userDetails: action.payload,
          isLoading: false,
          loaderMessage: "Please wait...",
        },
      };
    default:
      return state;
  }
};

export default registrationReducer;
