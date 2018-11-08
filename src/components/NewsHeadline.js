import React, { Component } from 'react';

class NewsHeadline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAnimating: false,
    };
  }

  componentDidMount(prevProps) {
    if (this.props.latestReply.source === 'news') {
      this.setState({
        isAnimating: true,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.latestReply !== prevProps.latestReply) {
      this.setState({
        isAnimating: true,
      });
      setTimeout(() => {
        this.setState({
          isAnimating: false,
        });
      }, 20000);
    }
  }

  render() {
    const { latestReply } = this.props;
    const { isAnimating } = this.state;

    return (
      <div
        style={{
          fontFamily: 'Teko',
          position: 'absolute',
          bottom: 0,
          fontSize: '3em',
          whiteSpace: 'nowrap',
          transition: 'all 20s linear',
          visibility: isAnimating ? 'visible' : 'hidden',
          transform: `translate3d(${isAnimating ? '-100%' : '100vw'}, 0, 0)`,
          color: 'white',
        }}
      >
        {isAnimating && latestReply.source === 'news' && latestReply.text}
      </div>
    );
  }
}

export default NewsHeadline;
