import React, {useEffect, useState} from "react";
import {todoListsAPI} from "../api/todoListsApi";

export default {
  title: 'TodoList/API'
};

export const GetTodoLists = () => {
  const [state, setState] = useState<any>(null);

  useEffect(() => {
    todoListsAPI.getTodoLists()
      .then(response => setState(response.data));
  }, []);

  return <div> {JSON.stringify(state)}</div>;
};

export const CreateNewTodoList = () => {
  const [state, setState] = useState<any>(null);
  const [newTodoListTitle, setNewTodoListTitle] = useState<string>("");

  const createTodoList = () => {
    todoListsAPI.createTodoList(newTodoListTitle)
      .then(response => setState(response.data));
  };

  return <div>
    {JSON.stringify(state)}
    <div>
      <input
        value={newTodoListTitle}
        onChange={(e) => setNewTodoListTitle(e.currentTarget.value)}
        placeholder={"New Todo List Title"}
      />
      <button onClick={createTodoList}>Create TodoList</button>
    </div>
  </div>;
};

export const DeleteTodoList = () => {
  const [state, setState] = useState<any>(null);
  const [todoListID, setTodoListID] = useState<string>("");

  const deleteTodoList = () => {
    todoListsAPI.deleteTodoList(todoListID)
      .then(response => setState(response.data));
  };

  return <div>
    {JSON.stringify(state)}
    <div>
      <input
        value={todoListID}
        onChange={(e) => setTodoListID(e.currentTarget.value)}
        placeholder={"Todo List ID"}
      />
      <button onClick={deleteTodoList}>Delete TodoList</button>
    </div>
  </div>;
};

export const UpdateTodoListTitle = () => {
  const [state, setState] = useState<any>(null);
  const [todoListID, setTodoListID] = useState<string>("");
  const [newTitle, setNewTitle] = useState<string>("");

  const updateTodoList = () => {
    todoListsAPI.updateTodoList(todoListID, newTitle)
      .then(response => setState(response.data));
  };

  return <div>
    {JSON.stringify(state)}
    <div>
      <input
        value={todoListID}
        onChange={(e) => setTodoListID(e.currentTarget.value)}
        placeholder={"Todo List ID"}
      />
      <input
        value={newTitle}
        onChange={(e) => setNewTitle(e.currentTarget.value)}
        placeholder={"New Title"}
      />
      <button onClick={updateTodoList}>Update TodoList</button>
    </div>
  </div>;
};


export const GetTasks = () => {
  const [state, setState] = useState<any>(null);
  const [todoListID, setTodoListID] = useState<string>("");

  const getTasks = () => {
    todoListsAPI.getTasks(todoListID)
      .then(response => setState(response.data));
  };

  return (
    <div>
      {JSON.stringify(state)}
      <div>
        <input
          value={todoListID}
          onChange={(e) => setTodoListID(e.currentTarget.value)}
          placeholder={"Todo List ID"}
        />
        <button onClick={getTasks}>Get Tasks</button>
      </div>
    </div>
  );
};

export const CreateNewTask = () => {
  const [state, setState] = useState<any>(null);
  const [todoListID, setTodoListID] = useState<string>("");
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");

  const createTask = () => {
    todoListsAPI.createTask(todoListID, newTaskTitle)
      .then(response => setState(response.data));
  };

  return (
    <div>
      {JSON.stringify(state)}
      <div>
        <input
          value={todoListID}
          onChange={(e) => setTodoListID(e.currentTarget.value)}
          placeholder={"Todo List ID"}
        />
        <input
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.currentTarget.value)}
          placeholder={"New Task Title"}
        />
        <button onClick={createTask}>Create Task</button>
      </div>
    </div>
  );
};

export const DeleteTask = () => {
  const [state, setState] = useState<any>(null);
  const [todoListID, setTodoListID] = useState<string>("");
  const [taskID, setTaskID] = useState<string>("");

  const deleteTask = () => {
    todoListsAPI.deleteTask(todoListID, taskID)
      .then(response => setState(response.data));
  };

  return (
    <div>
      {JSON.stringify(state)}
      <div>
        <input
          value={todoListID}
          onChange={(e) => setTodoListID(e.currentTarget.value)}
          placeholder={"Todo List ID"}
        />
        <input
          value={taskID}
          onChange={(e) => setTaskID(e.currentTarget.value)}
          placeholder={"Task ID"}
        />
        <button onClick={deleteTask}>Delete Task</button>
      </div>
    </div>
  );
};

export const UpdateTask = () => {
  const [state, setState] = useState<any>(null);
  const [todoListID, setTodoListID] = useState<string>("");
  const [taskID, setTaskID] = useState<string>("");
  const [newTitle, setNewTitle] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newStatus, setNewStatus] = useState<number>(0);
  const [newPriority, setNewPriority] = useState<number>(0);
  const [newStartDate, setNewStartDate] = useState<string>("");
  const [newDeadline, setNewDeadline] = useState<string>("");

  const updatedTask = {
    title: newTitle,
    description: newDescription,
    status: newStatus,
    priority: newPriority,
    startDate: newStartDate,
    deadline: newDeadline,
  };

  const updateTask = () => {
    todoListsAPI.updateTask(todoListID, taskID, updatedTask)
      .then(response => setState(response.data));
  };

  return (
    <div>
      {JSON.stringify(state)}
      <div>
        <input
          value={todoListID}
          onChange={(e) => setTodoListID(e.currentTarget.value)}
          placeholder={"Todo List ID"}
        />
        <input
          value={taskID}
          onChange={(e) => setTaskID(e.currentTarget.value)}
          placeholder={"Task ID"}
        />
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.currentTarget.value)}
          placeholder={"New Title"}
        />
        <input
          value={newDescription}
          onChange={(e) => setNewDescription(e.currentTarget.value)}
          placeholder={"New Description"}
        />
        <input
          value={newStatus}
          onChange={(e) => setNewStatus(e.currentTarget.valueAsNumber)}
          type={"number"}
          placeholder={"New Status"}
        />
        <input
          value={newPriority}
          onChange={(e) => setNewPriority(e.currentTarget.valueAsNumber)}
          type={"number"}
          placeholder={"New Priority"}
        />
        <input
          value={newStartDate}
          onChange={(e) => setNewStartDate(e.currentTarget.value)}
          placeholder={"New Start Date"}
        />
        <input
          value={newDeadline}
          onChange={(e) => setNewDeadline(e.currentTarget.value)}
          placeholder={"New Deadline"}
        />
        <button onClick={updateTask}>Update Task</button>
      </div>
    </div>
  );
};
