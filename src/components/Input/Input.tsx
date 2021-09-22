import React, {ChangeEvent, KeyboardEvent} from "react";
import styles from "./Input.module.css";

type InputPropsType = {
    value: string
    setValue: (title: string) => void
    inputError: boolean
    setInputError: (value: boolean) => void
    callBack: () => void
}

export const Input = (props: InputPropsType) => {

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        props.setValue(event.currentTarget.value);
        props.setInputError(false);
    }

    const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            if(props.value.trim() !== "") {
                props.callBack();
                props.setValue("");
            } else {
                props.setInputError(true);
                props.setValue("");
            }
        }
    }

    let getClassName = props.inputError ? styles.error : "";

    return (
        <input
            value={props.value}
            className={getClassName}
            onChange={onChangeHandler}
            onKeyPress={onKeyPressHandler}
        />
    );
}