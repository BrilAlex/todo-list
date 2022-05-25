import {
  appReducer,
  initStateType,
  RequestStatusType,
  setAppErrorAC,
  setAppStatusAC
} from "./appReducer";

let startState: initStateType;

beforeEach(() => {
  startState = {
    isInitialized: false,
    status: "idle",
    error: null,
  };
});

test("Correct app status should be set to state", () => {
  const newStatus: RequestStatusType = "loading";
  const endState = appReducer(startState, setAppStatusAC(newStatus));

  expect(startState.status).toBe("idle");
  expect(endState.status).toBe(newStatus);
});

test("Correct error message should be set to state", () => {
  const error: string | null = "Some error";
  const endState = appReducer(startState, setAppErrorAC(error));

  expect(startState.error).toBe(null);
  expect(endState.error).toBe(error);
});

