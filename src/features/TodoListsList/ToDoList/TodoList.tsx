import React, {useCallback} from "react";
import {
  AddItemForm,
  AddItemFormSubmitHelperType
} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton, Paper} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {Task} from "./Task/Task";
import {TaskStatuses} from "../../../api/types";
import {FilterValueType, TodoListDomainType} from "../todoListsReducer";
import {TaskDomainType} from "../tasksReducer";
import {useActions, useAppDispatch} from "../../../utils/reduxUtils";
import {tasksActions, todoListsActions} from "../index";

type TodoListPropsType = {
  todoList: TodoListDomainType
  tasks: Array<TaskDomainType>
  demoMode?: boolean
};
type FilterButtonColorType =
  "inherit"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning"
  | undefined

export const TodoList = React.memo(({demoMode = false, ...props}: TodoListPropsType) => {
  let tasksForTodoList = props.tasks;
  if (props.todoList.filter === "active") {
    tasksForTodoList = tasksForTodoList.filter(t => t.status === TaskStatuses.New);
  }
  if (props.todoList.filter === "completed") {
    tasksForTodoList = tasksForTodoList.filter(t => t.status === TaskStatuses.Completed);
  }

  const dispatch = useAppDispatch();
  const {changeTodoListTitle, changeTodoListFilter, removeTodoList} = useActions(todoListsActions);

  const changeTitle = useCallback((newTitle: string) => {
    changeTodoListTitle({todoList_ID: props.todoList.id, newTitle});
  }, [changeTodoListTitle, props.todoList.id]);

  const changeFilter = useCallback((filterValue: FilterValueType) => {
    changeTodoListFilter({id: props.todoList.id, filter: filterValue});
  }, [changeTodoListFilter, props.todoList.id]);

  const deleteTodoList = useCallback(() => {
    removeTodoList(props.todoList.id)
  }, [removeTodoList, props.todoList.id]);

  const addTaskCallback = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {
    const resultAction = await dispatch(tasksActions.addTask({
      todoList_ID: props.todoList.id, title
    }));

    if (tasksActions.addTask.rejected.match(resultAction)) {
      if (resultAction.payload?.errors.length) {
        const errorMessage = resultAction.payload.errors[0];
        helper.setError(errorMessage);
      } else {
        helper.setError("Some error occurred");
      }
    } else {
      helper.setValue("");
    }

  }, [dispatch, props.todoList.id]);

  const renderFilterButton = (
    buttonFilter: FilterValueType,
    color: FilterButtonColorType,
    text: string
  ) => {
    return (
      <Button
        onClick={() => changeFilter(buttonFilter)}
        variant={props.todoList.filter === buttonFilter ? "outlined" : "text"}
        color={color}
      >
        {text}
      </Button>
    );
  };

  return (
    <Paper elevation={5} style={{padding: "15px", position: "relative"}}>
      <IconButton
        onClick={deleteTodoList}
        disabled={props.todoList.entityStatus === "loading"}
        style={{position: "absolute", top: "5px", right: "5px"}}
      >
        <Delete fontSize={"small"}/>
      </IconButton>
      <h3>
        <EditableSpan
          value={props.todoList.title}
          setNewValue={changeTitle}
          disabled={props.todoList.entityStatus === "loading"}
        />
      </h3>
      <AddItemForm addItem={addTaskCallback} disabled={props.todoList.entityStatus === "loading"}/>
      <div>
        {tasksForTodoList.map((t) =>
          <Task key={t.id} task={t} todoList_ID={props.todoList.id}/>
        )}
      </div>
      <div style={{paddingTop: "10px"}}>
        {renderFilterButton("all", "primary", "All")}
        {renderFilterButton("active", "error", "Active")}
        {renderFilterButton("completed", "success", "Completed")}
      </div>
    </Paper>
  );
});