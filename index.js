// /**
//  * @format
//  */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './redux/store';
import App from './App'; // Update the import path if needed
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

const store = configureStore();

const RootComponent = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => RootComponent);
