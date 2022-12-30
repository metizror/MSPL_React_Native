import {
  CHANGE_PASSWORD_LOADING,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_ERROR,
} from "../action/actionType";
const initialState = {
  changePaaswordInfo: {
    isLoading: false,
    changePaaswordRes: null,
    loaderMessage: "Loading...",
    isInternetConnection: false,
  },
};



const changePasswordReducer = (state = initialState, action) => {
  
  switch (action.type) {
    case CHANGE_PASSWORD_LOADING:
      return {
        changePaaswordInfo: {
          ...state.changePaaswordInfo,
          isLoading: true,
          changePaaswordRes: null,
          loaderMessage: "Please wait...",
        },
      };
    case CHANGE_PASSWORD_SUCCESS:
      return {
        changePaaswordInfo: {
          ...state.changePaaswordInfo,
          isLoading: false,
          changePaaswordRes: action.payload,
          loaderMessage: "Please wait...",
        },
      };
    case CHANGE_PASSWORD_ERROR:
      return {
        changePaaswordInfo: {
          ...state.changePaaswordInfo,
          changePaaswordRes: action.payload,
          isLoading: false,
          loaderMessage: "Please wait...",
        },
      };
    default:
      return state;
  }
};

export default changePasswordReducer;
