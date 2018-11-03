import React, { Component } from 'react';

class QuantumTicTacToe extends Component {
  constructor(props) {
    super(props);
    this.state = { replies: [], intensity: 0 };
  }
  componentDidMount() {
    // Connect to the channel named "ttt".
    this.channel = new window.BroadcastChannel('ttt');

    // Send a message on "ttt".
    this.channel.postMessage('This is a test message.');

    // Listen for messages on "ttt".
    this.channel.onmessage = ({ data }) => {
      console.log('Received', data);
      this.setState({ replies: data.replies, intensity: data.intensity });
    };
  }

  componentWillUnmount() {
    // Close the channel when you're done.
    this.channel.close();
  }

  render() {
    return (
      <div style={{ display: 'grid', color: 'white', padding: 20 }}>
        <div>TIC TAC TOE</div>
        <div>intensity: {this.state.intensity}</div>

        <div
          style={{
            padding: 20,
            border: '2px solid white',
            height: 200,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          {this.state.replies.map(({ text }) => (
            <div style={{ paddingTop: 5, width: '100%' }}>{text}</div>
          ))}
        </div>
      </div>
    );
  }
}

export default QuantumTicTacToe;
