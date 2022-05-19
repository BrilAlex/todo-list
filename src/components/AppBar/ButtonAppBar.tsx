import {AppBar, Box, Button, IconButton, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import LinearProgress from '@mui/material/LinearProgress';
import {useSelector} from "react-redux";
import {AppStateType} from "../../app/store";
import {RequestStatusType} from "../../app/appReducer";

export const ButtonAppBar = () => {
  const status = useSelector<AppStateType, RequestStatusType>(state => state.app.status);

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
          <Button color="inherit">Login</Button>
        </Toolbar>
        {status === "loading" && <LinearProgress/>}
      </AppBar>
    </Box>
  );
}