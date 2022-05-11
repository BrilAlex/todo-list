import React, {useReducer} from 'react';
import '../app/App.css';
import {TodoList} from "../features/TodoListsList/ToDoList/TodoList";
import {v1} from "uuid";
import {AddItemForm} from "../components/AddItemForm/AddItemForm";
import {ButtonAppBar} from "../components/AppBar/ButtonAppBar";
import {Container, Grid, Paper} from "@mui/material";
import {
  addTodoListAC,
  changeTodoListFilterAC,
  changeTodoListTitleAC, FilterValueType,
  removeTodoListAC,
  todoListsReducer
} from "../features/TodoListsList/todoListsReducer";
import {
  addTaskAC,
  removeTaskAC,
  tasksReducer, updateTaskAC
} from "../features/TodoListsList/tasksReducer";
import {TaskPriorities, TaskStatuses} from "../api/todoListsApi";


function AppWithReducer() {
  const todoList_ID1 = v1();
  const todoList_ID2 = v1();

  const [todoLists, dispatchToTodoLists] = useReducer(todoListsReducer, [
    {id: todoList_ID1, title: "What to Learn", addedDate: "", order: 0, filter: "all"},
    {id: todoList_ID2, title: "What to Buy", addedDate: "", order: 1, filter: "all"},
  ]);

  const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
    [todoList_ID1]: [
      {
        id: v1(), title: "HTML&CSS", todoListId: todoList_ID1, description: "",
        status: TaskStatuses.Completed, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
      {
        id: v1(), title: "JS", todoListId: todoList_ID1, description: "",
        status: TaskStatuses.Completed, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
      {
        id: v1(), title: "ReactJS", todoListId: todoList_ID1, description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
      {
        id: v1(), title: "Rest API", todoListId: todoList_ID1, description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
      {
        id: v1(), title: "GraphQL", todoListId: todoList_ID1, description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
    ],
    [todoList_ID2]: [
      {
        id: v1(), title: "Bread", todoListId: todoList_ID2, description: "",
        status: TaskStatuses.Completed, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
      {
        id: v1(), title: "Milk", todoListId: todoList_ID2, description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
      {
        id: v1(), title: "Cheese", todoListId: todoList_ID2, description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
      {
        id: v1(), title: "Salt", todoListId: todoList_ID2, description: "",
        status: TaskStatuses.Completed, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
      {
        id: v1(), title: "Sugar", todoListId: todoList_ID2, description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
    ],
  });

  const addTask = (todoList_ID: string, title: string) => {
    const newTask = {
      id: v1(), title: title, todoListId: todoList_ID, description: "",
      status: TaskStatuses.New, priority: TaskPriorities.Low,
      startDate: "", deadline: "", addedDate: "", order: 0,
    };
    dispatchToTasks(addTaskAC(newTask));
  };

  const changeTaskTitle = (todoList_ID: string, task_ID: string, newTitle: string) => {
    dispatchToTasks(updateTaskAC(todoList_ID, task_ID, {title: newTitle}));
  };

  const changeTaskStatus = (todoList_ID: string, task_ID: string, newStatus: TaskStatuses) => {
    dispatchToTasks(updateTaskAC(todoList_ID, task_ID, {status: newStatus}));
  };

  const removeTask = (todoList_ID: string, task_ID: string) => {
    dispatchToTasks(removeTaskAC(todoList_ID, task_ID));
  };

  const addTodoList = (title: string) => {
    const newTodoList = {id: v1(), title, addedDate: "", order: 0};
    const action = addTodoListAC(newTodoList);
    dispatchToTodoLists(action);
    dispatchToTasks(action);
  };

  const changeTodoListTitle = (todoList_ID: string, newTitle: string) => {
    dispatchToTodoLists(changeTodoListTitleAC(todoList_ID, newTitle));
  };

  const changeFilter = (todoList_ID: string, filterValue: FilterValueType) => {
    dispatchToTodoLists(changeTodoListFilterAC(todoList_ID, filterValue));
  };

  const removeTodoList = (todoList_ID: string) => {
    dispatchToTodoLists(removeTodoListAC(todoList_ID));
    dispatchToTasks(removeTodoListAC(todoList_ID));
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
                    id={tl.id}
                    title={tl.title}
                    tasks={tasksForTodoList}
                    filter={tl.filter}
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
