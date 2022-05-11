import React from 'react';
import './App.css';
import {ButtonAppBar} from "../components/AppBar/ButtonAppBar";
import {Container} from "@mui/material";
import {TodoListsList} from "../features/TodoListsList/TodoListsList";


function App() {
  return (
    <div className="App">
      <ButtonAppBar/>
      <Container fixed>
        <TodoListsList/>
      </Container>
    </div>
  );
}

export default App;
