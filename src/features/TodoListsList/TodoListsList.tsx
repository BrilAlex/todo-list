import {useDispatch, useSelector} from "react-redux";
import {FilterValueType} from "./todoListsReducer";
import {addTaskTC, removeTaskTC, updateTaskTC} from "./tasksReducer";
import React, {FC, useCallback, useEffect} from "react";
import {TaskStatuses} from "../../api/types";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {TodoList} from "./ToDoList/TodoList";
import {Navigate} from "react-router-dom";
import {authSelectors} from "../Auth";
import {todoListsActions, todoListsSelectors} from "./index";
import {useActions} from "../../utils/reduxUtils";

type PropsType = {
  demoMode?: boolean
};

export const TodoListsList: FC<PropsType> = ({demoMode = false}) => {
  const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn);
  const todoLists = useSelector(todoListsSelectors.selectTodoLists);
  const tasks = useSelector(todoListsSelectors.selectTasks);
  const {
    fetchTodoLists,
    addTodoList,
    changeTodoListTitle,
    changeTodoListFilter,
    removeTodoList
  } = useActions(todoListsActions);
  const dispatch = useDispatch();

  useEffect(() => {
    if (demoMode || !isLoggedIn) {
      return;
    }
    fetchTodoLists();
  }, [fetchTodoLists, demoMode, isLoggedIn]);

  const addTask = useCallback((todoList_ID: string, title: string) => {
    dispatch(addTaskTC({todoList_ID, title}));
  }, [dispatch]);

  const changeTaskTitle = useCallback((todoList_ID: string, task_ID: string, newTitle: string) => {
    dispatch(updateTaskTC({todoList_ID, task_ID, model: {title: newTitle}}));
  }, [dispatch]);

  const changeTaskStatus = useCallback((todoList_ID: string, task_ID: string, newStatus: TaskStatuses) => {
    dispatch(updateTaskTC({todoList_ID, task_ID, model: {status: newStatus}}));
  }, [dispatch]);

  const removeTask = useCallback((todoList_ID: string, task_ID: string) => {
    const thunk = removeTaskTC({todoList_ID, task_ID});
    dispatch(thunk);
  }, [dispatch]);

  const addTodoListCallback = useCallback((title: string) => {
    addTodoList(title);
  }, [addTodoList]);

  const changeTodoListTitleCallback = useCallback((todoList_ID: string, newTitle: string) => {
    changeTodoListTitle({todoList_ID, newTitle});
  }, [changeTodoListTitle]);

  const changeTodoListFilterCallback = useCallback((todoList_ID: string, filterValue: FilterValueType) => {
    changeTodoListFilter({id: todoList_ID, filter: filterValue});
  }, [changeTodoListFilter]);

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
                  addTask={addTask}
                  changeTaskTitle={changeTaskTitle}
                  changeTodoListTitle={changeTodoListTitleCallback}
                  changeTaskStatus={changeTaskStatus}
                  removeTask={removeTask}
                  changeFilter={changeTodoListFilterCallback}
                  removeTodoList={removeTodoList}
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
