import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {IconButton, TextField} from "@mui/material";
import {AddCircleOutline} from "@mui/icons-material";

export type AddItemFormSubmitHelperType = {
  setValue: (value: string) => void
  setError: (value: string) => void
};
type AddItemFormPropsType = {
  addItem: (title: string, helper: AddItemFormSubmitHelperType) => Promise<void>
  disabled?: boolean
};

export const AddItemForm = React.memo(({addItem, disabled = false}: AddItemFormPropsType) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addItemHandler = async () => {
    const trimmedValue = value.trim();
    if (trimmedValue !== "") {
      addItem(trimmedValue, {setValue, setError});
    } else {
      setError("Title is required");
    }
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
      <IconButton
        onClick={addItemHandler}
        color={"primary"}
        disabled={disabled}
        style={{marginLeft: "5px"}}
      >
        <AddCircleOutline/>
      </IconButton>
    </div>
  );
});
