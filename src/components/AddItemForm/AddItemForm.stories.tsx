import React from "react";
import {ComponentStory, ComponentMeta} from "@storybook/react";
import {AddItemForm} from "./AddItemForm";
import {action} from "@storybook/addon-actions";

export default {
  title: 'TodoList/AddItemForm',
  component: AddItemForm,
  argTypes: {
    addItem: {
      description: "Add item callback",
    },
  },
} as ComponentMeta<typeof AddItemForm>;

const asyncCallback = async (...params: any[]) => {
  action("Item added")(...params);
};

const Template: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args} />;

export const AddItemFormExample = Template.bind({});
AddItemFormExample.args = {
  addItem: asyncCallback,
};

export const AddItemFormDisabledExample = Template.bind({});
AddItemFormDisabledExample.args = {
  addItem: asyncCallback,
  disabled: true,
};