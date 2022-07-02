import React, {useEffect} from 'react';
import './App.css';
import {ButtonAppBar} from "../components/AppBar/ButtonAppBar";
import {CircularProgress, Container} from "@mui/material";
import {TodoListsList} from "../features/TodoListsList/TodoListsList";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "../features/Auth";
import {useSelector} from "react-redux";
import {useActions} from "../utils/reduxUtils";
import {appActions, appSelectors} from "../features/Application";

function App() {
  const isInitialized = useSelector(appSelectors.selectAppIsInitialized);
  const {initializeApp} = useActions(appActions);

  useEffect(() => {
    if (!isInitialized) {
      initializeApp();
    }
  }, [isInitialized, initializeApp]);

  if (!isInitialized) {
    return (
      <div style={{position: "fixed", top: "30%", width: "100%", textAlign: "center"}}>
        <CircularProgress/>
      </div>
    );
  }

  return (
    <div className="App">
      <ErrorSnackbar/>
      <ButtonAppBar/>
      <Container fixed>
        <Routes>
          <Route path={"/"} element={<TodoListsList demoMode={false}/>}/>
          <Route path={"/login"} element={<Login/>}/>
          <Route path={"/error404"} element={<h1>Error 404: Page not found</h1>}/>
          <Route path={"*"} element={<Navigate to={"/error404"}/>}/>
        </Routes>
      </Container>
    </div>
  );
}

export default App;
