import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, {AlertProps} from "@mui/material/Alert";
import {useSelector} from "react-redux";
import {useActions} from "../../utils/reduxUtils";
import {commonAppActions} from "../../features/CommonActions/app";
import {selectAppError} from "../../features/Application/selectors";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props, ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant={"filled"} {...props} />;
});

export function ErrorSnackbar() {
  const error = useSelector(selectAppError);
  const {setAppError} = useActions(commonAppActions);

  const isOpen = error !== null;

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setAppError({error: null});
  };

  return (
    <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={"error"} sx={{width: '100%'}}>
        {error}
      </Alert>
    </Snackbar>
  );
}
