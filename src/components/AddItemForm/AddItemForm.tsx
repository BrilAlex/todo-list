import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";

type AddItemFormPropsType = {
  callback: (title: string) => void
};

export const AddItemForm = (props: AddItemFormPropsType) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [inputError, setInputError] = useState<boolean>(false);

  const addItem = () => {
    const trimmedTitle = inputValue.trim();
    if (trimmedTitle !== "") {
      props.callback(trimmedTitle);
      setInputValue("");
    } else {
      setInputError(true);
      setInputValue("");
    }
  };
  const inputOnChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
    setInputError(false);
  };
  const inputOnKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addItem();
  };

  return (
    <div>
      <TextField
        value={inputValue}
        onChange={inputOnChangeHandler}
        onKeyPress={inputOnKeyPressHandler}
        error={inputError}
        helperText={inputError && "Title is required"}
      />
      <IconButton color="primary" onClick={addItem}>
        <AddBox/>
      </IconButton>
    </div>
  );
};