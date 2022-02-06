import React from 'react';
import './App.css';
import {ToDoList} from "./components/ToDoList";

export type TaskType = {
  id: number
  title: string
  isDone: boolean
}

function App() {
  const tasks1 = [
    {id: 1, title: "HTML&CSS", isDone: true},
    {id: 2, title: "JS", isDone: true},
    {id: 3, title: "ReactJS", isDone: false}
  ];
  const tasks2 = [
    {id: 1, title: "Bread", isDone: true},
    {id: 2, title: "Milk", isDone: false},
    {id: 3, title: "Cheese", isDone: false}
  ];

  return (
    <div className="App">
      <ToDoList
        title={"What to learn"}
        tasks={tasks1}
      />
      <ToDoList
        title={"What to buy"}
        tasks={tasks2}
      />
    </div>
  );
}

export default App;
