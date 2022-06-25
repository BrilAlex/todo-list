import {AppBar, Box, Button, IconButton, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import LinearProgress from '@mui/material/LinearProgress';
import {useSelector} from "react-redux";
import {useCallback} from "react";
import {appSelectors} from "../../features/Application";
import {authActions, authSelectors} from "../../features/Auth";
import {useActions} from "../../utils/reduxUtils";

export const ButtonAppBar = () => {
  const status = useSelector(appSelectors.selectAppStatus);
  const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn);
  const {logout} = useActions(authActions);

  const logoutHandler = useCallback(() => {
    logout();
  }, [logout]);

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
