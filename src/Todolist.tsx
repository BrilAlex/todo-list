import React, {ChangeEvent, useState} from 'react';
import {FilterValuesType} from './App';
import {Button} from "./components/Button/Button";
import {Input} from "./components/Input/Input";
import styles from "./Todolist.module.css";

type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    title: string
    tasks: Array<TaskType>
    filter: FilterValuesType
    removeTask: (taskId: string) => void
    changeFilter: (value: FilterValuesType) => void
    addTask: (title: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean) => void
}

export function Todolist(props: PropsType) {
    let [title, setTitle] = useState('');
    let [inputError, setInputError] = useState<boolean>(false);

    const changeFilterTsarHandler = (value: FilterValuesType) => {
        props.changeFilter(value);
    }

    const removeTaskHandler = (id: string) => {
        props.removeTask(id)
    }

    const addTaskHandler = () => {
        if(title.trim() !== "") {
            props.addTask(title.trim());
            setTitle('');
        } else {
            setInputError(true);
        }
    }

    const changeTaskStatusHandler = (taskId: string, event: ChangeEvent<HTMLInputElement>) => {
        props.changeTaskStatus(taskId, event.currentTarget.checked);
    }

    return <div>
        <h3>{props.title}</h3>
        <div>
            <Input
                title={title}
                callBack={addTaskHandler}
                setTitle={setTitle}
                inputError={inputError}
                setInputError={setInputError}
            />
            <Button title={"+"} callBack={addTaskHandler}/>
            {inputError && <div className={styles.errorMessage}>Task title is required</div>}
        </div>
        <ul>
            {props.tasks.map((t) => {
                let getValidClassNameForTask = t.isDone ? styles.isDone : "";
                return (
                    <li key={t.id} className={getValidClassNameForTask}>
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
                title={"all"}
                activeStatus={props.filter === "all"}
                callBack={() => changeFilterTsarHandler("all")}
            />
            <Button
                title={"complited"}
                activeStatus={props.filter === "completed"}
                callBack={() => changeFilterTsarHandler("completed")}
            />
            <Button
                title={"active"}
                activeStatus={props.filter === "active"}
                callBack={() => changeFilterTsarHandler("active")}
            />
        </div>
    </div>
}
