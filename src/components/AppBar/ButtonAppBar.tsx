import {AppBar, Box, Button, IconButton, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import LinearProgress from '@mui/material/LinearProgress';
import {useDispatch, useSelector} from "react-redux";
import {logoutTC} from "../../features/Auth/authReducer";
import {useCallback} from "react";
import {selectAppStatus} from "../../features/Application/selectors";
import {selectIsLoggedIn} from "../../features/Auth/selectors";

export const ButtonAppBar = () => {
  const status = useSelector(selectAppStatus);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();

  const logoutHandler = useCallback(() => {
    dispatch(logoutTC());
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
