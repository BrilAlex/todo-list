import React, {ChangeEvent} from "react";
import {FilterValueType, TaskType} from "../../App";
import styles from "./TodoList.module.css";
import {AddItemForm} from "../AddItemForm/AddItemForm";
import {EditableSpan} from "../EditableSpan/EditableSpan";

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
        <button onClick={removeTodoList}>X</button>
      </h3>
      <AddItemForm addItem={addTask}/>
      <ul>
        {props.tasks.map((t) => {
          const changeTaskTitle = (newTitle: string) => {
            props.changeTaskTitle(props.id, t.id, newTitle);
          };

          const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
            props.changeTaskStatus(props.id, t.id, e.currentTarget.checked);
          };

          const removeTask = () => props.removeTask(props.id, t.id);

          return (
            <li key={t.id} className={t.isDone ? styles.isDone : ""}>
              <button onClick={removeTask}>X</button>
              <input type={"checkbox"} checked={t.isDone} onChange={changeTaskStatus}/>
              <EditableSpan value={t.title} setNewValue={changeTaskTitle}/>
            </li>
          );
        })}
      </ul>
      <div>
        <button
          onClick={() => changeFilter("all")}
          className={props.filter === "all" ? styles.activeFilter : ""}
        >
          All
        </button>
        <button
          onClick={() => changeFilter("active")}
          className={props.filter === "active" ? styles.activeFilter : ""}
        >
          Active
        </button>
        <button
          onClick={() => changeFilter("completed")}
          className={props.filter === "completed" ? styles.activeFilter : ""}
        >
          Completed
        </button>
      </div>
    </div>
  );
};