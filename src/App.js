import React, { Component } from 'react';
import './App.css';
import VecTorBel from './VecTorBel';
import SecondView from './SecondView';
import ErrorBoundary from './ErrorBoundary';

import { BrowserRouter, Switch, Route } from 'react-router-dom';
class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={VecTorBel} />
            <Route path="/tic-tac-toe" component={SecondView} />
          </Switch>
        </BrowserRouter>
      </ErrorBoundary>
    );
  }
}

export default App;
