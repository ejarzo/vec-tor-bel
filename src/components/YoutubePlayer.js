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

  render() {
    const { videoIds, volume, blurAmount1 } = this.props;
    return (
      <div>
        {videoIds.map(
          (id, i) =>
            id && (
              <YoutubeVideo
                key={id}
                videoId={id}
                blurAmount={blurAmount1}
                options={options}
                volume={volume * 0.9}
                isTop={i !== 0}
              />
            )
        )}
      </div>
    );
  }
}

export default YoutubePlayer;
