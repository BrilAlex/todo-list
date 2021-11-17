import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./components/TodoList/TodoList";
import {v1} from "uuid";
import {AddItemForm} from "./components/AddItemForm/AddItemForm";
import AppBar from '@material-ui/core/AppBar';
import {
  Button,
  Container,
  Grid,
  IconButton, Paper,
  Toolbar,
  Typography
} from "@material-ui/core";
import {Menu} from '@material-ui/icons';

export type TodoListType = {
  id: string
  title: string
  filter: FilterValueType
};

export type TaskType = {
  id: string
  title: string
  isDone: boolean
};

type TasksType = {
  [key: string]: TaskType[]
}

export type FilterValueType = "All" | "Active" | "Completed";

function App() {
  const todoListID_1 = v1();
  const todoListID_2 = v1();

  const [todoLists, setTodoLists] = useState<TodoListType[]>([
    {id: todoListID_1, title: "What to Learn", filter: "All"},
    {id: todoListID_2, title: "What to Buy", filter: "All"},
  ]);

  const [tasks, setTasks] = useState<TasksType>({
    [todoListID_1]: [
      {id: v1(), title: "HTML&CSS", isDone: true},
      {id: v1(), title: "JS", isDone: true},
      {id: v1(), title: "React", isDone: false},
      {id: v1(), title: "GraphQL", isDone: false},
      {id: v1(), title: "Rest API", isDone: false},
    ],
    [todoListID_2]: [
      {id: v1(), title: "Bead", isDone: true},
      {id: v1(), title: "Milk", isDone: true},
      {id: v1(), title: "Butter", isDone: false},
    ],
  });

  const addTask = (todoList_ID: string, title: string) => {
    setTasks({
      ...tasks,
      [todoList_ID]: [...tasks[todoList_ID], {id: v1(), title, isDone: false}]
    });
  }
  const changeTaskTitle = (todoList_ID: string, task_ID: string, title: string) => {
    setTasks({
      ...tasks,
      [todoList_ID]: tasks[todoList_ID].map(t => t.id === task_ID ? {...t, title} : t)
    });
  };
  const changeTaskStatus = (todoList_ID: string, task_ID: string, taskStatus: boolean) => {
    setTasks({
      ...tasks,
      [todoList_ID]: tasks[todoList_ID].map(t =>
        t.id === task_ID ? {...t, isDone: taskStatus} : t)
    });
  };
  const removeTask = (todoList_ID: string, task_ID: string) => {
    setTasks({
      ...tasks,
      [todoList_ID]: tasks[todoList_ID].filter(t => t.id !== task_ID)
    });
  };

  const addTodoList = (title: string) => {
    let newTodoList_ID = v1();
    setTodoLists([...todoLists, {id: newTodoList_ID, title, filter: "All"}]);
    setTasks({...tasks, [newTodoList_ID]: []});
  };
  const changeTodoListTitle = (todoList_ID: string, title: string) => {
    setTodoLists(todoLists.map(tl => tl.id === todoList_ID ? {...tl, title} : tl));
  };
  const changeFilter = (todoList_ID: string, filter: FilterValueType) => {
    setTodoLists(todoLists.map(tl => tl.id === todoList_ID ? {...tl, filter} : tl));
  };
  const removeTodoList = (todoList_ID: string) => {
    setTodoLists(todoLists.filter(tl => tl.id !== todoList_ID));
    delete tasks[todoList_ID];
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar style={{justifyContent: "space-between"}}>
          <IconButton edge={"start"} color="inherit">
            <Menu/>
          </IconButton>
          <Typography variant="h6">
            TodoLists
          </Typography>
          <Button variant={"outlined"} color="inherit">
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <Container fixed>
        <Grid container style={{padding: "20px"}}>
          <AddItemForm callback={addTodoList}/>
        </Grid>
        <Grid container spacing={3}>
          {todoLists.map(tl => {
            let filteredTasks = tasks[tl.id];
            if (tl.filter === "Active") filteredTasks = tasks[tl.id].filter(t => !t.isDone);
            if (tl.filter === "Completed") filteredTasks = tasks[tl.id].filter(t => t.isDone);

            return (
              <Grid key={tl.id} item>
                <Paper style={{padding: "10px"}}>
                  <TodoList
                    id={tl.id}
                    title={tl.title}
                    tasks={filteredTasks}
                    addTask={addTask}
                    changeTaskTitle={changeTaskTitle}
                    changeTaskStatus={changeTaskStatus}
                    removeTask={removeTask}
                    filter={tl.filter}
                    changeTodoListTitle={changeTodoListTitle}
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
