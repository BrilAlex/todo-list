import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import {TaskType} from "../../App";

type TaskPropsType = {
  task: TaskType
  todoList_ID: string
  changeTaskTitle: (todoList_ID: string, task_ID: string, newTitle: string) => void
  changeTaskStatus: (todoList_ID: string, task_ID: string, isDone: boolean) => void
  removeTask: (todoList_ID: string, task_ID: string) => void
};

export const Task = React.memo((props: TaskPropsType) => {
  console.log("Task was called");
  const {id, title, isDone} = props.task;

  const changeTaskTitle = useCallback((newTitle: string) => {
    props.changeTaskTitle(props.todoList_ID, id, newTitle);
  }, [props.changeTaskTitle, props.todoList_ID, id]);

  const changeTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    props.changeTaskStatus(props.todoList_ID, id, e.currentTarget.checked);
  }, [props.changeTaskStatus, props.todoList_ID, id]);

  const removeTask = useCallback(() => {
    props.removeTask(props.todoList_ID, id);
  }, [props.removeTask, props.todoList_ID, id]);

  return (
    <div>
      <Checkbox checked={isDone} onChange={changeTaskStatus}/>
      <IconButton onClick={removeTask}>
        <Delete/>
      </IconButton>
      <EditableSpan value={title} setNewValue={changeTaskTitle}/>
    </div>
  );
});