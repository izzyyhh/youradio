import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import configureStore from '../store/helloWorldStore';
import App from '../components/App'
import HelloWorld from '../components/HelloWorld';

// See documentation for https://github.com/reactjs/react-redux.
// This is how you get props from the Rails view into the redux store.
// This code here binds your smart component to the redux store.
const HelloWorldApp = (props) => (
  <Provider store={configureStore(props)}>
      <Router>
        <Switch>
        <Route exact path='/test' component={HelloWorld} />
            <App />
        </Switch>
      </Router>
  </Provider>
);

export default HelloWorldApp;
