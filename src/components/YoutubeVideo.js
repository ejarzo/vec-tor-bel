import React, { Component } from 'react';
import YouTube from 'react-youtube';

class YoutubeVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      videoId: props.videoId || '',
    };
    this.handleReady = this.handleReady.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
  }

  handleReady(e) {
    const player = e.target;
    // player.setPlaybackRate(2)
    player.mute();
  }

  componentDidUpdate(prevProps, prevState) {
    // if (prevProps.videoId !== this.props.videoId) {
    //   this.setState({
    //     isVisible: false,
    //   });
    //   setTimeout(() => {
    //     this.setState({
    //       videoId: this.props.videoId,
    //     });
    //   }, 10000);
    // }
  }

  handleStateChange(e) {
    /*
      -1: unstarted
      0: ended
      1: playing
      2: paused
      3: buffering
      5: video cued
    */
    if (e.data === 1) {
      this.setState({
        isVisible: true,
      });
    } else if (e.data === -1) {
      this.setState({
        isVisible: false,
      });
    }
  }

  render() {
    const { blurAmount, options, isTop, videoId } = this.props;
    const { isVisible } = this.state;

    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          width: '100vw',
          mixBlendMode: isTop && 'multiply',
          // transform: `scale3d(${scale}, ${scale}, 1) translate(${translateX}%, ${translateY}%)`,
          transition: 'filter 1s',
          opacity: isVisible ? 1 : 0,
          height: '100%',
          transform: 'scale(1.4)',
          filter: `blur(${blurAmount}px)`,
        }}
      >
        <YouTube
          onStateChange={this.handleStateChange}
          onReady={this.handleReady}
          videoId={videoId}
          opts={options}
        />
      </div>
    );
  }
}

export default YoutubeVideo;
