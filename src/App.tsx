import React, {useCallback, useEffect} from 'react';
import './App.css';
import {TodoList} from "./components/ToDoList/TodoList";
import {AddItemForm} from "./components/AddItemForm/AddItemForm";
import {ButtonAppBar} from "./components/AppBar/ButtonAppBar";
import {Container, Grid, Paper} from "@mui/material";
import {
  addTodoListTC,
  changeTodoListFilterAC,
  changeTodoListTitleTC,
  fetchTodoListsThunk,
  FilterValueType,
  removeTodoListTC,
  TodoListDomainType,
} from "./store/todoListsReducer";
import {
  addTaskTC,
  removeTaskTC,
  TasksType, updateTaskTC
} from "./store/tasksReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "./store/store";
import {TaskStatuses} from "./api/todoListsApi";


function App() {
  const todoLists = useSelector<AppStateType, Array<TodoListDomainType>>(state => state.todoLists);
  const tasks = useSelector<AppStateType, TasksType>(state => state.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTodoListsThunk);
  }, [dispatch]);

  const addTask = useCallback((todoList_ID: string, title: string) => {
    dispatch(addTaskTC(todoList_ID, title));
  }, [dispatch]);

  const changeTaskTitle = useCallback((todoList_ID: string, task_ID: string, newTitle: string) => {
    dispatch(updateTaskTC(todoList_ID, task_ID, {title: newTitle}));
  }, [dispatch]);

  const changeTaskStatus = useCallback((todoList_ID: string, task_ID: string, newStatus: TaskStatuses) => {
    dispatch(updateTaskTC(todoList_ID, task_ID, {status: newStatus}));
  }, [dispatch]);

  const removeTask = useCallback((todoList_ID: string, task_ID: string) => {
    const thunk = removeTaskTC(todoList_ID, task_ID);
    dispatch(thunk);
  }, [dispatch]);

  const addTodoList = useCallback((title: string) => {
    dispatch(addTodoListTC(title));
  }, [dispatch]);

  const changeTodoListTitle = useCallback((todoList_ID: string, newTitle: string) => {
    dispatch(changeTodoListTitleTC(todoList_ID, newTitle));
  }, [dispatch]);

  const changeFilter = useCallback((todoList_ID: string, filterValue: FilterValueType) => {
    dispatch(changeTodoListFilterAC(todoList_ID, filterValue));
  }, [dispatch]);

  const removeTodoList = useCallback((todoList_ID: string) => {
    dispatch(removeTodoListTC(todoList_ID));
  }, [dispatch]);

  return (
    <div className="App">
      <ButtonAppBar/>
      <Container fixed>
        <Grid container style={{padding: "20px"}}>
          <AddItemForm addItem={addTodoList}/>
        </Grid>
        <Grid container spacing={3}>
          {todoLists.map(tl => {
            return (
              <Grid key={tl.id} item>
                <Paper elevation={5} style={{padding: "15px"}}>
                  <TodoList
                    id={tl.id}
                    title={tl.title}
                    tasks={tasks[tl.id]}
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
