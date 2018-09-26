import React, { Component } from 'react';
import './App.css';

import Sketch1 from 'components/p5sketches/Sketch1';
import YoutubePlayer from 'components/YoutubePlayer';

import { YOUTUBE_API_KEY } from 'config/apiKeys';

const fetchApi = (url, params) => {
  const esc = encodeURIComponent;
  const query = Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');

  return fetch(`${url}/?${query}`).then(response => response.json());
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoId: '',
      videoComments: [],
    };

    this.getYoutubeResults = this.getYoutubeResults.bind(this);
    this.getYoutubeComments = this.getYoutubeComments.bind(this);
  }

  getYoutubeResults() {
    const query =
      this.state.videoComments.length > 0
        ? this.state.videoComments[0].text.split(' ')[0]
        : 'slomo';

    const baseUrl = 'https://www.googleapis.com/youtube/v3/search';
    const params = {
      key: YOUTUBE_API_KEY,
      part: 'snippet',
      type: 'vide',
      maxResults: 15,
      q: query,
    };

    fetchApi(baseUrl, params).then(data => {
      const { items } = data;
      const videoId =
        items[Math.floor(Math.random() * items.length)].id.videoId;
      console.log(data);
      this.setState({ videoId });
      this.getYoutubeComments(videoId);
    });
  }

  getYoutubeComments(videoId) {
    const url = 'https://www.googleapis.com/youtube/v3/commentThreads';
    const params = {
      key: YOUTUBE_API_KEY,
      videoId,
      part: 'snippet',
      textFormat: 'plainText',
      order: 'relevance',
      maxResults: 5,
    };

    fetchApi(url, params).then(data => {
      console.log(data);
      const { items } = data;
      const videoComments = items
        ? items.map(item => ({
            id: item.id,
            author: item.snippet.topLevelComment.snippet.authorDisplayName,
            text: item.snippet.topLevelComment.snippet.textDisplay,
          }))
        : [];
      this.setState({ videoComments });
    });
  }

  render() {
    const { videoId, videoComments } = this.state;
    console.log(videoComments);
    return (
      <div className="App">
        {/* <Sketch1 /> */}
        <YoutubePlayer videoId={videoId} />
        <button onClick={this.getYoutubeResults}>fetch</button>
        {videoComments.map(comment => (
          <div key={comment.id} style={{ padding: 10 }}>
            <div>{comment.author}</div>
            <div>{comment.text}</div>
          </div>
        ))}
      </div>
    );
  }
}

export default App;
