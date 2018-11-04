import React, { Component } from 'react';
import QuantumTicTacToeBoard from 'components/QuantumTicTacToeBoard';
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
      <div
        style={{
          display: 'grid',
          color: 'white',
          padding: 20,
          gridTemplateColumns: '300px 1fr',
        }}
      >
        {/*<div>intensity: {this.state.intensity}</div>*/}

        <div>
          <QuantumTicTacToeBoard replies={this.state.replies} />
        </div>
        <div
          style={{
            padding: 20,
            border: '2px solid white',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
            fontFamily: 'Roboto',
          }}
        >
          <div style={{ position: 'absolute', bottom: 20 }}>
            {this.state.replies.map(({ text }) => (
              <div style={{ paddingTop: 5, width: '100%' }}>{text}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default QuantumTicTacToe;
