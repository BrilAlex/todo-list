import {useSelector} from "react-redux";
import React, {FC, useCallback, useEffect} from "react";
import {Grid} from "@mui/material";
import {AddItemForm, AddItemFormSubmitHelperType} from "../../components/AddItemForm/AddItemForm";
import {TodoList} from "./ToDoList/TodoList";
import {Navigate} from "react-router-dom";
import {authSelectors} from "../Auth";
import {todoListsActions, todoListsSelectors} from "./index";
import {useActions, useAppDispatch} from "../../utils/reduxUtils";

type PropsType = {
  demoMode?: boolean
};

export const TodoListsList: FC<PropsType> = ({demoMode = false}) => {
  const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn);
  const todoLists = useSelector(todoListsSelectors.selectTodoLists);
  const tasks = useSelector(todoListsSelectors.selectTasks);
  const dispatch = useAppDispatch();
  const {fetchTodoLists} = useActions(todoListsActions);

  useEffect(() => {
    if (demoMode || !isLoggedIn) {
      return;
    }
    fetchTodoLists();
  }, [fetchTodoLists, demoMode, isLoggedIn]);

  const addTodoListCallback = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {
    const resultAction = await dispatch(todoListsActions.addTodoList(title));

    if (todoListsActions.addTodoList.rejected.match(resultAction)) {
      if (resultAction.payload?.errors.length) {
        const errorMessage = resultAction.payload.errors[0];
        helper.setError(errorMessage);
      } else {
        helper.setError("Some error occurred");
      }
    } else {
      helper.setValue("");
    }
  }, [dispatch]);

  if (!isLoggedIn) {
    return <Navigate to={"/login"}/>;
  }

  return (
    <>
      <Grid container style={{padding: "20px"}}>
        <AddItemForm addItem={addTodoListCallback}/>
      </Grid>
      <Grid
        container spacing={3}
        style={{flexWrap: "nowrap", overflowX: "scroll", padding: "20px"}}
      >
        {todoLists.map(tl => {
          return (
            <Grid key={tl.id} item>
              <div style={{width: "300px"}}>
                <TodoList
                  todoList={tl}
                  tasks={tasks[tl.id]}
                  demoMode={demoMode}
                />
              </div>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
