import React, {useCallback} from 'react';
import './App.css';
import {TodoList} from "./components/ToDoList/TodoList";
import {AddItemForm} from "./components/AddItemForm/AddItemForm";
import {ButtonAppBar} from "./components/AppBar/ButtonAppBar";
import {Container, Grid, Paper} from "@mui/material";
import {
  addTodoListAC,
  changeTodoListFilterAC,
  changeTodoListTitleAC, FilterValueType,
  removeTodoListAC, TodoListDomainType,
} from "./store/todoListsReducer";
import {
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
  TasksType
} from "./store/tasksReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "./store/store";
import {TaskStatuses} from "./api/todoListsApi";


function App() {
  const todoLists = useSelector<AppStateType, Array<TodoListDomainType>>(state => state.todoLists);
  const tasks = useSelector<AppStateType, TasksType>(state => state.tasks);
  const dispatch = useDispatch();

  const addTask = useCallback((todoList_ID: string, title: string) => {
    dispatch(addTaskAC(todoList_ID, title));
  }, [dispatch]);

  const changeTaskTitle = useCallback((todoList_ID: string, task_ID: string, newTitle: string) => {
    dispatch(changeTaskTitleAC(todoList_ID, task_ID, newTitle));
  }, [dispatch]);

  const changeTaskStatus = useCallback((todoList_ID: string, task_ID: string, newStatus: TaskStatuses) => {
    dispatch(changeTaskStatusAC(todoList_ID, task_ID, newStatus));
  }, [dispatch]);

  const removeTask = useCallback((todoList_ID: string, task_ID: string) => {
    dispatch(removeTaskAC(todoList_ID, task_ID));
  }, [dispatch]);

  const addTodoList = useCallback((title: string) => {
    dispatch(addTodoListAC(title));
  }, [dispatch]);

  const changeTodoListTitle = useCallback((todoList_ID: string, newTitle: string) => {
    dispatch(changeTodoListTitleAC(todoList_ID, newTitle));
  }, [dispatch]);

  const changeFilter = useCallback((todoList_ID: string, filterValue: FilterValueType) => {
    dispatch(changeTodoListFilterAC(todoList_ID, filterValue));
  }, [dispatch]);

  const removeTodoList = useCallback((todoList_ID: string) => {
    dispatch(removeTodoListAC(todoList_ID));
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
