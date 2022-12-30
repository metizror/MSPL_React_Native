import {
  SEARCH_ITEM_LOADING,
  SEARCH_ITEM_SUCCESS,
  SEARCH_ITEM_ERROR,
  SEARCH_ITEM_CLEAR,
} from "../action/actionType";
const initialState = {
  data: {
    isLoading: false,
    list: [],
    loaderMessage: "Loading...",
    isInternetConnection: false,
    next_page_url: "",
  },
};

const searchItemReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_ITEM_LOADING:
      return {
        data: {
          ...state.data,
          isLoading: true,
          // list: state.data?.list != null ? state.data.list : [],
          loaderMessage: "Please wait...",
        },
      };

    case SEARCH_ITEM_SUCCESS:
      return {
        data: {
          ...state.data,
          isLoading: false,
          item: action.payload,
          //  list: action.payload.data,
          list: [...state.data.list, ...action.payload.data],
          loaderMessage: "Please wait...",
          next_page_url: action.payload.pagination.next_page_url,
        },
      };
    case SEARCH_ITEM_ERROR:
      return {
        data: {
          ...state.data,
          // list: action.payload,
          isLoading: false,
          loaderMessage: "Please wait...",
        },
      };
    case SEARCH_ITEM_CLEAR:
      return {
        data: {
          ...state.data,
          list: [],
          isLoading: false,
          loaderMessage: "Please wait...",
        },
      };
    default:
      return state;
  }
};

export default searchItemReducer;
