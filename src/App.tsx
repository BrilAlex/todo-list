import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./components/TodoList/TodoList";
import {v1} from "uuid";
import {AddItemForm} from "./components/AddItemForm/AddItemForm";

export type FilterValueType = "all" | "active" | "completed";

type TodoListType = {
    id: string
    title: string
    filter: FilterValueType
}

export type TaskType = {
    id: string
    title: string
    isDone: boolean
};

export type TasksType = {
    [key: string]: Array<TaskType>
}

function App() {
    const todoList1_ID = v1();
    const todoList2_ID = v1();

    const [todoLists, setTodoLists] = useState<Array<TodoListType>>([
        {id: todoList1_ID, title: "What to Learn", filter: "all"},
        {id: todoList2_ID, title: "What to Buy", filter: "all"},
    ]);

    const [tasks, setTasks] = useState<TasksType>({
        [todoList1_ID]: [
            {id: v1(), title: "HTML", isDone: true},
            {id: v1(), title: "CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "React", isDone: false},
            {id: v1(), title: "Redux", isDone: false},
        ],
        [todoList2_ID]: [
            {id: v1(), title: "Bead", isDone: true},
            {id: v1(), title: "Milk", isDone: true},
            {id: v1(), title: "Sugar", isDone: false},
            {id: v1(), title: "Salt", isDone: false},
            {id: v1(), title: "Cheese", isDone: false},
        ],
    });

    function addTask(todoList_ID: string, title: string) {
        setTasks({
            ...tasks,
            [todoList_ID]: [...tasks[todoList_ID], {id: v1(), title, isDone: false}]
        })
    }

    function changeTaskTitle(todoList_ID: string, task_ID: string, title: string) {
        setTasks({
            ...tasks,
            [todoList_ID]: tasks[todoList_ID].map(t =>
                t.id === task_ID ? {...t, title}: t)});
    }

    function changeTaskStatus(todoList_ID: string, task_ID: string, isDone: boolean) {
        setTasks({
            ...tasks,
            [todoList_ID]: tasks[todoList_ID].map(t =>
                t.id === task_ID ? {...t, isDone} : t)
        });
    }

    function removeTask(todoList_ID: string, task_ID: string) {
        setTasks({
            ...tasks,
            [todoList_ID]: tasks[todoList_ID].filter(t => t.id !== task_ID)
        });
    }

    function addTodoList(title: string) {
        const newTodoList_ID = v1();
        setTodoLists([...todoLists, {id: newTodoList_ID, title, filter: "all"}]);
        setTasks({...tasks, [newTodoList_ID]: []});
    }

    function changeTodoListTitle(todoList_ID: string, title: string) {
        setTodoLists(todoLists.map(tdl => tdl.id === todoList_ID ? {...tdl, title} : tdl));
    }

    function changeFilter(todoList_ID: string, filterValue: FilterValueType) {
        setTodoLists(todoLists.map(tdl =>
            tdl.id === todoList_ID ? {...tdl, filter: filterValue} : tdl));
    }

    function removeTodoList(todoList_ID: string) {
        setTodoLists(todoLists.filter(tdl => tdl.id !== todoList_ID));
        delete tasks[todoList_ID];
        setTasks({...tasks});
    }

    return (
        <div className="App">
            <AddItemForm callback={addTodoList}/>
            {todoLists.map(tdl => {
                let filteredTasks = tasks[tdl.id];
                if(tdl.filter === "active")
                    filteredTasks = tasks[tdl.id].filter(t => !t.isDone);
                if(tdl.filter === "completed")
                    filteredTasks = tasks[tdl.id].filter(t => t.isDone);

                return (
                    <TodoList
                        key={tdl.id}
                        id={tdl.id}
                        title={tdl.title}
                        tasks={filteredTasks}
                        addTask={addTask}
                        changeTaskTitle={changeTaskTitle}
                        changeTaskStatus={changeTaskStatus}
                        removeTask={removeTask}
                        filter={tdl.filter}
                        changeTodoListTitle={changeTodoListTitle}
                        changeFilter={changeFilter}
                        removeTodoList={removeTodoList}
                    />
                )
            })}
        </div>
    );
}

export default App;
