import React, { Component } from 'react';
import YouTube from 'react-youtube';

class YoutubeVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      videoId: props.videoId || '',
      blendMode: 'multiply',
    };
    this.handleReady = this.handleReady.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
  }

  handleReady(e) {
    // const player = e.target;
    // player.setPlaybackRate(2)
    this.player = e.target;
    this.player.setVolume(0);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.volume !== this.props.volume) {
      console.log('updating volume');
      console.log(prevProps.volume, this.props.volume);
      this.player && this.player.setVolume(this.props.volume);
    }
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
        blendMode: Math.random() < 0.2 ? 'difference' : 'multiply',
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
          mixBlendMode: isTop && this.state.blendMode,
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
