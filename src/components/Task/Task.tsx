import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskType} from "../../AppWithRedux";

type TaskPropsType = {
  task: TaskType
  changeTaskTitle: (task_ID: string, taskTitle: string) => void
  changeTaskStatus: (task_ID: string, taskStatus: boolean) => void
  removeTask: (task_ID: string) => void
};

export const Task = React.memo((props: TaskPropsType) => {
  console.log("Task called");
  const {
    task,
    changeTaskTitle,
    changeTaskStatus,
    removeTask,
  } = props;

  const changeTitleCallback = useCallback((title: string) => {
    changeTaskTitle(task.id, title)
  }, [changeTaskTitle, task.id]);
  const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    changeTaskStatus(task.id, e.currentTarget.checked)
  }, [changeTaskStatus, task.id]);
  const onClickHandler = useCallback(() => {
    removeTask(task.id)
  }, [removeTask, task.id]);

  return (
    <div key={task.id} className={task.isDone ? "isDone" : ""}>
      <Checkbox
        checked={task.isDone}
        onChange={onChangeHandler}
        color={"primary"}
      />
      <EditableSpan value={task.title} callback={changeTitleCallback}/>
      <IconButton onClick={onClickHandler}>
        <Delete/>
      </IconButton>
    </div>
  );
});