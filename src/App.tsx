import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./components/ToDoList/TodoList";
import {v1} from "uuid";

export type FilterValueType = "all" | "active" | "completed";

export type TaskType = {
  id: string
  title: string
  isDone: boolean
};

type TasksType = {
  [todoList_ID: string]: Array<TaskType>
}

type TodoListType = {
  id: string
  title: string
  filter: FilterValueType
};

function App() {
  const todoList_ID1 = v1();
  const todoList_ID2 = v1();

  const [todoLists, setTodoLists] = useState<TodoListType[]>([
    {id: todoList_ID1, title: "What to Learn", filter: "all"},
    {id: todoList_ID2, title: "What to Buy", filter: "all"},
  ]);

  const [tasks, setTasks] = useState<TasksType>({
    [todoList_ID1]: [
      {id: v1(), title: "HTML&CSS", isDone: true},
      {id: v1(), title: "JS", isDone: true},
      {id: v1(), title: "ReactJS", isDone: false},
      {id: v1(), title: "Rest API", isDone: false},
      {id: v1(), title: "GraphQL", isDone: false},
    ],
    [todoList_ID2]: [
      {id: v1(), title: "Bread", isDone: true},
      {id: v1(), title: "Milk", isDone: false},
      {id: v1(), title: "Cheese", isDone: false},
      {id: v1(), title: "Salt", isDone: true},
      {id: v1(), title: "Sugar", isDone: false},
    ],
  });

  const addTask = (todoList_ID: string, title: string) => {
    const newTask: TaskType = {id: v1(), title, isDone: false};
    tasks[todoList_ID] = [newTask, ...tasks[todoList_ID]];
    setTasks({...tasks});
  };

  const changeTaskStatus = (todoList_ID: string, task_ID: string, isDone: boolean) => {
    const task = tasks[todoList_ID].find(t => t.id === task_ID);
    if (task) {
      task.isDone = isDone;
      setTasks({...tasks});
    }
  };

  const removeTask = (todoList_ID: string, task_ID: string) => {
    tasks[todoList_ID] = tasks[todoList_ID].filter(t => t.id !== task_ID);
    setTasks({...tasks});
  };

  const changeFilter = (todoList_ID: string, filterValue: FilterValueType) => {
    setTodoLists(todoLists.map(tl => tl.id === todoList_ID ? {
      ...tl,
      filter: filterValue
    } : tl));
  };

  const removeTodoList = (todoList_ID: string) => {
    setTodoLists(todoLists.filter(tl => tl.id !== todoList_ID));

    delete tasks[todoList_ID];
    setTasks({...tasks});
  };

  return (
    <div className="App">
      {todoLists.map(tl => {
        let tasksForTodoList = tasks[tl.id];

        if (tl.filter === "active") {
          tasksForTodoList = tasksForTodoList.filter(t => !t.isDone);
        }

        if (tl.filter === "completed") {
          tasksForTodoList = tasksForTodoList.filter(t => t.isDone);
        }

        return (
          <TodoList
            key={tl.id}
            id={tl.id}
            title={tl.title}
            tasks={tasksForTodoList}
            filter={tl.filter}
            addTask={addTask}
            changeTaskStatus={changeTaskStatus}
            removeTask={removeTask}
            changeFilter={changeFilter}
            removeTodoList={removeTodoList}
          />
        );
      })}
    </div>
  );
}

export default App;
