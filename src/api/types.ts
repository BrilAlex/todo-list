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
export type FieldErrorType = {
  field: string
  error: string
};
export type ResponseType<D = {}> = {
  data: D
  resultCode: number
  messages: Array<string>
  fieldsErrors: Array<FieldErrorType>
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
