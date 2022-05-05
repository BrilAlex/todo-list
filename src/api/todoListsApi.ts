import axios from "axios";

export type TodoListType = {
  id: string
  title: string
  addedDate: string
  order: number
};

export type TaskType = {
  todoListId: string
  id: string
  title: string
  description: string
  status: number
  priority: number
  startDate: string
  deadline: string
  addedDate: string
  order: number
};

type UpdateTaskRequestDataType = {
  title: string
  description: string
  status: number
  priority: number
  startDate: string
  deadline: string
};

type ResponseType<D = {}> = {
  data: D
  resultCode: number
  messages: Array<string>
  fieldsErrors: Array<string>
};

type GetTasksResponseType = {
  items: Array<TaskType>
  totalCount: number
  error: string
};

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

export const todoListsAPI = {
  getTodoLists() {
    return axiosInstance
      .get<Array<TodoListType>>("todo-lists");
  },
  createTodoList(title: string) {
    return axiosInstance
      .post<ResponseType<{ item: TodoListType }>>("todo-lists", {title});
  },
  deleteTodoList(id: string) {
    return axiosInstance
      .delete<ResponseType>(`todo-lists/${id}`);
  },
  updateTodoList(id: string, newTitle: string) {
    return axiosInstance
      .put<ResponseType>(`todo-lists/${id}`, {title: newTitle});
  },
  getTasks(todoList_ID: string) {
    return axiosInstance
      .get<GetTasksResponseType>(`todo-lists/${todoList_ID}/tasks?page=1&count=5`);
  },
  createTask(todoList_ID: string, title: string) {
    return axiosInstance
      .post<ResponseType<{ item: TaskType }>>(
        `todo-lists/${todoList_ID}/tasks`,
        {title}
      );
  },
  deleteTask(todoList_ID: string, task_ID: string) {
    return axiosInstance
      .delete<ResponseType>(`todo-lists/${todoList_ID}/tasks/${task_ID}`);
  },
  updateTask(todoList_ID: string, task_ID: string, task: UpdateTaskRequestDataType) {
    return axiosInstance
      .put<ResponseType<{ item: TaskType }>>(
        `todo-lists/${todoList_ID}/tasks/${task_ID}`,
        task,
      );
  },
};