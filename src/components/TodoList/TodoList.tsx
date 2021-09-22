import React, {ChangeEvent, useState} from 'react';
import {FilterValuesType, TaskType} from '../../App';
import {Button} from "../Button/Button";
import {Input} from "../Input/Input";
import styles from "./TodoList.module.css";

type TodoListPropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    filter: FilterValuesType
    addNewTask: (todoList_Id: string, title: string) => void
    removeTask: (todoList_Id: string, taskId: string) => void
    changeTaskStatus: (todoList_Id: string, taskId: string, isDone: boolean) => void
    changeFilter: (todoList_Id: string, value: FilterValuesType) => void
    removeTodoList: (todoList_Id: string) => void
}

export const TodoList: React.FC<TodoListPropsType> = (
    {id,title, tasks, filter,...props}
) => {
    let [taskTitle, setTaskTitle] = useState('');
    let [inputError, setInputError] = useState<boolean>(false);

    const addTaskHandler = () => {
        const trimmedTitle = taskTitle.trim();
        if(trimmedTitle) {
            props.addNewTask(id, trimmedTitle);
            setTaskTitle("");
        } else {
            setInputError(true);
            setTaskTitle("");
        }
    }

    const removeTaskHandler = (task_Id: string) => {
        props.removeTask(id, task_Id);
    }

    const changeTaskStatusHandler = (taskId: string, event: ChangeEvent<HTMLInputElement>) => {
        props.changeTaskStatus(id, taskId, event.currentTarget.checked);
    }

    const changeFilterHandler = (value: FilterValuesType) => {
        props.changeFilter(id, value);
    }

    const removeTodoListHandler = () => {
        props.removeTodoList(id);
    }

    return <div>
        <h3>
            {title}
            <Button title={"X"} callBack={removeTodoListHandler}/>
        </h3>
        <div>
            <Input
                value={taskTitle}
                setValue={setTaskTitle}
                inputError={inputError}
                setInputError={setInputError}
                callBack={addTaskHandler}
            />
            <Button title={"+"} callBack={addTaskHandler}/>
            {inputError && <div className={styles.errorMessage}>Task title is required</div>}
        </div>
        <ul>
            {tasks.map((t) => {
                let getClassNameForTask = t.isDone ? styles.isDone : "";
                return (
                    <li key={t.id} className={getClassNameForTask}>
                        <Button title={"X"} callBack={() => removeTaskHandler(t.id)}/>
                        <input
                            type="checkbox" checked={t.isDone}
                            onChange={(e) =>
                                changeTaskStatusHandler(t.id, e)
                            }
                        />
                        <span>{t.title}</span>
                    </li>
                )
            })}

        </ul>
        <div>
            <Button
                title={"All"}
                activeStatus={filter === "all"}
                callBack={() => changeFilterHandler("all")}
            />
            <Button
                title={"Completed"}
                activeStatus={filter === "completed"}
                callBack={() => changeFilterHandler("completed")}
            />
            <Button
                title={"Active"}
                activeStatus={filter === "active"}
                callBack={() => changeFilterHandler("active")}
            />
        </div>
    </div>
}
