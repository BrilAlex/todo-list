import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./components/ToDoList/TodoList";
import {v1} from "uuid";
import {AddItemForm} from "./components/AddItemForm/AddItemForm";
import {ButtonAppBar} from "./components/AppBar/ButtonAppBar";
import {Container, Grid, Paper} from "@mui/material";

export type FilterValueType = "all" | "active" | "completed";

export type TaskType = {
  id: string
  title: string
  isDone: boolean
};

export type TasksType = {
  [todoList_ID: string]: Array<TaskType>
}

export type TodoListType = {
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

  const changeTaskTitle = (todoList_ID: string, task_ID: string, newTitle: string) => {
    const task = tasks[todoList_ID].find(t => t.id === task_ID);
    if (task) {
      task.title = newTitle;
      setTasks({...tasks});
    }
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

  const addTodoList = (title: string) => {
    const newTodoList: TodoListType = {id: v1(), title, filter: "all"};
    setTodoLists([newTodoList, ...todoLists]);
    setTasks({...tasks, [newTodoList.id]: []});
  };

  const changeTodoListTitle = (todoList_ID: string, newTitle: string) => {
    const todoList = todoLists.find(tl => tl.id === todoList_ID);
    if (todoList) {
      todoList.title = newTitle;
      setTodoLists([...todoLists]);
    }
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
      <ButtonAppBar/>
      <Container fixed>
        <Grid container style={{padding: "20px"}}>
          <AddItemForm addItem={addTodoList}/>
        </Grid>
        <Grid container spacing={3}>
          {todoLists.map(tl => {
            let tasksForTodoList = tasks[tl.id];

            if (tl.filter === "active") {
              tasksForTodoList = tasksForTodoList.filter(t => !t.isDone);
            }

            if (tl.filter === "completed") {
              tasksForTodoList = tasksForTodoList.filter(t => t.isDone);
            }

            return (
              <Grid key={tl.id} item>
                <Paper elevation={5} style={{padding: "15px"}}>
                  <TodoList
                    id={tl.id}
                    title={tl.title}
                    tasks={tasksForTodoList}
                    filter={tl.filter}
                    addTask={addTask}
                    changeTaskTitle={changeTaskTitle}
                    changeTodoListTitle={changeTodoListTitle}
                    changeTaskStatus={changeTaskStatus}
                    removeTask={removeTask}
                    changeFilter={changeFilter}
                    removeTodoList={removeTodoList}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
}

export default App;
