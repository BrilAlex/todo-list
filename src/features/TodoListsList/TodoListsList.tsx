import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../app/store";
import {
  changeTodoListFilterAC,
  fetchTodoListsTC, FilterValueType,
  TodoListDomainType
} from "./todoListsReducer";
import {TasksType} from "./tasksReducer";
import React, {FC, useCallback, useEffect} from "react";
import {TaskStatuses} from "../../api/todoListsApi";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {TodoList} from "./ToDoList/TodoList";
import {Navigate} from "react-router-dom";
import {addTask, removeTask, updateTask} from "./tasksSagas";
import {addTodoList, changeTodoListTitle, removeTodoList} from "./todoListsSagas";

type PropsType = {
  demoMode?: boolean
};

export const TodoListsList: FC<PropsType> = ({demoMode = false}) => {
  const isLoggedIn = useSelector<AppStateType, boolean>(state => state.auth.isLoggedIn);
  const todoLists = useSelector<AppStateType, Array<TodoListDomainType>>(state => state.todoLists);
  const tasks = useSelector<AppStateType, TasksType>(state => state.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    if (demoMode || !isLoggedIn) {
      return;
    }
    dispatch(fetchTodoListsTC());
  }, [dispatch, demoMode, isLoggedIn]);

  const addTaskCallback = useCallback((todoList_ID: string, title: string) => {
    dispatch(addTask(todoList_ID, title));
  }, [dispatch]);

  const changeTaskTitle = useCallback((todoList_ID: string, task_ID: string, newTitle: string) => {
    dispatch(updateTask(todoList_ID, task_ID, {title: newTitle}));
  }, [dispatch]);

  const changeTaskStatus = useCallback((todoList_ID: string, task_ID: string, newStatus: TaskStatuses) => {
    dispatch(updateTask(todoList_ID, task_ID, {status: newStatus}));
  }, [dispatch]);

  const removeTaskCallback = useCallback((todoList_ID: string, task_ID: string) => {
    const thunk = removeTask(todoList_ID, task_ID);
    dispatch(thunk);
  }, [dispatch]);

  const addTodoListCallback = useCallback((title: string) => {
    dispatch(addTodoList(title));
  }, [dispatch]);

  const changeTodoListTitleCallback = useCallback((todoList_ID: string, newTitle: string) => {
    dispatch(changeTodoListTitle(todoList_ID, newTitle));
  }, [dispatch]);

  const changeFilter = useCallback((todoList_ID: string, filterValue: FilterValueType) => {
    dispatch(changeTodoListFilterAC(todoList_ID, filterValue));
  }, [dispatch]);

  const removeTodoListCallback = useCallback((todoList_ID: string) => {
    dispatch(removeTodoList(todoList_ID));
  }, [dispatch]);

  if (!isLoggedIn) {
    return <Navigate to={"/login"}/>;
  }

  return (
    <>
      <Grid container style={{padding: "20px"}}>
        <AddItemForm addItem={addTodoListCallback}/>
      </Grid>
      <Grid container spacing={3}>
        {todoLists.map(tl => {
          return (
            <Grid key={tl.id} item>
              <Paper elevation={5} style={{padding: "15px"}}>
                <TodoList
                  todoList={tl}
                  tasks={tasks[tl.id]}
                  addTask={addTaskCallback}
                  changeTaskTitle={changeTaskTitle}
                  changeTodoListTitle={changeTodoListTitleCallback}
                  changeTaskStatus={changeTaskStatus}
                  removeTask={removeTaskCallback}
                  changeFilter={changeFilter}
                  removeTodoList={removeTodoListCallback}
                  demoMode={demoMode}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
