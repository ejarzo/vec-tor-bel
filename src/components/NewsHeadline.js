import React, { Component } from 'react';

class NewsHeadline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAnimating: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.headline !== prevProps.headline) {
      this.setState({
        isAnimating: true,
      });
    }
  }

  render() {
    const { headline } = this.props;
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
          transform: `translateX(${isAnimating ? '-100%' : '100%'})`,
          color: 'white',
        }}
      >
        {headline && headline.text}
      </div>
    );
  }
}

export default NewsHeadline;
