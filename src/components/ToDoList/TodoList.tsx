import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {FilterValueType, TaskType} from "../../App";
import styles from "./TodoList.module.css";

type TodoListPropsType = {
  id: string
  title: string
  tasks: Array<TaskType>
  filter: FilterValueType
  addTask: (todoList_ID: string, title: string) => void
  changeTaskStatus: (todoList_ID: string, task_ID: string, isDone: boolean) => void
  removeTask: (todoList_ID: string, task_ID: string) => void
  changeFilter: (todoList_ID: string, filterValue: FilterValueType) => void
  removeTodoList: (todoList_ID: string) => void
};

export const TodoList = (props: TodoListPropsType) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addTask = () => {
    const trimmedTitle = newTaskTitle.trim();
    if (trimmedTitle !== "") {
      props.addTask(props.id, trimmedTitle);
    } else {
      setError("Title is required");
    }
    setNewTaskTitle("");
  };

  const changeFilterHandler = (filterValue: FilterValueType) => {
    props.changeFilter(props.id, filterValue);
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(e.currentTarget.value);
  };

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    setError(null);
    if (e.key === "Enter") addTask();
  };

  const removeTodoList = () => props.removeTodoList(props.id);

  return (
    <div>
      <h3>
        {props.title}
        <button onClick={removeTodoList}>X</button>
      </h3>
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
            props.changeTaskStatus(props.id, t.id, e.currentTarget.checked);
          };
          const removeTaskHandler = () => props.removeTask(props.id, t.id);

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