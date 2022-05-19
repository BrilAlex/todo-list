import React from 'react';
import './App.css';
import {ButtonAppBar} from "../components/AppBar/ButtonAppBar";
import {Container} from "@mui/material";
import {TodoListsList} from "../features/TodoListsList/TodoListsList";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";

type PropsType = {
  demoMode?: boolean
};

function App({demoMode = false}: PropsType) {
  return (
    <div className="App">
      <ErrorSnackbar/>
      <ButtonAppBar/>
      <Container fixed>
        <TodoListsList demoMode={demoMode}/>
      </Container>
    </div>
  );
}

export default App;
