import React from 'react';
import './App.css';
import {TodoList} from "./components/TodoList/TodoList";
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
import {
  addTodoListAC, changeTodoListFilterAC,
  changeTodoListTitleAC, removeTodoListAC,
} from "./store/todoListsReducer";
import {
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC, removeTaskAC,
} from "./store/tasksReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "./store/store";

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

export type TasksType = {
  [key: string]: TaskType[]
}

export type FilterValueType = "All" | "Active" | "Completed";

export const AppWithRedux = () => {
  const todoLists = useSelector<AppStateType, Array<TodoListType>>(state => state.todoLists);
  const tasks = useSelector<AppStateType, TasksType>(state => state.tasks);
  const dispatch = useDispatch();

  const addTask = (todoList_ID: string, title: string) => {
    dispatch(addTaskAC(todoList_ID, title));
  }
  const changeTaskTitle = (todoList_ID: string, task_ID: string, title: string) => {
    dispatch(changeTaskTitleAC(todoList_ID, task_ID, title));
  };
  const changeTaskStatus = (todoList_ID: string, task_ID: string, taskStatus: boolean) => {
    dispatch(changeTaskStatusAC(todoList_ID, task_ID, taskStatus));
  };
  const removeTask = (todoList_ID: string, task_ID: string) => {
    dispatch(removeTaskAC(todoList_ID, task_ID));
  };

  const addTodoList = (title: string) => {
    dispatch(addTodoListAC(title));
  };
  const changeTodoListTitle = (todoList_ID: string, title: string) => {
    dispatch(changeTodoListTitleAC(todoList_ID, title));
  };
  const changeFilter = (todoList_ID: string, filter: FilterValueType) => {
    dispatch(changeTodoListFilterAC(todoList_ID, filter));
  };
  const removeTodoList = (todoList_ID: string) => {
    dispatch(removeTodoListAC(todoList_ID));
    dispatch(removeTodoListAC(todoList_ID));
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
