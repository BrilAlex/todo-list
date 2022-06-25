import * as appSelectors from "./selectors";
import {asyncAppActions, appSlice} from "./applicationReducer";

const appReducer = appSlice.reducer;
const actions = appSlice.actions;

const appActions = {
  ...actions,
  ...asyncAppActions,
};

export {
  appSelectors,
  appReducer,
  appActions,
};
