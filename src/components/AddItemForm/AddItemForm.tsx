import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {IconButton, TextField} from "@mui/material";
import {AddCircleOutline} from "@mui/icons-material";

type AddItemFormPropsType = {
  addItem: (title: string) => void
  disabled?: boolean
};

export const AddItemForm = React.memo(({addItem, disabled = false}: AddItemFormPropsType) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addItemHandler = () => {
    const trimmedValue = value.trim();
    if (trimmedValue !== "") {
      addItem(trimmedValue);
    } else {
      setError("Title is required");
    }
    setValue("");
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error) setError(null);
    if (e.key === "Enter") addItemHandler();
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
        disabled={disabled}
      />
      <IconButton onClick={addItemHandler} color={"primary"} disabled={disabled}>
        <AddCircleOutline/>
      </IconButton>
    </div>
  );
});
