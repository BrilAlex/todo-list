import React, {ChangeEvent, KeyboardEvent, useState} from "react";

type EditableSpanPropsType = {
    value: string
    callback: (newValue: string) => void
}

export const EditableSpan = (props: EditableSpanPropsType) => {
    const [value, setValue] = useState<string>(props.value);
    const [editMode, setEditMode] = useState<boolean>(false);

    const activateEditMode = () => {
        setEditMode(true);
    }

    const activateViewMode = () => {
        let trimmedValue = value.trim();
        if(trimmedValue !== "") {
            props.callback(trimmedValue);
            setEditMode(false);
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value);
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter") activateViewMode();
    }

    return editMode ?
        <input
            value={value}
            onChange={onChangeHandler}
            onKeyPress={onKeyPressHandler}
            onBlur={activateViewMode}
            autoFocus
        />
        :
        <span onDoubleClick={activateEditMode}>{props.value}</span>;
}