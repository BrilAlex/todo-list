import * as appSelectors from "./selectors";
import {appSlice} from "./applicationReducer";
import {initializeApp} from "./applicationSagas";

const appReducer = appSlice.reducer;

const appActions = {
  initializeApp,
};

export {
  appSelectors,
  appReducer,
  appActions,
};
