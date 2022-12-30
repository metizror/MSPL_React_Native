import {
  UPDATE_USER_ERROR,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_LOADING,
} from "../action/actionType";
const initialState = {
  user: {
    isLoading: false,
    userDetails: null,
    loaderMessage: "Loading...",
    isInternetConnection: false,
  },
};



const editPofileReducer = (state = initialState, action) => {
  
  switch (action.type) {
    case UPDATE_USER_LOADING:
      return {
        user: {
          ...state.user,
          isLoading: true,
          userDetails: null,
          loaderMessage: "Please wait...",
        },
      };
    case UPDATE_USER_SUCCESS:
      return {
        user: {
          ...state.user,
          isLoading: false,
          userDetails: action.payload,
          isLoggedIn: true,
          loaderMessage: "Please wait...",
        },
      };
    case UPDATE_USER_ERROR:
      return {
        user: {
          ...state.user,
          userDetails: action.payload,
          isLoading: false,
          loaderMessage: "Please wait...",
        },
      };
    default:
      return state;
  }
};

export default editPofileReducer;
