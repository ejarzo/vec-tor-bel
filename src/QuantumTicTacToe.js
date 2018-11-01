import React, { Component } from 'react';

class QuantumTicTacToe extends Component {
  componentDidMount() {
    // Connect to the channel named "ttt".
    this.channel = new window.BroadcastChannel('ttt');

    // Send a message on "ttt".
    this.channel.postMessage('This is a test message.');

    // Listen for messages on "ttt".
    this.channel.onmessage = function(e) {
      console.log('Received', e.data);
    };
  }

  componentWillUnmount() {
    // Close the channel when you're done.
    this.channel.close();
  }

  render() {
    return <div style={{ color: 'white' }}>TIc tac toe</div>;
  }
}

export default QuantumTicTacToe;
