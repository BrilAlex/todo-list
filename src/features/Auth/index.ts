import * as authSelectors from "./selectors";
import {asyncAuthActions, authSlice} from "./authReducer";
import {Login} from "./Login";

const authReducer = authSlice.reducer;

const authActions = {
  ...authSlice.actions,
  ...asyncAuthActions,
};

export {
  authSelectors,
  authReducer,
  authActions,
  Login,
};
