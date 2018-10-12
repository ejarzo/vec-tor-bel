import React, { Component } from 'react';
import './App.css';

import Sketch1 from 'components/p5sketches/Sketch1';

import YoutubePlayer from 'components/YoutubePlayer';
import {
  getYoutubeResults,
  getYoutubeComments,
  getFreesoundResults,
  getCleverbotReply,
  getNews,
} from 'middleware/middleware.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoId: '',
      videoComments: [],
      output: 'what is the meaning of life?',
      conversationHistory: '',
    };

    this.getYoutubeResults = this.getYoutubeResults.bind(this);
    this.getYoutubeComments = this.getYoutubeComments.bind(this);
    this.getFreesoundResults = this.getFreesoundResults.bind(this);
    this.getCleverbotReply = this.getCleverbotReply.bind(this);
    this.getNews = this.getNews.bind(this);
  }

  getYoutubeResults() {
    const query =
      this.state.videoComments.length > 0
        ? this.state.videoComments[0].text.split(' ')[0]
        : 'slomo';

    getYoutubeResults(query).then(data => {
      const { items: videos } = data;
      if (videos.length > 0) {
        const videoId =
          videos[Math.floor(Math.random() * videos.length)].id.videoId;
        console.log(data);
        this.setState({ videoId });
        this.getYoutubeComments(videoId);
      } else {
        console.log('No videos');
      }
    });
  }

  getYoutubeComments(videoId) {
    getYoutubeComments(videoId).then(data => {
      console.log(data);
      const { items } = data;
      if (items && items.length > 0) {
        const videoComments = items.map(item => ({
          id: item.id,
          author: item.snippet.topLevelComment.snippet.authorDisplayName,
          text: item.snippet.topLevelComment.snippet.textDisplay,
        }));
        this.setState({ videoComments });
      } else {
        console.log('No Comments');
      }
    });
  }

  getFreesoundResults() {
    const query =
      this.state.videoComments.length > 0
        ? this.state.videoComments[0].text.split(' ')[0]
        : 'slomo';

    getFreesoundResults(query).then(
      data => {
        const { results } = data;
        if (results.length <= 0) {
          console.log('NO SOUNDS for', query);
        } else {
          const first = data.results.length > 0 && data.results[0];
          const previewUrl = first.previews['preview-hq-mp3'];
          console.log(previewUrl);
        }
      },
      error => {
        console.log('error', error);
      }
    );
  }

  getCleverbotReply() {
    const query = this.state.output;
    const cs = this.state.conversationHistory;

    getCleverbotReply(query, cs).then(
      data => {
        console.log(data);

        this.setState({
          output: data.output,
          conversationHistory: data.cs,
        });
      },
      error => {
        console.log('error', error);
      }
    );
  }

  getNews() {
    getNews().then(
      data => {
        console.log(data);
      },
      error => {
        console.log('error', error);
      }
    );
  }

  render() {
    const { videoId, videoComments } = this.state;
    console.log(videoComments);
    return (
      <div className="App">
        {/* <Sketch1 /> */}
        <YoutubePlayer videoId={videoId} />
        <button onClick={this.getYoutubeResults}>fetch</button>
        <button onClick={this.getFreesoundResults}>fetch sounds</button>
        <button onClick={this.getCleverbotReply}>fetch cleverbot</button>
        <button onClick={this.getNews}>Get News</button>
        {videoComments.map(comment => (
          <div key={comment.id} style={{ padding: 10 }}>
            <div>{comment.author}</div>
            <div>{comment.text}</div>
          </div>
        ))}
        <div style={{ padding: 20 }}>{this.state.output}</div>
      </div>
    );
  }
}

export default App;
