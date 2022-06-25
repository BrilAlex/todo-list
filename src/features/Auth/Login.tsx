import React from "react";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {FormikHelpers, useFormik} from "formik";
import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import {useAppDispatch} from "../../utils/reduxUtils";
import {authActions, authSelectors} from "./index";

type FormValuesType = {
  email: string
  password: string
  rememberMe: boolean
}

type FormikErrorType = Partial<FormValuesType>;

export const Login = () => {
  const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validate: (values) => {
      const errors: FormikErrorType = {};
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address";
      }
      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length <= 2) {
        errors.password = "Password length must be more than 2 symbols";
      }
      return errors;
    },
    onSubmit: async (values: FormValuesType, formikHelpers: FormikHelpers<FormValuesType>) => {
      const action = await dispatch(authActions.login(values));
      if (authActions.login.rejected.match(action)) {
        if (action.payload?.fieldsErrors?.length) {
          const error = action.payload.fieldsErrors[0];
          formikHelpers.setFieldError(error.field, error.error);
        }
      } else {
        formik.resetForm();
      }
    },
  });

  if (isLoggedIn) {
    return <Navigate to={"/"}/>;
  }

  return (
    <Grid container justifyContent={"center"}>
      <Grid item justifyContent={"center"}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered <a href={"https://social-network.samuraijs.com/"}
                                            target={"_blank"} rel={"noreferrer"}> here</a>
              </p>
              <p>or use common test account credentials:</p>
              <p>Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField
                label={"Email"}
                {...formik.getFieldProps("email")}
                margin={"normal"}
              />
              {
                formik.touched.email && formik.errors.email &&
                <div style={{color: "red"}}>{formik.errors.email}</div>
              }
              <TextField
                type={"password"}
                label={"Password"}
                {...formik.getFieldProps("password")}
                margin={"normal"}
              />
              {
                formik.touched.password && formik.errors.password &&
                <div style={{color: "red"}}>{formik.errors.password}</div>
              }
              <FormControlLabel
                label={"Remember me"}
                control={
                  <Checkbox
                    {...formik.getFieldProps("rememberMe")}
                    checked={formik.values.rememberMe}
                  />
                }
              />
              <Button type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  );
};
