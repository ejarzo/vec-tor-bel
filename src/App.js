import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import VecTorBel from './VecTorBel';
import SecondView from './SecondView';
import ErrorBoundary from './ErrorBoundary';
import CurrentUserContextProvider from 'context/CurrentUserContextProvider';
import CurrentUserContextConsumer from 'context/CurrentUserContextConsumer';

import './App.css';

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <CurrentUserContextProvider>
          <BrowserRouter>
            <CurrentUserContextConsumer>
              {({ user, authenticate }) =>
                user ? (
                  <Switch>
                    <Route exact path="/" component={VecTorBel} />
                    <Route path="/tic-tac-toe" component={SecondView} />
                  </Switch>
                ) : (
                  <Route
                    path="/"
                    component={() => (
                      <div>
                        <button onClick={authenticate}>Login</button>
                      </div>
                    )}
                  />
                )
              }
            </CurrentUserContextConsumer>
          </BrowserRouter>
        </CurrentUserContextProvider>
      </ErrorBoundary>
    );
  }
}

export default App;
