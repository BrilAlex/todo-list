import styles from "../ToDoList/TodoList.module.css";
import React, {ChangeEvent, KeyboardEvent, useState} from "react";

type AddItemFormPropsType = {
  addItem: (title: string) => void
};

export const AddItemForm = (props: AddItemFormPropsType) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addTask = () => {
    const trimmedValue = value.trim();
    if (trimmedValue !== "") {
      props.addItem(trimmedValue);
    } else {
      setError("Title is required");
    }
    setValue("");
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    setError(null);
    if (e.key === "Enter") addTask();
  };

  return (
    <div>
      <input
        value={value}
        onChange={onChangeHandler}
        onKeyPress={onKeyPressHandler}
        className={error ? styles.error : ""}
      />
      <button onClick={addTask}>+</button>
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};