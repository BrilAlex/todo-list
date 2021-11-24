import {
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
  tasksReducer
} from "./tasksReducer";
import {TasksType} from "../App";
import {addTodoListAC, removeTodoListAC} from "./todoListsReducer";

let startState: TasksType;

beforeEach(() => {
  startState = {
    "todolistId1": [
      {id: "1", title: "CSS", isDone: false},
      {id: "2", title: "JS", isDone: true},
      {id: "3", title: "React", isDone: false}
    ],
    "todolistId2": [
      {id: "1", title: "bread", isDone: false},
      {id: "2", title: "milk", isDone: true},
      {id: "3", title: "tea", isDone: false}
    ]
  };
});

test("correct task should be deleted from correct array", () => {
  const action = removeTaskAC("todolistId2", "2");
  const endState = tasksReducer(startState, action);

  expect(endState).toEqual({
    "todolistId1": [
      {id: "1", title: "CSS", isDone: false},
      {id: "2", title: "JS", isDone: true},
      {id: "3", title: "React", isDone: false}
    ],
    "todolistId2": [
      {id: "1", title: "bread", isDone: false},
      {id: "3", title: "tea", isDone: false}
    ]
  });
});

test("correct task should be added to correct array", () => {
  const action = addTaskAC("todolistId2", "juice");
  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(4);
  expect(endState["todolistId2"][3].id).toBeDefined();
  expect(endState["todolistId2"][3].title).toBe("juice");
  expect(endState["todolistId2"][3].isDone).toBeFalsy();
});

test("status of specified task should be changed", () => {
  const action = changeTaskStatusAC("todolistId2", "2", false);
  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"][1].isDone).toBeTruthy();
  expect(endState["todolistId2"][1].isDone).toBe(false);
});

test("title of specified task should be changed", () => {
  const action = changeTaskTitleAC("todolistId2", "2", "cheese");
  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"][1].title).toBe("JS");
  expect(endState["todolistId2"][1].title).toBe("cheese");
});

test("new array should be added when new todolist is added", () => {
  const action = addTodoListAC("new todolist");
  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);
  const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
  if (!newKey) {
    throw Error("new key should be added")
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});

test("property with todolistId should be deleted", () => {
  const action = removeTodoListAC("todolistId2");
  const endState = tasksReducer(startState, action)
  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistId2"]).not.toBeDefined();
});