import {v1} from "uuid";
import {
  asyncActions as asyncTodoListsActions,
  FilterValueType,
  TodoListDomainType,
  todoListsSlice
} from "./todoListsReducer";
import {TodoListType} from "../../api/types";
import {RequestStatusType} from "../Application/applicationReducer";

const todoListsReducer = todoListsSlice.reducer;
const {changeTodoListFilter, changeTodolistEntityStatus} = todoListsSlice.actions;
const {removeTodoList, addTodoList, changeTodoListTitle, fetchTodoLists} = asyncTodoListsActions;

let todoList_ID1: string;
let todoList_ID2: string;

let startState: Array<TodoListDomainType>;

beforeEach(() => {
  todoList_ID1 = v1();
  todoList_ID2 = v1();

  startState = [
    {
      id: todoList_ID1,
      title: "What to learn",
      addedDate: "",
      order: 0,
      filter: "all",
      entityStatus: "idle",
    },
    {
      id: todoList_ID2,
      title: "What to buy",
      addedDate: "",
      order: 0,
      filter: "all",
      entityStatus: "idle",
    },
  ];
});

test("Correct TodoList should be removed", () => {
  const endState = todoListsReducer(startState, removeTodoList.fulfilled(
    {id: todoList_ID1},
    "request_ID",
    todoList_ID1
  ));

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todoList_ID2);
});

test("Correct TodoList should be added", () => {
  const newTodoList: TodoListType = {id: v1(), title: "New TodoList", addedDate: "", order: 0};
  const endState = todoListsReducer(startState, addTodoList.fulfilled(
    {todoList: newTodoList},
    "request_ID",
    newTodoList.title,
  ));

  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe(newTodoList.title);
  expect(endState[0].filter).toBe("all");
});

test("Correct TodoList should change it's name", () => {
  const newTodoListTitle = "New Title";
  const action = changeTodoListTitle.fulfilled(
    {id: todoList_ID2, title: newTodoListTitle},
    "request_ID",
    {todoList_ID: todoList_ID2, newTitle: newTodoListTitle},
  );
  const endState = todoListsReducer(startState, action);

  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe(newTodoListTitle);
});

test("Correct TodoList filter should be changed", () => {
  const newFilter: FilterValueType = "completed";
  const action = changeTodoListFilter({id: todoList_ID2, filter: newFilter});
  const endState = todoListsReducer(startState, action);

  expect(endState[0].filter).toBe("all");
  expect(endState[1].filter).toBe(newFilter);
});

test("TodoLists should be set to state", () => {
  const action = fetchTodoLists.fulfilled({todoLists: startState}, "request_ID");
  const endState = todoListsReducer([], action);

  expect(endState.length).toBe(2);
});

test("Correct TodoList entity status should be changed", () => {
  const newStatus: RequestStatusType = "loading";
  const action = changeTodolistEntityStatus({id: todoList_ID2, status: newStatus});
  const endState = todoListsReducer(startState, action);

  expect(endState[0].entityStatus).toBe("idle");
  expect(endState[1].entityStatus).toBe(newStatus);
});
