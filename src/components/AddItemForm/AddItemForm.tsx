import React, {ChangeEvent, KeyboardEvent, useState} from "react";

type AddItemFormPropsType = {
    callback: (value: string) => void
}

export const AddItemForm = (props: AddItemFormPropsType) => {
    const [value, setValue] = useState<string>("");
    const [error, setError] = useState<boolean>(false);

    const addItemHandler = () => {
        let trimmedValue = value.trim();
        if (trimmedValue !== "") {
            props.callback(trimmedValue);
        } else {
            setError(true);
        }
        setValue("");
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value);
        setError(false);
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter") addItemHandler();
    }

    return (
        <div>
            <input
                className={error ? "inputError" : ""}
                value={value}
                onChange={onChangeHandler}
                onKeyPress={onKeyPressHandler}
            />
            <button onClick={addItemHandler}>+</button>
            <div className={"errorMessage"}>{error && "Title is required"}</div>
        </div>
    );
}