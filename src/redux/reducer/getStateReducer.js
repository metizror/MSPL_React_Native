import {
  GET_STATE_ERROR,
  GET_STATE_SUCCESS,
  GET_STATE_LOADING,
} from "../action/actionType";
const initialState = {
  data: {
    isLoading: false,
    list: [],
    loaderMessage: "Loading...",
    isInternetConnection: false,
  },
};



const getStateReducer = (state = initialState, action) => {
  
  switch (action.type) {
    case GET_STATE_LOADING:
      return {
        data: {
          ...state.data,
          isLoading: true,
          list: [],
          loaderMessage: "Please wait...",
        },
      };
    case GET_STATE_SUCCESS:
      return {
        data: {
          ...state.data,
          isLoading: false,
          list: action.payload.data,
          loaderMessage: "Please wait...",
        },
      };
    case GET_STATE_ERROR:
      return {
        data: {
          ...state.data,
          list: action.payload,
          isLoading: false,
          loaderMessage: "Please wait...",
        },
      };
    default:
      return state;
  }
};

export default getStateReducer;
