import React from "react";
import {ComponentStory, ComponentMeta} from "@storybook/react";
import {Task} from "./Task";
import {action} from "@storybook/addon-actions";
import {TaskPriorities, TaskStatuses} from "../../api/todoListsApi";

export default {
  title: 'TodoList/Task',
  component: Task,
} as ComponentMeta<typeof Task>;

const changeTaskStatusCallback = action("Task status changed");
const changeTaskTitleCallback = action("Task title changed");
const removeTaskCallback = action("Task removed");

const baseArgs = {
  changeTaskStatus: changeTaskStatusCallback,
  changeTaskTitle: changeTaskTitleCallback,
  removeTask: removeTaskCallback,
};

const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const TaskIsDone = Template.bind({});
TaskIsDone.args = {
  ...baseArgs,
  task: {
    id: "1", title: "HTML & CSS", todoListId: "todoList_ID1", description: "",
    status: TaskStatuses.Completed, priority: TaskPriorities.Low,
    startDate: "", deadline: "", addedDate: "", order: 0,
  },
  todoList_ID: "todoList_ID1",
};

export const TaskIsNotDone = Template.bind({});
TaskIsNotDone.args = {
  ...baseArgs,
  task: {
    id: "1", title: "React", todoListId: "todoList_ID2", description: "",
    status: TaskStatuses.New, priority: TaskPriorities.Low,
    startDate: "", deadline: "", addedDate: "", order: 0,
  },
  todoList_ID: "todoList_ID2",
};
