import {appSlice, InitStateType, RequestStatusType} from "./applicationReducer";
import {commonAppActions} from "../CommonActions/app";

const {reducer: appReducer} = appSlice;
const {setAppStatus, setAppError} = commonAppActions;

let startState: InitStateType;

beforeEach(() => {
  startState = {
    isInitialized: false,
    status: "idle",
    error: null,
  };
});

test("Correct app status should be set to state", () => {
  const newStatus: RequestStatusType = "loading";
  const endState = appReducer(startState, setAppStatus({status: newStatus}));

  expect(startState.status).toBe("idle");
  expect(endState.status).toBe(newStatus);
});

test("Correct error message should be set to state", () => {
  const error: string | null = "Some error";
  const endState = appReducer(startState, setAppError({error}));

  expect(startState.error).toBe(null);
  expect(endState.error).toBe(error);
});
