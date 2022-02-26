import React, {useState} from 'react';
import './App.css';
import {ToDoList} from "./components/ToDoList";
import {v1} from "uuid";

export type TaskType = {
  id: string
  title: string
  isDone: boolean
}

export type FilterValueType = "all" | "active" | "completed";

function App() {
  const [tasks, setTasks] = useState<Array<TaskType>>([
    {id: v1(), title: "HTML&CSS", isDone: true},
    {id: v1(), title: "JS", isDone: true},
    {id: v1(), title: "ReactJS", isDone: false},
    {id: v1(), title: "Rest API", isDone: false},
    {id: v1(), title: "GraphQL", isDone: false},
  ]);
  const [filter, setFilter] = useState<FilterValueType>("all");

  const addTask = (title: string) => {
    setTasks([{id: v1(), title, isDone: false}, ...tasks]);
  };

  const changeTaskStatus = (task_ID: string, isDone: boolean) => {
    let task = tasks.find(t => t.id === task_ID);
    if (task) {
      task.isDone = isDone;
      setTasks([...tasks]);
    }
  };

  const removeTask = (task_ID: string) => {
    setTasks(tasks.filter(t => t.id !== task_ID));
  };

  const changeFilter = (filterValue: FilterValueType) => {
    setFilter(filterValue);
  };

  let filteredTasks = tasks;
  if (filter === "active") {
    filteredTasks = tasks.filter(t => !t.isDone);
  }
  if (filter === "completed") {
    filteredTasks = tasks.filter(t => t.isDone);
  }

  return (
    <div className="App">
      <ToDoList
        title={"What to learn"}
        tasks={filteredTasks}
        filter={filter}
        addTask={addTask}
        changeTaskStatus={changeTaskStatus}
        removeTask={removeTask}
        changeFilter={changeFilter}
      />
    </div>
  );
}

export default App;
