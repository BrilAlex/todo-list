import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {TaskStatuses} from "../../../../api/types";
import {TaskDomainType} from "../../tasksReducer";

type TaskPropsType = {
  task: TaskDomainType
  todoList_ID: string
  changeTaskTitle: (todoList_ID: string, task_ID: string, newTitle: string) => void
  changeTaskStatus: (todoList_ID: string, task_ID: string, newStatus: TaskStatuses) => void
  removeTask: (todoList_ID: string, task_ID: string) => void
};

export const Task = React.memo((props: TaskPropsType) => {
  const {id, title, status, entityStatus} = props.task;

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
      <Checkbox
        checked={status === TaskStatuses.Completed}
        onChange={changeTaskStatus}
        disabled={entityStatus === "loading"}
      />
      <IconButton onClick={removeTask} disabled={entityStatus === "loading"}>
        <Delete/>
      </IconButton>
      <EditableSpan
        value={title}
        setNewValue={changeTaskTitle}
        disabled={entityStatus === "loading"}
      />
    </div>
  );
});