import React, { Component } from 'react';
import QuantumTicTacToeBoard from 'components/QuantumTicTacToeBoard';
import ConversationSummaryGraph from 'components/ConversationSummaryGraph';

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
    const { replies, intensity } = this.state;
    const n = replies.length;
    const latestReply = replies[n - 1];
    return (
      <div
        style={{
          fontSize: '1.5em',
          display: 'grid',
          height: '100vh',
          color: 'white',
          padding: 20,
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
        }}
      >
        <div
          style={{
            border: '2px solid white',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
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
          <div
            className="spin"
            style={{
              position: 'absolute',
              right: 20,
              width: 50,
              height: 50,
              borderRadius: '50%',
              border: '1px solid white',
              animationDuration: `${intensity * 2}s`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 2,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: 'white',
              }}
            />
          </div>
          <div style={{ position: 'absolute', bottom: 20 }}>
            {this.state.replies.map(({ text }) => (
              <div style={{ paddingTop: 5, width: '100%' }}>{text}</div>
            ))}
          </div>
        </div>
        <div
          style={{
            padding: 20,
            border: '2px solid white',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
            gridColumn: '1 / 3',
          }}
        >
          {latestReply && (
            <ConversationSummaryGraph
              width={1000}
              height={902}
              enabled
              currEmotion={latestReply.emotion}
            />
          )}
        </div>
      </div>
    );
  }
}

export default QuantumTicTacToe;
