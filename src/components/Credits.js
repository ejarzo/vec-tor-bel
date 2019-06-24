import React, { Component } from 'react';

class NewsHeadline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      credits: [],
    };
  }

  componentDidMount() {
    this.channel = new window.BroadcastChannel('ttt');
    this.channel.onmessage = ({ data }) => {
      if (data.credits) {
        this.setState({ credits: data.credits });
      }

      if (data.clearTreemap) {
        this.setState({ treemapEnabled: false });
        setTimeout(() => {
          this.setState({
            credits: [],
          });
        }, 20000);
      }
    };
  }

  render() {
    const { credits } = this.state;
    return (
      <div
        style={{
          color: 'white',
          textAlign: 'center',
          height: '100%',
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
    );
  }
}

export default NewsHeadline;
