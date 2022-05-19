import React, {useState} from 'react';
import '../app/App.css';
import {TodoList} from "../features/TodoListsList/ToDoList/TodoList";
import {v1} from "uuid";
import {AddItemForm} from "../components/AddItemForm/AddItemForm";
import {ButtonAppBar} from "../components/AppBar/ButtonAppBar";
import {Container, Grid, Paper} from "@mui/material";
import {FilterValueType, TodoListDomainType} from "../features/TodoListsList/todoListsReducer";
import {TaskDomainType, TasksType} from "../features/TodoListsList/tasksReducer";
import {TaskPriorities, TaskStatuses, TaskType} from "../api/todoListsApi";


function AppWithState() {
  const todoList_ID1 = v1();
  const todoList_ID2 = v1();

  const [todoLists, setTodoLists] = useState<TodoListDomainType[]>([
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

  const [tasks, setTasks] = useState<TasksType>({
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
    const newTask: TaskDomainType = {
      id: v1(), title, todoListId: todoList_ID, description: "",
      status: TaskStatuses.New, priority: TaskPriorities.Low,
      startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
    };
    tasks[todoList_ID] = [newTask, ...tasks[todoList_ID]];
    setTasks({...tasks});
  };

  const changeTaskTitle = (todoList_ID: string, task_ID: string, newTitle: string) => {
    const task = tasks[todoList_ID].find(t => t.id === task_ID);
    if (task) {
      task.title = newTitle;
      setTasks({...tasks});
    }
  };

  const changeTaskStatus = (todoList_ID: string, task_ID: string, newStatus: TaskStatuses) => {
    const task = tasks[todoList_ID].find(t => t.id === task_ID);
    if (task) {
      task.status = newStatus;
      setTasks({...tasks});
    }
  };

  const removeTask = (todoList_ID: string, task_ID: string) => {
    tasks[todoList_ID] = tasks[todoList_ID].filter(t => t.id !== task_ID);
    setTasks({...tasks});
  };

  const addTodoList = (title: string) => {
    const newTodoList: TodoListDomainType = {
      id: v1(), title, addedDate: "", order: 0, filter: "all", entityStatus: "idle",
    };
    setTodoLists([newTodoList, ...todoLists]);
    setTasks({...tasks, [newTodoList.id]: []});
  };

  const changeTodoListTitle = (todoList_ID: string, newTitle: string) => {
    const todoList = todoLists.find(tl => tl.id === todoList_ID);
    if (todoList) {
      todoList.title = newTitle;
      setTodoLists([...todoLists]);
    }
  };

  const changeFilter = (todoList_ID: string, filterValue: FilterValueType) => {
    setTodoLists(todoLists.map(tl => tl.id === todoList_ID ? {
      ...tl,
      filter: filterValue
    } : tl));
  };

  const removeTodoList = (todoList_ID: string) => {
    setTodoLists(todoLists.filter(tl => tl.id !== todoList_ID));

    delete tasks[todoList_ID];
    setTasks({...tasks});
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

export default AppWithState;
