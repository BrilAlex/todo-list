import React, {ChangeEvent} from "react";
import {FilterValueType, TaskType} from "../../App";
import {AddItemForm} from "../AddItemForm/AddItemForm";
import {EditableSpan} from "../EditableSpan/EditableSpan";

type TodoListPropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    addTask: (todoList_ID: string, title: string) => void
    changeTaskTitle: (todoList_ID: string, task_ID: string, title: string) => void
    changeTaskStatus: (todoList_ID: string, task_ID: string, isDone: boolean) => void
    removeTask: (todoList_ID: string, task_ID: string) => void
    filter: FilterValueType
    changeTodoListTitle: (todoList_ID: string, title: string) => void
    changeFilter: (todoList_ID: string, filterValue: FilterValueType) => void
    removeTodoList: (todoList_ID: string) => void
}

export const TodoList = (props: TodoListPropsType) => {
    const todoList_ID = props.id;

    const addTaskHandler = (title: string) => {
        props.addTask(todoList_ID, title);
    }

    const changeTodoListTitleHandler = (title: string) => {
        props.changeTodoListTitle(todoList_ID, title);
    }

    const changeFilterHandler = (filterValue: FilterValueType) =>
        props.changeFilter(todoList_ID, filterValue);

    const removeTodoListHandler = () => {
        props.removeTodoList(todoList_ID);
    }

    return (
        <div>
            <h3>
                <EditableSpan value={props.title} callback={changeTodoListTitleHandler}/>
                <button onClick={removeTodoListHandler}>X</button>
            </h3>
            <AddItemForm callback={addTaskHandler}/>
            <ul>
                {props.tasks.map(t => {
                    const changeTaskTitleHandler = (title: string) =>
                        props.changeTaskTitle(todoList_ID, t.id, title);

                    const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) =>
                        props.changeTaskStatus(todoList_ID, t.id, e.currentTarget.checked);

                    const removeTaskHandler = () => props.removeTask(todoList_ID, t.id);

                    return <li key={t.id} className={t.isDone ? "isDone" : ""}>
                        <input
                            type={"checkbox"}
                            checked={t.isDone}
                            onChange={changeTaskStatusHandler}
                        />
                        <EditableSpan value={t.title} callback={changeTaskTitleHandler}/>
                        <button onClick={removeTaskHandler}>X</button>
                    </li>
                })}
            </ul>
            <div>
                <button
                    className={props.filter === "all" ? "activeFilter" : ""}
                    onClick={() => changeFilterHandler("all")}
                >
                    All
                </button>
                <button
                    className={props.filter === "active" ? "activeFilter" : ""}
                    onClick={() => changeFilterHandler("active")}
                >
                    Active
                </button>
                <button
                    className={props.filter === "completed" ? "activeFilter" : ""}
                    onClick={() => changeFilterHandler("completed")}
                >
                    Completed
                </button>
            </div>
        </div>
    );
}