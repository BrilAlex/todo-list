import React, {useReducer} from 'react';
import '../app/App.css';
import {TodoList} from "../features/TodoListsList/ToDoList/TodoList";
import {v1} from "uuid";
import {AddItemForm} from "../components/AddItemForm/AddItemForm";
import {ButtonAppBar} from "../components/AppBar/ButtonAppBar";
import {Container, Grid, Paper} from "@mui/material";
import {
  addTodoListTC,
  changeTodoListFilterAC, changeTodoListTitleTC,
  FilterValueType, removeTodoListTC,
  todoListsReducer
} from "../features/TodoListsList/todoListsReducer";
import {
  addTaskTC,
  removeTaskTC,
  tasksReducer, updateTaskTC
} from "../features/TodoListsList/tasksReducer";
import {TaskPriorities, TaskStatuses} from "../api/types";


function AppWithReducer() {
  const todoList_ID1 = v1();
  const todoList_ID2 = v1();

  const [todoLists, dispatchToTodoLists] = useReducer(todoListsReducer, [
    {
      id: todoList_ID1,
      title: "What to Learn",
      addedDate: "",
      order: 0,
      filter: "all",
      entityStatus: "idle"
    },
    {
      id: todoList_ID2,
      title: "What to Buy",
      addedDate: "",
      order: 1,
      filter: "all",
      entityStatus: "idle"
    },
  ]);

  const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
    [todoList_ID1]: [
      {
        id: v1(), title: "HTML&CSS", todoListId: todoList_ID1, description: "",
        status: TaskStatuses.Completed, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
      },
      {
        id: v1(), title: "JS", todoListId: todoList_ID1, description: "",
        status: TaskStatuses.Completed, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
      },
      {
        id: v1(), title: "ReactJS", todoListId: todoList_ID1, description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
      },
      {
        id: v1(), title: "Rest API", todoListId: todoList_ID1, description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
      },
      {
        id: v1(), title: "GraphQL", todoListId: todoList_ID1, description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
      },
    ],
    [todoList_ID2]: [
      {
        id: v1(), title: "Bread", todoListId: todoList_ID2, description: "",
        status: TaskStatuses.Completed, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
      },
      {
        id: v1(), title: "Milk", todoListId: todoList_ID2, description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
      },
      {
        id: v1(), title: "Cheese", todoListId: todoList_ID2, description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
      },
      {
        id: v1(), title: "Salt", todoListId: todoList_ID2, description: "",
        status: TaskStatuses.Completed, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
      },
      {
        id: v1(), title: "Sugar", todoListId: todoList_ID2, description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
      },
    ],
  });

  const addTask = (todoList_ID: string, title: string) => {
    const newTask = {
      id: v1(), title: title, todoListId: todoList_ID, description: "",
      status: TaskStatuses.New, priority: TaskPriorities.Low,
      startDate: "", deadline: "", addedDate: "", order: 0,
    };
    const params = {todoList_ID: newTask.todoListId, title: newTask.title};
    dispatchToTasks(addTaskTC.fulfilled(newTask, "request_ID", params));
  };

  const changeTaskTitle = (todoList_ID: string, task_ID: string, newTitle: string) => {
    const params = {todoList_ID, task_ID, model: {title: newTitle}}
    dispatchToTasks(updateTaskTC.fulfilled(params, "request_ID", params));
  };

  const changeTaskStatus = (todoList_ID: string, task_ID: string, newStatus: TaskStatuses) => {
    const params = {todoList_ID, task_ID, model: {status: newStatus}}
    dispatchToTasks(updateTaskTC.fulfilled(params, "request_ID", params));
  };

  const removeTask = (todoList_ID: string, task_ID: string) => {
    dispatchToTasks(removeTaskTC.fulfilled(
      {todoList_ID, task_ID},
      "request_ID",
      {todoList_ID, task_ID}
    ));
  };

  const addTodoList = (title: string) => {
    const newTodoList = {id: v1(), title, addedDate: "", order: 0};
    const action = addTodoListTC.fulfilled({todoList: newTodoList}, "request_ID", title);
    dispatchToTodoLists(action);
    dispatchToTasks(action);
  };

  const changeTodoListTitle = (todoList_ID: string, newTitle: string) => {
    dispatchToTodoLists(changeTodoListTitleTC.fulfilled(
      {id: todoList_ID, title: newTitle},
      "request_ID",
      {todoList_ID, newTitle}
    ));
  };

  const changeFilter = (todoList_ID: string, filterValue: FilterValueType) => {
    dispatchToTodoLists(changeTodoListFilterAC({id: todoList_ID, filter: filterValue}));
  };

  const removeTodoList = (todoList_ID: string) => {
    const action = removeTodoListTC.fulfilled({id: todoList_ID}, "request_ID", todoList_ID);
    dispatchToTodoLists(action);
    dispatchToTasks(action);
  };

  return (
    <div className="App">
      <ButtonAppBar/>
      <Container fixed>
        <Grid container style={{padding: "20px"}}>
          <AddItemForm addItem={addTodoList}/>
        </Grid>
        <Grid container spacing={3}>
          {todoLists.map(tl => {
            let tasksForTodoList = tasks[tl.id];

            if (tl.filter === "active") {
              tasksForTodoList = tasksForTodoList.filter(t => t.status === TaskStatuses.New);
            }

            if (tl.filter === "completed") {
              tasksForTodoList = tasksForTodoList.filter(t => t.status === TaskStatuses.Completed);
            }

            return (
              <Grid key={tl.id} item>
                <Paper elevation={5} style={{padding: "15px"}}>
                  <TodoList
                    todoList={tl}
                    tasks={tasksForTodoList}
                    addTask={addTask}
                    changeTaskTitle={changeTaskTitle}
                    changeTodoListTitle={changeTodoListTitle}
                    changeTaskStatus={changeTaskStatus}
                    removeTask={removeTask}
                    changeFilter={changeFilter}
                    removeTodoList={removeTodoList}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
}

export default AppWithReducer;
