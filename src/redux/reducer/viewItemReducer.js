import {
  VIEW_ITEM_LOADING,
  VIEW_ITEM_SUCCESS,
  VIEW_ITEM_ERROR,
  VIEW_ITEM_CLEAR,
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

const viewItemReducer = (state = initialState, action) => {
  console.log('Checking Action', action);
  switch (action.type) {
    case VIEW_ITEM_LOADING:
      return {
        data: {
          ...state.data,
          isLoading: true,
          // list: state.data?.list != null ? state.data.list : [],
          loaderMessage: "Please wait...",
        },
      };
    case VIEW_ITEM_SUCCESS:
      return {
        data: {
          ...state.data,
          isLoading: false,
          item: action.payload,
          list: [...state.data.list, ...action.payload.data],
          loaderMessage: "Please wait...",
          next_page_url: action.payload.pagination.next_page_url,
        },
      };
    case VIEW_ITEM_ERROR:
      return {
        data: {
          ...state.data,
          isLoading: false,
          loaderMessage: "Please wait...",
        },
      };
    case VIEW_ITEM_CLEAR:
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

export default viewItemReducer;
