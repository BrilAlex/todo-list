import React, {useState} from 'react';
import './App.css';
import {TodoList} from './components/TodoList/TodoList';
import {v1} from "uuid";

export type FilterValuesType = "all" | "active" | "completed";

type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type TasksType = {
    [key: string]: TaskType[]
}

function App() {
    const TodoList_1_ID = v1();
    const TodoList_2_ID = v1();

    const [todoLists, setTodoLists] = useState<Array<TodoListType>>([
        {id: TodoList_1_ID, title: "What to learn", filter: "all"},
        {id: TodoList_2_ID, title: "What to buy", filter: "all"}
    ]);

    const [tasks, setTasks] = useState<TasksType>({
        [TodoList_1_ID]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Rest API", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false},
        ],
        [TodoList_2_ID]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: v1(), title: "Bead", isDone: true},
            {id: v1(), title: "Salt", isDone: false},
            {id: v1(), title: "Sugar", isDone: false},
            {id: v1(), title: "Drinks", isDone: false},
        ]
    });

    const addNewTask = (todoList_Id: string, taskTitle: string) => {
        let newTask = {id: v1(), title: taskTitle, isDone: false};
        setTasks({...tasks, [todoList_Id]: [newTask, ...tasks[todoList_Id]]})
    }

    function removeTask(todoList_Id: string, task_Id: string) {
        setTasks({
            ...tasks,
            [todoList_Id]: tasks[todoList_Id].filter(t => t.id !== task_Id)
        });
    }

    function changeTaskStatus(todoList_Id: string, taskId: string, isDone: boolean) {
        setTasks({
          ...tasks,
          [todoList_Id]: tasks[todoList_Id].map(t => t.id === taskId ? {...t, isDone} : t)
        });
    }

    function changeFilter(todoList_Id: string, filter: FilterValuesType) {
        setTodoLists(todoLists.map(tdl => tdl.id === todoList_Id ? {...tdl, filter} : tdl));
    }

    function removeTodoList(todoList_Id: string) {
        setTodoLists(todoLists.filter(tdl => tdl.id !== todoList_Id))
    }

    const todoListsToRender = todoLists.map(tdl => {
        let tasksForTodolist = tasks[tdl.id];
        if (tdl.filter === "active") {
            tasksForTodolist = tasks[tdl.id].filter(t => !t.isDone);
        }
        if (tdl.filter === "completed") {
            tasksForTodolist = tasks[tdl.id].filter(t => t.isDone);
        }
        return <TodoList
            key={tdl.id}
            id={tdl.id}
            title={tdl.title}
            tasks={tasksForTodolist}
            filter={tdl.filter}
            addNewTask={addNewTask}
            removeTask={removeTask}
            changeTaskStatus={changeTaskStatus}
            changeFilter={changeFilter}
            removeTodoList={removeTodoList}
        />
    });

    return (
        <div className="App">
          {todoListsToRender}
        </div>
    );
}

export default App;
