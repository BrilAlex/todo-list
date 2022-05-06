import {
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
  tasksReducer,
  TasksType
} from "./tasksReducer";
import {addTodoListAC, removeTodoListAC} from "./todoListsReducer";
import {TaskPriorities, TaskStatuses} from "../api/todoListsApi";

let startState: TasksType;

beforeEach(() => {
  startState = {
    "todoList_ID1": [
      {
        id: "1", title: "HTML", todoListId: "todolist_ID1", description: "",
        status: TaskStatuses.Completed, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
      {
        id: "2", title: "CSS", todoListId: "todolist_ID1", description: "",
        status: TaskStatuses.Completed, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
      {
        id: "3", title: "React", todoListId: "todolist_ID1", description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
    ],
    "todoList_ID2": [
      {
        id: "1", title: "Bread", todoListId: "todolist_ID2", description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
      {
        id: "2", title: "Milk", todoListId: "todolist_ID2", description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
      {
        id: "3", title: "Tea", todoListId: "todolist_ID2", description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
    ],
  };
});

test("Correct task should be deleted from correct array", () => {
  const action = removeTaskAC("todoList_ID2", "2");
  const endState = tasksReducer(startState, action);

  expect(endState["todoList_ID1"].length).toBe(3);
  expect(endState["todoList_ID2"].length).toBe(2);
  expect(endState["todoList_ID2"].every(tl => tl.id !== "2")).toBeTruthy();
  expect(endState).toEqual({
    "todoList_ID1": [
      {
        id: "1", title: "HTML", todoListId: "todolist_ID1", description: "",
        status: TaskStatuses.Completed, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
      {
        id: "2", title: "CSS", todoListId: "todolist_ID1", description: "",
        status: TaskStatuses.Completed, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
      {
        id: "3", title: "React", todoListId: "todolist_ID1", description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
    ],
    "todoList_ID2": [
      {
        id: "1", title: "Bread", todoListId: "todolist_ID2", description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
      {
        id: "3", title: "Tea", todoListId: "todolist_ID2", description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
    ],
  });
});

test("Correct task should be added to correct array", () => {
  const action = addTaskAC("todoList_ID2", "Juice");
  const endState = tasksReducer(startState, action);

  expect(endState["todoList_ID1"].length).toBe(3);
  expect(endState["todoList_ID2"].length).toBe(4);
  expect(endState["todoList_ID2"][0].id).toBeDefined();
  expect(endState["todoList_ID2"][0].title).toBe("Juice");
  expect(endState["todoList_ID2"][0].status).toBe(TaskStatuses.New);
});

test("Status of specified task should be changed", () => {
  const action = changeTaskStatusAC("todoList_ID2", "2", TaskStatuses.New);
  const endState = tasksReducer(startState, action);

  expect(endState["todoList_ID1"][1].status).toBe(TaskStatuses.Completed);
  expect(endState["todoList_ID2"][1].status).toBe(TaskStatuses.New);
});

test("Title of specified task should be changed", () => {
  const action = changeTaskTitleAC("todoList_ID2", "2", "Coffee");
  const endState = tasksReducer(startState, action);

  expect(endState["todoList_ID1"][1].title).toBe("CSS");
  expect(endState["todoList_ID2"][1].title).toBe("Coffee");
});

test("New array should be added when new todolist is added", () => {
  const action = addTodoListAC("New TodoList");
  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);
  const newKey = keys.find(k => k !== "todoList_ID1" && k !== "todoList_ID2");
  if (!newKey) {
    throw Error("new key should be added")
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toStrictEqual([]);
});

test("Property with TodoList_ID should be deleted", () => {
  const action = removeTodoListAC("todoList_ID2");
  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todoList_ID2"]).toBeUndefined();
});
