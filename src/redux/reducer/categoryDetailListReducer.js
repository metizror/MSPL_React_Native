import {
  CATEGORY_DETAIL_LIST_EVENT,
  CLAER_CATEGORY_DETAIL_LIST_EVENT,
  DEEP_LINKING_EVENT,
} from "../action/action";

const initialState = {
  categoryDetailList: [],
};

const categoryDetailListReducer = (state = initialState, action) => {
  switch (action.type) {
    case CATEGORY_DETAIL_LIST_EVENT:
      var mData = {
        ...state,
        categoryDetailList: action.payload,
      };
      return mData;

    case CLAER_CATEGORY_DETAIL_LIST_EVENT:
      mData = {
        ...state,
        categoryDetailList: [],
      };
      return mData;
    default:
      return state;
  }
};

export default categoryDetailListReducer;
