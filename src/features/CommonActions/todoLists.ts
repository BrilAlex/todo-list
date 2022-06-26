import {createAction} from "@reduxjs/toolkit";

const clearTodoListsData = createAction("todoLists/clearTodoListsData");

export const commonTodoListsActions = {
  clearTodoListsData,
};
