import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux";
import {store} from "./app/store";
import {HashRouter} from "react-router-dom";

const rerenderApp = () => {
  ReactDOM.render(
    <Provider store={store}>
      <HashRouter>
        <App/>
      </HashRouter>
    </Provider>,
    document.getElementById('root')
  );
};

rerenderApp();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("./app/App", () => {
    rerenderApp();
  });
}
