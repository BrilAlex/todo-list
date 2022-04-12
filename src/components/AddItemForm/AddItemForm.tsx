import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {IconButton, TextField} from "@mui/material";
import {AddCircleOutline} from "@mui/icons-material";

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
      <TextField
        variant={"outlined"}
        value={value}
        onChange={onChangeHandler}
        onKeyPress={onKeyPressHandler}
        label={"Title"}
        error={!!error}
        helperText={error}
        size={"small"}
        style={{marginBottom: "10px"}}
      />
      <IconButton onClick={addTask} color={"primary"}>
        <AddCircleOutline/>
      </IconButton>
    </div>
  );
};