import React, {useReducer} from 'react';
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
import {
  addTodoListAC, changeTodoListFilterAC,
  changeTodoListTitleAC, removeTodoListAC,
  todoListsReducer
} from "./store/todoListsReducer";
import {
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC, removeTaskAC,
  tasksReducer
} from "./store/tasksReducer";

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

export const AppWithReducers = () => {
  const todoListID_1 = v1();
  const todoListID_2 = v1();

  const [todoLists, dispatchToTodoLists] = useReducer(todoListsReducer, [
    {id: todoListID_1, title: "What to Learn", filter: "All"},
    {id: todoListID_2, title: "What to Buy", filter: "All"},
  ]);

  const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
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
    dispatchToTasks(addTaskAC(todoList_ID, title));
  }
  const changeTaskTitle = (todoList_ID: string, task_ID: string, title: string) => {
    dispatchToTasks(changeTaskTitleAC(todoList_ID, task_ID, title));
  };
  const changeTaskStatus = (todoList_ID: string, task_ID: string, taskStatus: boolean) => {
    dispatchToTasks(changeTaskStatusAC(todoList_ID, task_ID, taskStatus));
  };
  const removeTask = (todoList_ID: string, task_ID: string) => {
    dispatchToTasks(removeTaskAC(todoList_ID, task_ID));
  };

  const addTodoList = (title: string) => {
    const action = addTodoListAC(title);
    dispatchToTodoLists(action);
    dispatchToTasks(action);
  };
  const changeTodoListTitle = (todoList_ID: string, title: string) => {
    dispatchToTodoLists(changeTodoListTitleAC(todoList_ID, title));
  };
  const changeFilter = (todoList_ID: string, filter: FilterValueType) => {
    dispatchToTodoLists(changeTodoListFilterAC(todoList_ID, filter));
  };
  const removeTodoList = (todoList_ID: string) => {
    dispatchToTodoLists(removeTodoListAC(todoList_ID));
    dispatchToTasks(removeTodoListAC(todoList_ID));
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
