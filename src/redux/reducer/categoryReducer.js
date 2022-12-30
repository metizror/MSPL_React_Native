import {
  GET_CATEGORY_ERROR,
  GET_CATEGORY_SUCCESS,
  GET_CATEGORY_LOADING,
} from "../action/actionType";
const initialState = {
  data: {
    isLoading: false,
    list: [],
    loaderMessage: "Loading...",
    isInternetConnection: false,
  },
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORY_LOADING:
      return {
        data: {
          ...state.data,
          isLoading: true,
          list: [],
          loaderMessage: "Please wait...",
        },
      };
    case GET_CATEGORY_SUCCESS:
      return {
        data: {
          ...state.data,
          isLoading: false,
          list: action.payload.data,
          loaderMessage: "Please wait...",
        },
      };
    case GET_CATEGORY_ERROR:
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

export default categoryReducer;
