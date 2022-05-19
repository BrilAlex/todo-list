// Types
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type initStateType = typeof initState;
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>;
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>;
type ActionsType = SetAppStatusActionType | SetAppErrorActionType;

// Initial state
const initState = {
  status: "idle" as RequestStatusType,
  error: null as string | null,
};

// Action Creators
export const setAppStatusAC = (status: RequestStatusType) =>
  ({type: "APP/SET-STATUS", status} as const);
export const setAppErrorAC = (error: string | null) =>
  ({type: "APP/SET-ERROR", error} as const);

// Thunk Creators

export const appReducer = (state: initStateType = initState, action: ActionsType): initStateType => {
  switch (action.type) {
    case "APP/SET-STATUS":
      return {...state, status: action.status};
    case "APP/SET-ERROR":
      return {...state, error: action.error};
    default:
      return state;
  }
};