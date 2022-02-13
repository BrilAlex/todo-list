import React, {useState} from 'react';
import './App.css';
import {ToDoList} from "./components/ToDoList";

export type TaskType = {
  id: number
  title: string
  isDone: boolean
}

export type FilterValueType = "All" | "Active" | "Completed";

function App() {
  const [tasks, setTasks] = useState<Array<TaskType>>([
    {id: 1, title: "HTML&CSS", isDone: true},
    {id: 2, title: "JS", isDone: true},
    {id: 3, title: "ReactJS", isDone: false},
    {id: 4, title: "Rest API", isDone: false},
    {id: 5, title: "GraphQL", isDone: false},
  ]);
  const [filter, setFilter] = useState<FilterValueType>("All");

  const removeTask = (task_ID: number) => {
    setTasks(tasks.filter(t => t.id !== task_ID));
  };

  const changeFilter = (filterValue: FilterValueType) => {
    setFilter(filterValue);
  };

  let filteredTasks = tasks;
  if (filter === "Active") {
    filteredTasks = tasks.filter(t => !t.isDone);
  }
  if (filter === "Completed") {
    filteredTasks = tasks.filter(t => t.isDone);
  }

  return (
    <div className="App">
      <ToDoList
        title={"What to learn"}
        tasks={filteredTasks}
        removeTask={removeTask}
        changeFilter={changeFilter}
      />
    </div>
  );
}

export default App;
