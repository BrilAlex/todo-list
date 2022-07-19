// Types
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type initStateType = typeof initState;
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>;
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>;
type SetIsInitializedActionType = ReturnType<typeof setIsInitializedAC>;
type ActionsType = SetIsInitializedActionType | SetAppStatusActionType | SetAppErrorActionType;

// Initial state
const initState = {
  isInitialized: false,
  status: "idle" as RequestStatusType,
  error: null as string | null,
};

// Action Creators
export const setIsInitializedAC = (value: boolean) =>
  ({type: "APP/SET-IS-INITIALIZED", value} as const);
export const setAppStatusAC = (status: RequestStatusType) =>
  ({type: "APP/SET-STATUS", status} as const);
export const setAppErrorAC = (error: string | null) =>
  ({type: "APP/SET-ERROR", error} as const);

export const appReducer = (state: initStateType = initState, action: ActionsType): initStateType => {
  switch (action.type) {
    case "APP/SET-IS-INITIALIZED":
      return {...state, isInitialized: action.value};
    case "APP/SET-STATUS":
      return {...state, status: action.status};
    case "APP/SET-ERROR":
      return {...state, error: action.error};
    default:
      return state;
  }
};
