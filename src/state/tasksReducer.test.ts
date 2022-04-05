import {TasksType} from "../App";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./tasksReducer";
import {addTodoListAC, removeTodoListAC} from "./todoListsReducer";

test("Correct task should be deleted from correct array", () => {
  const startState: TasksType = {
    "todoList_ID1": [
      {id: "1", title: "HTML", isDone: true},
      {id: "2", title: "CSS", isDone: true},
      {id: "3", title: "React", isDone: false},
    ],
    "todoList_ID2": [
      {id: "1", title: "Bread", isDone: false},
      {id: "2", title: "Milk", isDone: true},
      {id: "3", title: "Tea", isDone: false},
    ],
  };

  const action = removeTaskAC("todoList_ID2", "2");
  const endState = tasksReducer(startState, action);

  expect(endState["todoList_ID1"].length).toBe(3);
  expect(endState["todoList_ID2"].length).toBe(2);
  expect(endState["todoList_ID2"].every(tl => tl.id !== "2")).toBeTruthy();
  expect(endState).toEqual({
    "todoList_ID1": [
      {id: "1", title: "HTML", isDone: true},
      {id: "2", title: "CSS", isDone: true},
      {id: "3", title: "React", isDone: false},
    ],
    "todoList_ID2": [
      {id: "1", title: "Bread", isDone: false},
      {id: "3", title: "Tea", isDone: false},
    ],
  });
});

test("Correct task should be added to correct array", () => {
  const startState: TasksType = {
    "todoList_ID1": [
      {id: "1", title: "HTML", isDone: true},
      {id: "2", title: "CSS", isDone: true},
      {id: "3", title: "React", isDone: false},
    ],
    "todoList_ID2": [
      {id: "1", title: "Bread", isDone: false},
      {id: "2", title: "Milk", isDone: true},
      {id: "3", title: "Tea", isDone: false},
    ],
  };

  const action = addTaskAC("todoList_ID2", "Juice");
  const endState = tasksReducer(startState, action);

  expect(endState["todoList_ID1"].length).toBe(3);
  expect(endState["todoList_ID2"].length).toBe(4);
  expect(endState["todoList_ID2"][0].id).toBeDefined();
  expect(endState["todoList_ID2"][0].title).toBe("Juice");
  expect(endState["todoList_ID2"][0].isDone).toBe(false);
});

test("Status of specified task should be changed", () => {
  const startState: TasksType = {
    "todoList_ID1": [
      {id: "1", title: "HTML", isDone: true},
      {id: "2", title: "CSS", isDone: true},
      {id: "3", title: "React", isDone: false},
    ],
    "todoList_ID2": [
      {id: "1", title: "Bread", isDone: false},
      {id: "2", title: "Milk", isDone: true},
      {id: "3", title: "Tea", isDone: false},
    ],
  };

  const action = changeTaskStatusAC("todoList_ID2", "2", false);
  const endState = tasksReducer(startState, action);

  expect(endState["todoList_ID1"][1].isDone).toBeTruthy();
  expect(endState["todoList_ID2"][1].isDone).toBeFalsy();
});

test("Title of specified task should be changed", () => {
  const startState: TasksType = {
    "todoList_ID1": [
      {id: "1", title: "HTML", isDone: true},
      {id: "2", title: "CSS", isDone: true},
      {id: "3", title: "React", isDone: false},
    ],
    "todoList_ID2": [
      {id: "1", title: "Bread", isDone: false},
      {id: "2", title: "Milk", isDone: true},
      {id: "3", title: "Tea", isDone: false},
    ],
  };

  const action = changeTaskTitleAC("todoList_ID2", "2", "Coffee");
  const endState = tasksReducer(startState, action);

  expect(endState["todoList_ID1"][1].title).toBe("CSS");
  expect(endState["todoList_ID2"][1].title).toBe("Coffee");
});

test("New array should be added when new todolist is added", () => {
  const startState: TasksType = {
    "todoList_ID1": [
      {id: "1", title: "HTML", isDone: true},
      {id: "2", title: "CSS", isDone: true},
      {id: "3", title: "React", isDone: false},
    ],
    "todoList_ID2": [
      {id: "1", title: "Bread", isDone: false},
      {id: "2", title: "Milk", isDone: true},
      {id: "3", title: "Tea", isDone: false},
    ],
  };

  const action = addTodoListAC("New TodoList");
  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);
  const newKey = keys.find(k => k != "todoList_ID1" && k != "todoList_ID2");
  if (!newKey) {
    throw Error("new key should be added")
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toStrictEqual([]);
});

test("Property with TodoList_ID should be deleted", () => {
  const startState: TasksType = {
    "todoList_ID1": [
      {id: "1", title: "HTML", isDone: true},
      {id: "2", title: "CSS", isDone: true},
      {id: "3", title: "React", isDone: false},
    ],
    "todoList_ID2": [
      {id: "1", title: "Bread", isDone: false},
      {id: "2", title: "Milk", isDone: true},
      {id: "3", title: "Tea", isDone: false},
    ],
  };

  const action = removeTodoListAC("todoList_ID2");
  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todoList_ID2"]).toBeUndefined();
});
