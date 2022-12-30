import {
  CLOSE_ACCOUNT_LOADING,
  CLOSE_ACCOUNT_SUCCESS,
  CLOSE_ACCOUNT_ERROR,
} from "../action/actionType";
const initialState = {
  closeAccount: {
    isLoading: false,
    closeAccountRes: null,
    loaderMessage: "Loading...",
    isInternetConnection: false,
  },
};


const closeAccontReducer = (state = initialState, action) => {
  
  switch (action.type) {
    case CLOSE_ACCOUNT_LOADING:
      return {
        closeAccount: {
          ...state.closeAccount,
          isLoading: true,
          closeAccountRes: null,
          loaderMessage: "Please wait...",
        },
      };
    case CLOSE_ACCOUNT_SUCCESS:
      return {
        closeAccount: {
          ...state.closeAccount,
          isLoading: false,
          closeAccountRes: action.payload,
          loaderMessage: "Please wait...",
        },
      };
      
    case CLOSE_ACCOUNT_ERROR:
      return {
        closeAccount: {
          ...state.closeAccount,
          closeAccountRes: action.payload,
          isLoading: false,
          loaderMessage: "Please wait...",
        },
      };
    default:
      return state;
  }
};

export default closeAccontReducer;
