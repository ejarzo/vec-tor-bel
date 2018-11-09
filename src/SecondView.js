import React, { Component } from 'react';
import QuantumTicTacToeBoard from 'components/QuantumTicTacToeBoard';
import ConversationSummaryGraph from 'components/ConversationSummaryGraph';

class SecondView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intensity: 0,
      replies: [],
      credits: [],
      treemapEnabled: true,
    };
  }

  componentDidMount() {
    this.channel = new window.BroadcastChannel('ttt');
    this.channel.onmessage = ({ data }) => {
      console.log('Received', data);
      if (data.replies) {
        this.setState({ replies: data.replies });
      }

      if (data.intensity >= 0) {
        this.setState({ intensity: data.intensity });
      }

      if (data.credits) {
        this.setState({ credits: data.credits });
      }

      if (data.clearTreemap) {
        this.setState({ treemapEnabled: false });
        setTimeout(() => {
          this.setState({
            treemapEnabled: true,
            replies: [],
            credits: [],
          });
        }, 20000);
      }
    };
  }

  componentWillUnmount() {
    this.channel.close();
  }

  render() {
    const { replies, intensity, credits, treemapEnabled } = this.state;
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
          <QuantumTicTacToeBoard replies={replies} />
        </div>
        <div
          style={{
            border: '2px solid white',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
            fontFamily: 'Roboto',
          }}
        >
          <div
            style={{
              height: '50%',
              borderBottom: '2px solid white',
              padding: 20,
              position: 'relative',
            }}
          >
            <div
              className="spin"
              style={{
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
              {replies.map(({ text, source }) => (
                <div style={{ paddingTop: 5, width: '100%' }}>
                  <span
                    style={{
                      // fontWeight: source === 'news' && 'bold',
                      // fontStyle: source === 'comment' && 'italic',
                      color:
                        source === 'comment'
                          ? '#FF0001'
                          : source === 'news' && '#2a4aea',
                    }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* ---- credits ----- */}
          <div
            style={{
              textAlign: 'center',
              height: '50%',
              padding: 20,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div className="credits-container">
              {credits.map(({ name }) => (
                <div className="credit">{name}</div>
              ))}
            </div>
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
          {replies.length > 0 && (
            <ConversationSummaryGraph
              width={1000}
              height={902}
              enabled={treemapEnabled}
              currEmotion={latestReply.emotion}
            />
          )}
        </div>
      </div>
    );
  }
}

export default SecondView;
