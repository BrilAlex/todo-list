import {AppStateType} from "../../app/store";

export const selectTodoLists = (state: AppStateType) => state.todoLists;
export const selectTasks = (state: AppStateType) => state.tasks;
