import React, { Component } from 'react';
import './App.css';
import VecTorBel from './VecTorBel';
import QuantumTicTacToe from './QuantumTicTacToe';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={VecTorBel} />
          <Route path="/tic-tac-toe" component={QuantumTicTacToe} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
