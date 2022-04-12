import React, {useReducer} from 'react';
import './App.css';
import {TodoList} from "./components/ToDoList/TodoList";
import {v1} from "uuid";
import {AddItemForm} from "./components/AddItemForm/AddItemForm";
import {ButtonAppBar} from "./components/AppBar/ButtonAppBar";
import {Container, Grid, Paper} from "@mui/material";
import {
  addTodoListAC,
  changeTodoListFilterAC,
  changeTodoListTitleAC,
  removeTodoListAC,
  todoListsReducer
} from "./store/todoListsReducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./store/tasksReducer";

export type FilterValueType = "all" | "active" | "completed";

export type TaskType = {
  id: string
  title: string
  isDone: boolean
};

export type TasksType = {
  [todoList_ID: string]: Array<TaskType>
}

export type TodoListType = {
  id: string
  title: string
  filter: FilterValueType
};

function AppWithReducer() {
  const todoList_ID1 = v1();
  const todoList_ID2 = v1();

  const [todoLists, dispatchToTodoLists] = useReducer(todoListsReducer, [
    {id: todoList_ID1, title: "What to Learn", filter: "all"},
    {id: todoList_ID2, title: "What to Buy", filter: "all"},
  ]);

  const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
    [todoList_ID1]: [
      {id: v1(), title: "HTML&CSS", isDone: true},
      {id: v1(), title: "JS", isDone: true},
      {id: v1(), title: "ReactJS", isDone: false},
      {id: v1(), title: "Rest API", isDone: false},
      {id: v1(), title: "GraphQL", isDone: false},
    ],
    [todoList_ID2]: [
      {id: v1(), title: "Bread", isDone: true},
      {id: v1(), title: "Milk", isDone: false},
      {id: v1(), title: "Cheese", isDone: false},
      {id: v1(), title: "Salt", isDone: true},
      {id: v1(), title: "Sugar", isDone: false},
    ],
  });

  const addTask = (todoList_ID: string, title: string) => {
    dispatchToTasks(addTaskAC(todoList_ID, title));
  };

  const changeTaskTitle = (todoList_ID: string, task_ID: string, newTitle: string) => {
    dispatchToTasks(changeTaskTitleAC(todoList_ID, task_ID, newTitle));
  };

  const changeTaskStatus = (todoList_ID: string, task_ID: string, isDone: boolean) => {
    dispatchToTasks(changeTaskStatusAC(todoList_ID, task_ID, isDone));
  };

  const removeTask = (todoList_ID: string, task_ID: string) => {
    dispatchToTasks(removeTaskAC(todoList_ID, task_ID));
  };

  const addTodoList = (title: string) => {
    const action = addTodoListAC(title);
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
              tasksForTodoList = tasksForTodoList.filter(t => !t.isDone);
            }

            if (tl.filter === "completed") {
              tasksForTodoList = tasksForTodoList.filter(t => t.isDone);
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
