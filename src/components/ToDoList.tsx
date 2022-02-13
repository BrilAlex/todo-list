import React from "react";
import {FilterValueType, TaskType} from "../App";

type ToDoListPropsType = {
  title: string
  tasks: Array<TaskType>
  removeTask: (task_ID: number) => void
  changeFilter: (filterValue: FilterValueType) => void
};

export const ToDoList = (props: ToDoListPropsType) => {
  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input/>
        <button>+</button>
      </div>
      <ul>
        {props.tasks.map((t) => {
          return (
            <li key={t.id}>
              <button onClick={() => props.removeTask(t.id)}>X</button>
              <input type={"checkbox"} checked={t.isDone}/>
              <span>{t.title}</span>
            </li>
          );
        })}
      </ul>
      <div>
        <button onClick={() => props.changeFilter("All")}>All</button>
        <button onClick={() => props.changeFilter("Active")}>Active</button>
        <button onClick={() => props.changeFilter("Completed")}>Completed</button>
      </div>
    </div>
  );
};