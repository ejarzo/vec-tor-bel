import React, { Component } from 'react';
import YoutubeVideo from './YoutubeVideo';

// https://developers.google.com/youtube/player_parameters
const options = {
  height: '100%',
  width: '100%',
  playerVars: {
    autoplay: 1,
    controls: 0, // Show pause/play buttons in player
    showinfo: 0, // Hide the video title
    modestbranding: 1, // Hide the Youtube Logo
    enablejsapi: 1,
    rel: 0,
    loop: 1, // Run the video in a loop
    fs: 0, // Hide the full screen button
    cc_load_policy: 0, // Hide closed captions
    iv_load_policy: 3, // Hide the Video Annotations
    autohide: 1, // Hide video controls when playing
  },
};

class YoutubePlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      scale: 1,
      translateX: 0,
      translateY: 0,
      topVideoId: '',
      bottomVideoId: '',
      volume: 0,
    };
  }

  componentDidMount() {
    this.setState({
      volume: 0,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.videoId !== this.props.videoId) {
      // console.log('UPDATE', prevProps.videoId, this.props.videoId);
      if (this.props.count % 2 === 0) {
        this.setState({
          topVideoId: this.props.videoId,
        });
      } else if (this.props.count % 3 === 0) {
        this.setState({
          topVideoId2: this.props.videoId,
        });
      } else if (this.props.count % 4 === 0) {
        this.setState({
          topVideoId3: this.props.videoId,
        });
      } else {
        this.setState({
          bottomVideoId: this.props.videoId,
        });
      }
    }
  }

  render() {
    const { blurAmount1, blurAmount2, volume } = this.props;
    const { topVideoId, topVideoId2, topVideoId3, bottomVideoId } = this.state;

    return (
      <div>
        <YoutubeVideo
          videoId={bottomVideoId}
          blurAmount={blurAmount1}
          options={options}
          volume={volume * 0.8}
        />
        <YoutubeVideo
          isTop
          videoId={topVideoId}
          blurAmount={blurAmount2}
          options={options}
          volume={volume * 0.8}
        />
        <YoutubeVideo
          isTop
          videoId={topVideoId2}
          blurAmount={blurAmount2}
          options={options}
          volume={volume * 0.8}
        />
        <YoutubeVideo
          isTop
          videoId={topVideoId3}
          blurAmount={blurAmount2}
          options={options}
          volume={volume * 0.8}
        />
      </div>
    );
  }
}

export default YoutubePlayer;
