import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {FilterValueType, TaskType} from "../App";
import styles from "./ToDoList.module.css";

type ToDoListPropsType = {
  title: string
  tasks: Array<TaskType>
  filter: FilterValueType
  addTask: (title: string) => void
  changeTaskStatus: (task_ID: string, isDone: boolean) => void
  removeTask: (task_ID: string) => void
  changeFilter: (filterValue: FilterValueType) => void
};

export const ToDoList = (props: ToDoListPropsType) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addTask = () => {
    const trimmedTitle = newTaskTitle.trim();
    if (trimmedTitle !== "") {
      props.addTask(trimmedTitle);
    } else {
      setError("Title is required");
    }
    setNewTaskTitle("");
  };

  const changeFilterHandler = (filterValue: FilterValueType) => {
    props.changeFilter(filterValue);
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(e.currentTarget.value);
  };

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    setError(null);
    if (e.key === "Enter") addTask();
  };

  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input
          value={newTaskTitle}
          onChange={onChangeHandler}
          onKeyPress={onKeyPressHandler}
          className={error ? styles.error : ""}
        />
        <button onClick={addTask}>+</button>
        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>
      <ul>
        {props.tasks.map((t) => {
          const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
            props.changeTaskStatus(t.id, e.currentTarget.checked);
          };
          const removeTaskHandler = () => props.removeTask(t.id);

          return (
            <li key={t.id} className={t.isDone ? styles.isDone : ""}>
              <button onClick={removeTaskHandler}>X</button>
              <input type={"checkbox"} checked={t.isDone} onChange={changeStatusHandler}/>
              <span>{t.title}</span>
            </li>
          );
        })}
      </ul>
      <div>
        <button
          onClick={() => changeFilterHandler("all")}
          className={props.filter === "all" ? styles.activeFilter : ""}
        >
          All
        </button>
        <button
          onClick={() => changeFilterHandler("active")}
          className={props.filter === "active" ? styles.activeFilter : ""}
        >
          Active
        </button>
        <button
          onClick={() => changeFilterHandler("completed")}
          className={props.filter === "completed" ? styles.activeFilter : ""}
        >
          Completed
        </button>
      </div>
    </div>
  );
};