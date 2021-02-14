import React, { Component } from 'react';

class CommentOverlay extends Component {
  render() {
    const { show, text } = this.props;
    return (
      <div
        className="CommentOverlay"
        style={{
          transform: `translate3d(${show ? 0 : 100}vw, 0, 0)`,
        }}
      >
        <div>{text}</div>
      </div>
    );
  }
}

export default CommentOverlay;
