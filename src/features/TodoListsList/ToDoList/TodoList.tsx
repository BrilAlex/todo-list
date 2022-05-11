import React, {useCallback, useEffect} from "react";
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "../../../api/todoListsApi";
import {FilterValueType} from "../todoListsReducer";
import {useDispatch} from "react-redux";
import {fetchTasksTC} from "../tasksReducer";

type TodoListPropsType = {
  id: string
  title: string
  tasks: Array<TaskType>
  filter: FilterValueType
  addTask: (todoList_ID: string, title: string) => void
  changeTaskTitle: (todoList_ID: string, task_ID: string, newTitle: string) => void
  changeTaskStatus: (todoList_ID: string, task_ID: string, newStatus: TaskStatuses) => void
  removeTask: (todoList_ID: string, task_ID: string) => void
  changeTodoListTitle: (todoList_ID: string, newTitle: string) => void
  changeFilter: (todoList_ID: string, filterValue: FilterValueType) => void
  removeTodoList: (todoList_ID: string) => void
};

export const TodoList = React.memo((props: TodoListPropsType) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTasksTC(props.id));
  }, [dispatch, props.id]);

  let tasksForTodoList = props.tasks;
  if (props.filter === "active") {
    tasksForTodoList = tasksForTodoList.filter(t => t.status === TaskStatuses.New);
  }
  if (props.filter === "completed") {
    tasksForTodoList = tasksForTodoList.filter(t => t.status === TaskStatuses.Completed);
  }

  const changeTodoListTitle = useCallback((newTitle: string) => {
    props.changeTodoListTitle(props.id, newTitle);
  }, [props.changeTodoListTitle, props.id]);

  const changeFilter = useCallback((filterValue: FilterValueType) => {
    props.changeFilter(props.id, filterValue);
  }, [props.changeFilter, props.id]);

  const removeTodoList = useCallback(() => {
    props.removeTodoList(props.id)
  }, [props.removeTodoList, props.id]);

  const addTask = useCallback((title: string) => {
    props.addTask(props.id, title);
  }, [props.addTask, props.id]);

  return (
    <div>
      <h3>
        <EditableSpan value={props.title} setNewValue={changeTodoListTitle}/>
        <IconButton onClick={removeTodoList}>
          <Delete/>
        </IconButton>
      </h3>
      <AddItemForm addItem={addTask}/>
      <div>
        {tasksForTodoList.map((t) =>
          <Task
            key={t.id}
            task={t}
            todoList_ID={props.id}
            changeTaskTitle={props.changeTaskTitle}
            changeTaskStatus={props.changeTaskStatus}
            removeTask={props.removeTask}
          />
        )}
      </div>
      <div>
        <Button
          onClick={() => changeFilter("all")}
          variant={props.filter === "all" ? "outlined" : "text"}
          color={"primary"}
        >
          All
        </Button>
        <Button
          onClick={() => changeFilter("active")}
          variant={props.filter === "active" ? "outlined" : "text"}
          color={"error"}
        >
          Active
        </Button>
        <Button
          onClick={() => changeFilter("completed")}
          variant={props.filter === "completed" ? "outlined" : "text"}
          color={"success"}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});