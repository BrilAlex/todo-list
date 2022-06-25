import * as appSelectors from "./selectors";
import {asyncAppActions, appSlice} from "./applicationReducer";

const appReducer = appSlice.reducer;

const appActions = {
  ...appSlice.actions,
  ...asyncAppActions,
};

export {
  appSelectors,
  appReducer,
  appActions,
};
