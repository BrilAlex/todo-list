import React, {ChangeEvent} from "react";
import {FilterValueType, TaskType} from "../../App";
import {AddItemForm} from "../AddItemForm/AddItemForm";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import {Button, Checkbox, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";

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

export const TodoList = (props: TodoListPropsType) => {
  const addTask = (title: string) => {
    props.addTask(props.id, title);
  };

  const changeTodoListTitle = (newTitle: string) => {
    props.changeTodoListTitle(props.id, newTitle);
  };

  const changeFilter = (filterValue: FilterValueType) => {
    props.changeFilter(props.id, filterValue);
  };

  const removeTodoList = () => props.removeTodoList(props.id);

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
        {props.tasks.map((t) => {
          const changeTaskTitle = (newTitle: string) => {
            props.changeTaskTitle(props.id, t.id, newTitle);
          };

          const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
            props.changeTaskStatus(props.id, t.id, e.currentTarget.checked);
          };

          const removeTask = () => props.removeTask(props.id, t.id);

          return (
            <div key={t.id}>
              <Checkbox checked={t.isDone} onChange={changeTaskStatus}/>
              <IconButton onClick={removeTask}>
                <Delete/>
              </IconButton>
              <EditableSpan value={t.title} setNewValue={changeTaskTitle}/>
            </div>
          );
        })}
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
};