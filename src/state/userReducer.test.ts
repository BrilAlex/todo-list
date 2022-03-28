import {userReducer} from "./userReducer";

test("userReducer should increase only age", () => {
  const startState = {age: 20, childrenCount: 2, name: "Dimych"};

  const endState = userReducer(startState, {type: "INCREASE-AGE"});

  expect(endState.age).toBe(21);
  expect(endState.childrenCount).toBe(2);
});

test("userReducer should increase only childrenCount", () => {
  const startState = {age: 20, childrenCount: 2, name: "Dimych"};

  const endState = userReducer(startState, {type: "INCREASE-CHILDREN-COUNT"});

  expect(endState.age).toBe(20);
  expect(endState.childrenCount).toBe(3);
});

test("userReducer should change user name", () => {
  const startState = {age: 20, childrenCount: 2, name: "Dimych"};

  const newName = "Viktor";
  const endState = userReducer(startState, {type: "CHANGE-NAME", newName});

  expect(endState.name).toBe(newName);
});