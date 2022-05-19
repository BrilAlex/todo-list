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

const Template: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args} />;

export const AddItemFormExample = Template.bind({});
AddItemFormExample.args = {
  addItem: action("Item added"),
};

export const AddItemFormDisabledExample = Template.bind({});
AddItemFormDisabledExample.args = {
  addItem: action("Item added"),
  disabled: true,
};