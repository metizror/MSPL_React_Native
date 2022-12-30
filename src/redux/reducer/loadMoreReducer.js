import { LOAD_MORE_EVENT } from "../action/action";

  const initialState = {
    loadMore:false
  };
  
  const loadMoreReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOAD_MORE_EVENT:
        const mData = {
          ...state,
          loadMore:action.payload
        }
        return mData;
      default:
        return state;
    }
  };
  
  export default loadMoreReducer;
  