import * as authSelectors from "./selectors";
import {authSlice} from "./authReducer";
import {Login} from "./Login";
import {login, logout} from "./authSagas";

const authReducer = authSlice.reducer;

const authActions = {
  login,
  logout,
};

export {
  authSelectors,
  authReducer,
  authActions,
  Login,
};
