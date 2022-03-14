import {ChangeEvent, useState} from "react";

type EditableSpanPropsType = {
  value: string
  setNewValue: (value: string) => void
};

export const EditableSpan = (props: EditableSpanPropsType) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const activateViewMode = () => {
    props.setNewValue(value);
    setEditMode(false);
  };

  const activateEditMode = () => {
    setValue(props.value);
    setEditMode(true);
  };

  return (
    editMode ?
      <input value={value} onChange={onChangeHandler} onBlur={activateViewMode} autoFocus/>
      :
      <span onDoubleClick={activateEditMode}>{props.value}</span>
  );
};