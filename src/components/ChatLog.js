import React, { Component } from 'react';

class ChatLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      replies: [],
    };
  }

  componentDidMount() {
    this.channel = new window.BroadcastChannel('ttt');
    this.channel.onmessage = ({ data }) => {
      if (data.replies) {
        this.setState({ replies: data.replies });
      }

      if (data.clearTreemap) {
        this.setState({ treemapEnabled: false });
        setTimeout(() => {
          this.setState({
            replies: [],
          });
        }, 20000);
      }
    };
  }

  render() {
    const { replies } = this.state;
    const { intensity } = this.props;
    return (
      <div
        style={{
          color: 'white',
          position: 'relative',
          height: '100%',
          padding: 20,
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

        <div
          style={{
            position: 'absolute',
            bottom: 20,
            width: 'calc(100% - 115px',
          }}
        >
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
    );
  }
}

export default ChatLog;
