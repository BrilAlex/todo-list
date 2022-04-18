import React, {useCallback} from "react";
import {FilterValueType, TaskType} from "../../App";
import {AddItemForm} from "../AddItemForm/AddItemForm";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {Task} from "../Task/Task";

type TodoListPropsType = {
  id: string
  title: string
  tasks: Array<TaskType>
  filter: FilterValueType
  addTask: (todoList_ID: string, title: string) => void
  changeTaskTitle: (todoList_ID: string, task_ID: string, newTitle: string) => void
  changeTaskStatus: (todoList_ID: string, task_ID: string, isDone: boolean) => void
  removeTask: (todoList_ID: string, task_ID: string) => void
  changeTodoListTitle: (todoList_ID: string, newTitle: string) => void
  changeFilter: (todoList_ID: string, filterValue: FilterValueType) => void
  removeTodoList: (todoList_ID: string) => void
};

export const TodoList = React.memo((props: TodoListPropsType) => {
  console.log("TodoList was called");

  let tasksForTodoList = props.tasks;
  if (props.filter === "active") {
    tasksForTodoList = tasksForTodoList.filter(t => !t.isDone);
  }
  if (props.filter === "completed") {
    tasksForTodoList = tasksForTodoList.filter(t => t.isDone);
  }

  const changeTodoListTitle = useCallback((newTitle: string) => {
    props.changeTodoListTitle(props.id, newTitle);
  }, [props.changeTodoListTitle, props.id]);

  const changeFilter = useCallback((filterValue: FilterValueType) => {
    props.changeFilter(props.id, filterValue);
  }, [props.changeFilter, props.id]);

  const removeTodoList = useCallback(() => {
    props.removeTodoList(props.id)
  }, [props.removeTodoList, props.id]);

  const addTask = useCallback((title: string) => {
    props.addTask(props.id, title);
  }, [props.addTask, props.id]);

  const changeTaskTitle = useCallback((task_ID: string, newTitle: string) => {
    props.changeTaskTitle(props.id, task_ID, newTitle);
  }, [props.changeTaskTitle, props.id]);

  const changeTaskStatus = useCallback((task_ID: string, newIsDone: boolean) => {
    props.changeTaskStatus(props.id, task_ID, newIsDone);
  }, [props.changeTaskStatus, props.id]);

  const removeTask = useCallback((task_ID: string) => {
    props.removeTask(props.id, task_ID);
  }, [props.removeTask, props.id]);

  return (
    <div>
      <h3>
        <EditableSpan value={props.title} setNewValue={changeTodoListTitle}/>
        <IconButton onClick={removeTodoList}>
          <Delete/>
        </IconButton>
      </h3>
      <AddItemForm addItem={addTask}/>
      <div>
        {tasksForTodoList.map((t) =>
          <Task
            key={t.id}
            task={t}
            changeTaskTitle={changeTaskTitle}
            changeTaskStatus={changeTaskStatus}
            removeTask={removeTask}
          />
        )}
      </div>
      <div>
        <Button
          onClick={() => changeFilter("all")}
          variant={props.filter === "all" ? "outlined" : "text"}
          color={"primary"}
        >
          All
        </Button>
        <Button
          onClick={() => changeFilter("active")}
          variant={props.filter === "active" ? "outlined" : "text"}
          color={"error"}
        >
          Active
        </Button>
        <Button
          onClick={() => changeFilter("completed")}
          variant={props.filter === "completed" ? "outlined" : "text"}
          color={"success"}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});