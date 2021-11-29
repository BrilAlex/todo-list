import React, {useCallback} from "react";
import {FilterValueType, TaskType} from "../../App";
import {AddItemForm} from "../AddItemForm/AddItemForm";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {Task} from "../Task/Task";

type TodoListPropsType = {
  id: string
  title: string
  tasks: Array<TaskType>
  addTask: (todoList_ID: string, taskTitle: string) => void
  changeTaskTitle: (todoList_ID: string, task_ID: string, taskTitle: string) => void
  changeTaskStatus: (todoList_ID: string, task_ID: string, taskStatus: boolean) => void
  removeTask: (todoList_ID: string, task_ID: string) => void
  filter: FilterValueType
  changeTodoListTitle: (todoList_ID: string, todoListTitle: string) => void
  changeFilter: (todoList_ID: string, filter: FilterValueType) => void
  removeTodoList: (todoList_ID: string) => void
};

export const TodoList = React.memo((props: TodoListPropsType) => {
  console.log("TodoList called");
  const {
    id,
    title,
    tasks,
    addTask,
    changeTaskTitle,
    changeTaskStatus,
    removeTask,
    filter,
    changeTodoListTitle,
    changeFilter,
    removeTodoList,
  } = props;

  let filteredTasks = tasks;
  if (filter === "Active") filteredTasks = tasks.filter(t => !t.isDone);
  if (filter === "Completed") filteredTasks = tasks.filter(t => t.isDone);

  const addTaskHandler = useCallback((title: string) => {
    addTask(id, title)
  }, [addTask, id]);
  const changeTaskTitleHandler = useCallback((task_ID: string, title: string) => {
    changeTaskTitle(id, task_ID, title)
  }, [changeTaskTitle, id]);
  const changeTaskStatusHandler = useCallback((task_ID: string, taskStatus: boolean) => {
    changeTaskStatus(id, task_ID, taskStatus)
  }, [changeTaskStatus, id]);
  const removeTaskHandler = useCallback((task_ID: string) => {
    removeTask(id, task_ID)
  }, [removeTask, id]);

  const changeTodoListTittleHandler = useCallback((title: string) => {
    changeTodoListTitle(id, title)
  }, [changeTodoListTitle, id]);
  const changeFilterHandler = useCallback((filter: FilterValueType) => {
    changeFilter(id, filter)
  }, [changeFilter, id]);
  const removeTodoListHandler = useCallback(() => {
    removeTodoList(id)
  }, [removeTodoList, id]);

  return (
    <div>
      <h3>
        <EditableSpan value={title} callback={changeTodoListTittleHandler}/>
        <IconButton onClick={removeTodoListHandler}>
          <Delete/>
        </IconButton>
      </h3>
      <AddItemForm callback={addTaskHandler}/>
      <div>
        {filteredTasks.map(t =>
          <Task
            key={t.id}
            task={t}
            changeTaskTitle={changeTaskTitleHandler}
            changeTaskStatus={changeTaskStatusHandler}
            removeTask={removeTaskHandler}
          />
        )}
      </div>
      <div>
        <Button
          variant={filter === "All" ? "outlined" : "text"}
          onClick={() => changeFilterHandler("All")}
          color={"default"}
        >
          All
        </Button>
        <Button
          variant={filter === "Active" ? "outlined" : "text"}
          onClick={() => changeFilterHandler("Active")}
          color={"primary"}
        >
          Active
        </Button>
        <Button
          variant={filter === "Completed" ? "outlined" : "text"}
          onClick={() => changeFilterHandler("Completed")}
          color={"secondary"}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});