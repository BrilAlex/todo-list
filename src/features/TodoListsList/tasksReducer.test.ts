import {
  addTaskTC,
  fetchTasksTC, removeTaskTC,
  tasksReducer,
  TasksType, updateTaskTC
} from "./tasksReducer";
import {addTodoListTC, fetchTodoListsTC, removeTodoListTC} from "./todoListsReducer";
import {TaskPriorities, TaskStatuses, TaskType, TodoListType} from "../../api/types";
import {v1} from "uuid";

let startState: TasksType;

beforeEach(() => {
  startState = {
    "todoList_ID1": [
      {
        id: "1", title: "HTML", todoListId: "todolist_ID1", description: "",
        status: TaskStatuses.Completed, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
      },
      {
        id: "2", title: "CSS", todoListId: "todolist_ID1", description: "",
        status: TaskStatuses.Completed, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
      },
      {
        id: "3", title: "React", todoListId: "todolist_ID1", description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
      },
    ],
    "todoList_ID2": [
      {
        id: "1", title: "Bread", todoListId: "todolist_ID2", description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
      },
      {
        id: "2", title: "Milk", todoListId: "todolist_ID2", description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
      },
      {
        id: "3", title: "Tea", todoListId: "todolist_ID2", description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
      },
    ],
  };
});

test("Correct task should be deleted from correct array", () => {
  const params = {todoList_ID: "todoList_ID2", task_ID: "2"};
  const action = removeTaskTC.fulfilled(params, "request_ID", params);
  const endState = tasksReducer(startState, action);

  expect(endState["todoList_ID1"].length).toBe(3);
  expect(endState["todoList_ID2"].length).toBe(2);
  expect(endState["todoList_ID2"].every(tl => tl.id !== "2")).toBeTruthy();
  expect(endState).toEqual({
    "todoList_ID1": [
      {
        id: "1", title: "HTML", todoListId: "todolist_ID1", description: "",
        status: TaskStatuses.Completed, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
      },
      {
        id: "2", title: "CSS", todoListId: "todolist_ID1", description: "",
        status: TaskStatuses.Completed, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
      },
      {
        id: "3", title: "React", todoListId: "todolist_ID1", description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
      },
    ],
    "todoList_ID2": [
      {
        id: "1", title: "Bread", todoListId: "todolist_ID2", description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
      },
      {
        id: "3", title: "Tea", todoListId: "todolist_ID2", description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
      },
    ],
  });
});

test("Correct task should be added to correct array", () => {
  const newTask: TaskType = {
    id: v1(),
    todoListId: "todoList_ID2",
    title: "Juice",
    description: "",
    status: TaskStatuses.New,
    priority: TaskPriorities.Low,
    startDate: "",
    deadline: "",
    addedDate: "",
    order: 0,
  };
  const params = {todoList_ID: newTask.todoListId, title: newTask.title};
  const action = addTaskTC.fulfilled(newTask, "request_ID", params);
  const endState = tasksReducer(startState, action);

  expect(endState["todoList_ID1"].length).toBe(3);
  expect(endState["todoList_ID2"].length).toBe(4);
  expect(endState["todoList_ID2"][0].id).toBeDefined();
  expect(endState["todoList_ID2"][0].title).toBe("Juice");
  expect(endState["todoList_ID2"][0].status).toBe(TaskStatuses.New);
});

test("Status of specified task should be changed", () => {
  const params = {
    todoList_ID: "todoList_ID2",
    task_ID: "2",
    model: {status: TaskStatuses.New}
  };
  const action = updateTaskTC.fulfilled(params, "request_ID", params);
  const endState = tasksReducer(startState, action);

  expect(endState["todoList_ID1"][1].status).toBe(TaskStatuses.Completed);
  expect(endState["todoList_ID2"][1].status).toBe(TaskStatuses.New);
});

test("Title of specified task should be changed", () => {
  const params = {
    todoList_ID: "todoList_ID2",
    task_ID: "2",
    model: {title: "Coffee"},
  }
  const action = updateTaskTC.fulfilled(params, "request_ID", params);
  const endState = tasksReducer(startState, action);

  expect(endState["todoList_ID1"][1].title).toBe("CSS");
  expect(endState["todoList_ID2"][1].title).toBe("Coffee");
});

test("Property with new array should be added when new todolist is added", () => {
  const newTodoList: TodoListType = {id: v1(), title: "New TodoList", addedDate: "", order: 0};
  const action = addTodoListTC.fulfilled(
    {todoList: newTodoList},
    "request_ID",
    newTodoList.title,
  );
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
  const action = removeTodoListTC.fulfilled(
    {id: "todoList_ID2"},
    "request_ID",
    "todoList_ID2"
  );
  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todoList_ID2"]).toBeUndefined();
});

test("Empty arrays should be added when todoLists are set", () => {
  const todoLists = {
    todoLists: [
      {id: "todoList_ID1", title: "What to learn", addedDate: "", order: 0},
      {id: "todoList_ID2", title: "What to buy", addedDate: "", order: 0},
    ]
  };
  const action = fetchTodoListsTC.fulfilled(todoLists, "request_ID");
  const endState = tasksReducer({}, action);
  const keys = Object.keys(endState);

  expect(keys.length).toBe(2);
  expect(endState["todoList_ID1"]).toStrictEqual([]);
  expect(endState["todoList_ID2"]).toStrictEqual([]);
});

test("Tasks should be added for todoList", () => {
  const action = fetchTasksTC.fulfilled(
    {todoList_ID: "todoList_ID1", tasks: startState["todoList_ID1"]},
    "request_ID",
    "todoList_ID1"
  );
  const endState = tasksReducer({
    "todoList_ID2": [],
    "todoList_ID1": [],
  }, action);

  expect(endState["todoList_ID1"].length).toBe(3);
  expect(endState["todoList_ID2"].length).toBe(0);
});
