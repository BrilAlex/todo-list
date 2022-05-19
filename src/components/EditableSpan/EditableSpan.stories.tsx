import React from "react";
import {ComponentStory, ComponentMeta} from "@storybook/react";
import {EditableSpan} from "./EditableSpan";
import {action} from "@storybook/addon-actions";

export default {
  title: 'TodoList/EditableSpan',
  component: EditableSpan,
  argTypes: {
    setNewValue: {
      description: "Change EditableSpan value callback",
    },
    value: {
      defaultValue: "HTML",
      description: "EditableSpan start value",
    },
  },
} as ComponentMeta<typeof EditableSpan>;

const Template: ComponentStory<typeof EditableSpan> = (args) => <EditableSpan {...args} />;

export const EditableSpanExample = Template.bind({});
EditableSpanExample.args = {
  setNewValue: action("EditableSpan value changed"),
};

export const EditableSpanDisabledExample = Template.bind({});
EditableSpanDisabledExample.args = {
  setNewValue: action("EditableSpan value changed"),
  disabled: true,
};
