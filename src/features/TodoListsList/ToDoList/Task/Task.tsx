import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {TaskStatuses} from "../../../../api/types";
import {TaskDomainType} from "../../tasksReducer";
import {useActions} from "../../../../utils/reduxUtils";
import {tasksActions} from "../../index";

type TaskPropsType = {
  task: TaskDomainType
  todoList_ID: string
};

export const Task = React.memo((props: TaskPropsType) => {
  const {id, title, status, entityStatus} = props.task;
  const {updateTask, removeTask} = useActions(tasksActions);

  const changeTaskTitle = useCallback((newTitle: string) => {
    updateTask({
      todoList_ID: props.todoList_ID,
      task_ID: id,
      model: {title: newTitle},
    });
  }, [updateTask, props.todoList_ID, id]);

  const changeTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
    updateTask({
      todoList_ID: props.todoList_ID,
      task_ID: id,
      model: {status: newStatus},
    });
  }, [updateTask, props.todoList_ID, id]);

  const deleteTask = useCallback(() => {
    removeTask({todoList_ID: props.todoList_ID, task_ID: id});
  }, [removeTask, props.todoList_ID, id]);

  return (
    <div style={{position: "relative"}}>
      <Checkbox
        checked={status === TaskStatuses.Completed}
        onChange={changeTaskStatus}
        disabled={entityStatus === "loading"}
      />
      <EditableSpan
        value={title}
        setNewValue={changeTaskTitle}
        disabled={entityStatus === "loading"}
      />
      <IconButton
        onClick={deleteTask}
        disabled={entityStatus === "loading"}
        style={{position: "absolute", top: "2px", right: "2px"}}
      >
        <Delete fontSize={"small"}/>
      </IconButton>
    </div>
  );
});
