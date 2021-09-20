import React, {ChangeEvent, KeyboardEvent} from "react";
import styles from "./Input.module.css";

type AddTaskInputProps = {
    title: string
    callBack: () => void
    setTitle: (title: string) => void
    inputError: boolean
    setInputError: (value: boolean) => void
}

export const Input = (props: AddTaskInputProps) => {


    const onChangehandler = (event: ChangeEvent<HTMLInputElement>) => {
        props.setTitle(event.currentTarget.value);
        props.setInputError(false);
    }

    const onKeyPresshandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            if(props.title.trim() !== "") {
                props.callBack()
                props.setTitle('')
            } else {
                props.setInputError(true);
            }
        }
    }

    let getValidClassName = props.inputError ? styles.error : "";

    return (
        <input
            value={props.title}
            onChange={onChangehandler}
            onKeyPress={onKeyPresshandler}
            className={getValidClassName}
        />
    );
}