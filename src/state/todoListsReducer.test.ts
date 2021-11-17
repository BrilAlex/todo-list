import {
  addTodoListAC, changeTodoListFilterAC,
  changeTodoListTitleAC,
  removeTodoListAC,
  todoListsReducer
} from "./todoListsReducer";
import {v1} from "uuid";
import {FilterValueType, TodoListType} from "../App";

test("correct todolist should be removed", () => {
  let todolistId1 = v1();
  let todolistId2 = v1();
  const startState: Array<TodoListType> = [
    {id: todolistId1, title: "What to learn", filter: "All"},
    {id: todolistId2, title: "What to buy", filter: "All"}
  ];
  const endState = todoListsReducer(startState, removeTodoListAC(todolistId1));
  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
});

test("correct todolist should be added", () => {
  let todolistId1 = v1();
  let todolistId2 = v1();
  let newTodolistTitle = "New Todolist";
  const startState: Array<TodoListType> = [
    {id: todolistId1, title: "What to learn", filter: "All"},
    {id: todolistId2, title: "What to buy", filter: "All"}
  ];
  const endState = todoListsReducer(startState, addTodoListAC(newTodolistTitle));
  expect(endState.length).toBe(3);
  expect(endState[2].title).toBe(newTodolistTitle);
});

test("correct todolist should change its name", () => {
  let todolistId1 = v1();
  let todolistId2 = v1();
  let newTodolistTitle = "New Todolist";
  const startState: Array<TodoListType> = [
    {id: todolistId1, title: "What to learn", filter: "All"},
    {id: todolistId2, title: "What to buy", filter: "All"}
  ];
  const action = changeTodoListTitleAC(todolistId2, newTodolistTitle);

  const endState = todoListsReducer(startState, action);
  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe(newTodolistTitle);
});

test("correct filter of todolist should be changed", () => {
  let todolistId1 = v1();
  let todolistId2 = v1();
  let newFilter: FilterValueType = "Completed";
  const startState: Array<TodoListType> = [
    {id: todolistId1, title: "What to learn", filter: "All"},
    {id: todolistId2, title: "What to buy", filter: "All"}
  ]
  const action = changeTodoListFilterAC(todolistId2, newFilter);
  const endState = todoListsReducer(startState, action);
  expect(endState[0].filter).toBe("All");
  expect(endState[1].filter).toBe(newFilter);
});
