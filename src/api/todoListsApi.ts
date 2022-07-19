import axios from "axios";

// Types
export type TodoListType = {
  id: string
  title: string
  addedDate: string
  order: number
};

export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  High = 2,
  Urgent = 3,
  Later = 4,
}

export type TaskType = {
  todoListId: string
  id: string
  title: string
  description: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  addedDate: string
  order: number
};
export type UpdateTaskRequestDataType = {
  title: string
  description: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
};
export type ResponseType<D = {}> = {
  data: D
  resultCode: number
  messages: Array<string>
  fieldsErrors: Array<string>
};
export type GetTasksResponseType = {
  items: Array<TaskType>
  totalCount: number
  error: string
};
export type LoginParamsType = {
  email: string
  password: string
  rememberMe?: boolean
  captcha?: string
};
export type MeResponseDataType = ResponseType<{ id: number, email: string, login: string }>;
export type LoginResponseDataType = ResponseType<{ userId?: number }>;

// Axios settings
const settings = {
  withCredentials: true,
  headers: {
    "API-KEY": "07a6853a-00ae-46be-89bd-7635822fedbc",
  },
};
const axiosInstance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  ...settings,
});

// API
export const todoListsAPI = {
  getTodoLists() {
    return axiosInstance
      .get<Array<TodoListType>>("todo-lists");
  },
  createTodoList(title: string) {
    return axiosInstance
      .post<ResponseType<{ item: TodoListType }>>("todo-lists", {title})
      .then(response => response.data);
  },
  deleteTodoList(id: string) {
    return axiosInstance
      .delete<ResponseType>(`todo-lists/${id}`)
      .then(response => response.data);
  },
  updateTodoList(id: string, newTitle: string) {
    return axiosInstance
      .put<ResponseType>(`todo-lists/${id}`, {title: newTitle})
      .then(response => response.data);
  },
  getTasks(todoList_ID: string) {
    return axiosInstance
      .get<GetTasksResponseType>(`todo-lists/${todoList_ID}/tasks?page=1&count=5`)
      .then(response => response.data);
  },
  createTask(todoList_ID: string, title: string) {
    return axiosInstance
      .post<ResponseType<{ item: TaskType }>>(
        `todo-lists/${todoList_ID}/tasks`,
        {title}
      )
      .then(response => response.data);
  },
  deleteTask(todoList_ID: string, task_ID: string) {
    return axiosInstance
      .delete<ResponseType>(`todo-lists/${todoList_ID}/tasks/${task_ID}`)
      .then(response => response.data);
  },
  updateTask(todoList_ID: string, task_ID: string, taskModel: UpdateTaskRequestDataType) {
    return axiosInstance
      .put<ResponseType<{ item: TaskType }>>(
        `todo-lists/${todoList_ID}/tasks/${task_ID}`,
        taskModel,
      );
  },
};
export const authAPI = {
  me() {
    return axiosInstance
      .get<MeResponseDataType>("auth/me")
      .then(response => response.data);
  },
  login(data: LoginParamsType) {
    return axiosInstance
      .post<LoginResponseDataType>("auth/login", data)
      .then(response => response.data);
  },
  logout() {
    return axiosInstance
      .delete<ResponseType>("auth/login")
      .then(response => response.data);
  },
};
