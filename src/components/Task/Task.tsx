import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import {TaskType} from "../../App";

type TaskPropsType = {
  task: TaskType
  changeTaskTitle: (task_ID: string, newTitle: string) => void
  changeTaskStatus: (task_ID: string, newIsDone: boolean) => void
  removeTask: (task_ID: string) => void
};

export const Task = React.memo((props: TaskPropsType) => {
  console.log("Task was called");
  const {id, title, isDone} = props.task;

  const changeTaskTitle = useCallback((newTitle: string) => {
    props.changeTaskTitle(id, newTitle);
  }, [props.changeTaskTitle, id]);

  const changeTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    props.changeTaskStatus(id, e.currentTarget.checked);
  }, [props.changeTaskStatus, id]);

  const removeTask = useCallback(() => {
    props.removeTask(id);
  }, [props.removeTask, id]);

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