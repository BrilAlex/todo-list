import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {FilterValueType, TaskType} from "../App";

type ToDoListPropsType = {
  title: string
  tasks: Array<TaskType>
  addTask: (title: string) => void
  removeTask: (task_ID: string) => void
  changeFilter: (filterValue: FilterValueType) => void
};

export const ToDoList = (props: ToDoListPropsType) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const addTaskHandler = () => {
    props.addTask(newTaskTitle);
    setNewTaskTitle("");
  };

  const changeFilterHandler = (filterValue: FilterValueType) => {
    props.changeFilter(filterValue);
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(e.currentTarget.value);
  };

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTaskHandler();
  };

  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input
          value={newTaskTitle}
          onChange={onChangeHandler}
          onKeyPress={onKeyPressHandler}
        />
        <button onClick={addTaskHandler}>+</button>
      </div>
      <ul>
        {props.tasks.map((t) => {
          const removeTaskHandler = () => {
            props.removeTask(t.id);
          };

          return (
            <li key={t.id}>
              <button onClick={removeTaskHandler}>X</button>
              <input type={"checkbox"} checked={t.isDone}/>
              <span>{t.title}</span>
            </li>
          );
        })}
      </ul>
      <div>
        <button onClick={() => changeFilterHandler("all")}>All</button>
        <button onClick={() => changeFilterHandler("active")}>Active</button>
        <button onClick={() => changeFilterHandler("completed")}>Completed</button>
      </div>
    </div>
  );
};