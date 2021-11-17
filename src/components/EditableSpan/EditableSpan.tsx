import {ChangeEvent, KeyboardEvent, useState} from "react";
import {TextField} from "@material-ui/core";

type EditableSpanPropsType = {
  value: string
  callback: (newValue: string) => void
};

export const EditableSpan = (props: EditableSpanPropsType) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(props.value);

  const activateViewMode = () => {
    let trimmedValue = inputValue.trim();
    if (trimmedValue !== "") {
      setEditMode(false);
      props.callback(inputValue);
    }
  };
  const activateEditMode = () => {
    setEditMode(true);
  };
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.currentTarget.value);
  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") activateViewMode();
  };

  return (
    editMode ?
      <TextField
        value={inputValue}
        onChange={onChangeHandler}
        onKeyPress={onKeyPressHandler}
        onBlur={activateViewMode}
        autoFocus
      />
      :
      <span onDoubleClick={activateEditMode}>{props.value}</span>
  );
};