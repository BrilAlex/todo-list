import {AppBar, Box, Button, IconButton, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import LinearProgress from '@mui/material/LinearProgress';
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../app/store";
import {RequestStatusType} from "../../app/appReducer";
import {logout} from "../../features/Login/authSagas";
import {useCallback} from "react";

export const ButtonAppBar = () => {
  const status = useSelector<AppStateType, RequestStatusType>(state => state.app.status);
  const isLoggedIn = useSelector<AppStateType, boolean>(state => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  const logoutHandler = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{mr: 2}}
          >
            <Menu/>
          </IconButton>
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            News
          </Typography>
          {isLoggedIn && <Button onClick={logoutHandler} color="inherit">Logout</Button>}
        </Toolbar>
        {status === "loading" && <LinearProgress/>}
      </AppBar>
    </Box>
  );
};
