import React, {ChangeEvent} from "react";
import {FilterValueType, TaskType} from "../../App";
import {AddItemForm} from "../AddItemForm/AddItemForm";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import {Button, Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";

type TodoListPropsType = {
  id: string
  title: string
  tasks: Array<TaskType>
  addTask: (todoList_ID: string, taskTitle: string) => void
  changeTaskTitle: (todoList_ID: string, task_ID: string, taskTitle: string) => void
  changeTaskStatus: (todoList_ID: string, task_ID: string, taskStatus: boolean) => void
  removeTask: (todoList_ID: string, task_ID: string) => void
  filter: FilterValueType
  changeTodoListTitle: (todoList_ID: string, todoListTitle: string) => void
  changeFilter: (todoList_ID: string, filter: FilterValueType) => void
  removeTodoList: (todoList_ID: string) => void
};

export const TodoList = (props: TodoListPropsType) => {
  const todoList_ID = props.id;

  const addTaskHandler = (title: string) => props.addTask(todoList_ID, title);
  const changeTodoListTittleHandler = (title: string) =>
    props.changeTodoListTitle(todoList_ID, title);
  const changeFilterHandler = (filter: FilterValueType) =>
    props.changeFilter(todoList_ID, filter);
  const removeTodoListHandler = () => props.removeTodoList(todoList_ID);

  return (
    <div>
      <h3>
        <EditableSpan value={props.title} callback={changeTodoListTittleHandler}/>
        <IconButton onClick={removeTodoListHandler}>
          <Delete/>
        </IconButton>
      </h3>
      <AddItemForm callback={addTaskHandler}/>
      <div>
        {props.tasks.map(t => {
          const changeTaskTitleHandler = (title: string) =>
            props.changeTaskTitle(todoList_ID, t.id, title);
          const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) =>
            props.changeTaskStatus(todoList_ID, t.id, e.currentTarget.checked);
          const removeTaskHandler = () => props.removeTask(todoList_ID, t.id);

          return <div key={t.id} className={t.isDone ? "isDone" : ""}>
            <Checkbox
              checked={t.isDone}
              onChange={changeTaskStatusHandler}
              color={"primary"}
            />
            <EditableSpan value={t.title} callback={changeTaskTitleHandler}/>
            <IconButton onClick={removeTaskHandler}>
              <Delete/>
            </IconButton>
          </div>
        })}
      </div>
      <div>
        <Button
          variant={props.filter === "All" ? "outlined" : "text"}
          onClick={() => changeFilterHandler("All")}
          color={"default"}
        >
          All
        </Button>
        <Button
          variant={props.filter === "Active" ? "outlined" : "text"}
          onClick={() => changeFilterHandler("Active")}
          color={"primary"}
        >
          Active
        </Button>
        <Button
          variant={props.filter === "Completed" ? "outlined" : "text"}
          onClick={() => changeFilterHandler("Completed")}
          color={"secondary"}
        >
          Completed
        </Button>
      </div>
    </div>
  );
};