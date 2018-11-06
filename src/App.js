import React, { Component } from 'react';
import './App.css';
import VecTorBel from './VecTorBel';
import SecondView from './SecondView';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={VecTorBel} />
          <Route path="/tic-tac-toe" component={SecondView} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
