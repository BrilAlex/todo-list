import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {TaskStatuses, TaskType} from "../../../../api/todoListsApi";

type TaskPropsType = {
  task: TaskType
  todoList_ID: string
  changeTaskTitle: (todoList_ID: string, task_ID: string, newTitle: string) => void
  changeTaskStatus: (todoList_ID: string, task_ID: string, newStatus: TaskStatuses) => void
  removeTask: (todoList_ID: string, task_ID: string) => void
};

export const Task = React.memo((props: TaskPropsType) => {
  const {id, title, status} = props.task;

  const changeTaskTitle = useCallback((newTitle: string) => {
    props.changeTaskTitle(props.todoList_ID, id, newTitle);
  }, [props.changeTaskTitle, props.todoList_ID, id]);

  const changeTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
    props.changeTaskStatus(props.todoList_ID, id, newStatus);
  }, [props.changeTaskStatus, props.todoList_ID, id]);

  const removeTask = useCallback(() => {
    props.removeTask(props.todoList_ID, id);
  }, [props.removeTask, props.todoList_ID, id]);

  return (
    <div>
      <Checkbox checked={status === TaskStatuses.Completed} onChange={changeTaskStatus}/>
      <IconButton onClick={removeTask}>
        <Delete/>
      </IconButton>
      <EditableSpan value={title} setNewValue={changeTaskTitle}/>
    </div>
  );
});