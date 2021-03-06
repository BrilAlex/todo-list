import React from "react";
import {ComponentMeta, Story} from "@storybook/react";
import App from "./App";
import {
  BrowserRouterDecorator,
  ReduxStoreProviderDecorator
} from "../stories/decorators/ReduxStoreProviderDecorator";

export default {
  title: 'TodoList/App',
  component: App,
  decorators: [ReduxStoreProviderDecorator, BrowserRouterDecorator],
} as ComponentMeta<typeof App>;

const Template: Story = (args) => <App {...args} />;

export const AppExample = Template.bind({});
AppExample.args = {
  demoMode: true,
};
