import {AppStateType} from "../../utils/types";

export const selectTodoLists = (state: AppStateType) => state.todoLists;
export const selectTasks = (state: AppStateType) => state.tasks;
