import React, {useCallback, useEffect} from "react";
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {Task} from "./Task/Task";
import {TaskStatuses} from "../../../api/todoListsApi";
import {FilterValueType, TodoListDomainType} from "../todoListsReducer";
import {useDispatch} from "react-redux";
import {fetchTasksTC, TaskDomainType} from "../tasksReducer";

type TodoListPropsType = {
  todoList: TodoListDomainType
  tasks: Array<TaskDomainType>
  addTask: (todoList_ID: string, title: string) => void
  changeTaskTitle: (todoList_ID: string, task_ID: string, newTitle: string) => void
  changeTaskStatus: (todoList_ID: string, task_ID: string, newStatus: TaskStatuses) => void
  removeTask: (todoList_ID: string, task_ID: string) => void
  changeTodoListTitle: (todoList_ID: string, newTitle: string) => void
  changeFilter: (todoList_ID: string, filterValue: FilterValueType) => void
  removeTodoList: (todoList_ID: string) => void
  demoMode?: boolean
};

export const TodoList = React.memo(({demoMode = false, ...props}: TodoListPropsType) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (demoMode) {
      return;
    }
    dispatch(fetchTasksTC(props.todoList.id));
  }, [dispatch, demoMode, props.todoList.id]);

  let tasksForTodoList = props.tasks;
  if (props.todoList.filter === "active") {
    tasksForTodoList = tasksForTodoList.filter(t => t.status === TaskStatuses.New);
  }
  if (props.todoList.filter === "completed") {
    tasksForTodoList = tasksForTodoList.filter(t => t.status === TaskStatuses.Completed);
  }

  const changeTodoListTitle = useCallback((newTitle: string) => {
    props.changeTodoListTitle(props.todoList.id, newTitle);
  }, [props.changeTodoListTitle, props.todoList.id]);

  const changeFilter = useCallback((filterValue: FilterValueType) => {
    props.changeFilter(props.todoList.id, filterValue);
  }, [props.changeFilter, props.todoList.id]);

  const removeTodoList = useCallback(() => {
    props.removeTodoList(props.todoList.id)
  }, [props.removeTodoList, props.todoList.id]);

  const addTask = useCallback((title: string) => {
    props.addTask(props.todoList.id, title);
  }, [props.addTask, props.todoList.id]);

  return (
    <div>
      <h3>
        <EditableSpan
          value={props.todoList.title}
          setNewValue={changeTodoListTitle}
          disabled={props.todoList.entityStatus === "loading"}
        />
        <IconButton onClick={removeTodoList} disabled={props.todoList.entityStatus === "loading"}>
          <Delete/>
        </IconButton>
      </h3>
      <AddItemForm addItem={addTask} disabled={props.todoList.entityStatus === "loading"}/>
      <div>
        {tasksForTodoList.map((t) =>
          <Task
            key={t.id}
            task={t}
            todoList_ID={props.todoList.id}
            changeTaskTitle={props.changeTaskTitle}
            changeTaskStatus={props.changeTaskStatus}
            removeTask={props.removeTask}
          />
        )}
      </div>
      <div>
        <Button
          onClick={() => changeFilter("all")}
          variant={props.todoList.filter === "all" ? "outlined" : "text"}
          color={"primary"}
        >
          All
        </Button>
        <Button
          onClick={() => changeFilter("active")}
          variant={props.todoList.filter === "active" ? "outlined" : "text"}
          color={"error"}
        >
          Active
        </Button>
        <Button
          onClick={() => changeFilter("completed")}
          variant={props.todoList.filter === "completed" ? "outlined" : "text"}
          color={"success"}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});