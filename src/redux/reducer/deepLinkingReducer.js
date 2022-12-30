import { DEEP_LINKING_EVENT } from "../action/action";

  const initialState = {
    deepLinking:{}
  };
  
  const deepLinkingReducer = (state = initialState, action) => {
    switch (action.type) {
      case DEEP_LINKING_EVENT:
        const mData = {
          ...state,
          deepLinking:action.payload
        }
        return mData;
      default:
        return state;
    }
  };
  
  export default deepLinkingReducer;
  