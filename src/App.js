import React, { Component } from 'react';
import './App.css';

import Sketch1 from 'components/p5sketches/Sketch1';

import YoutubePlayer from 'components/YoutubePlayer';
import {
  getYoutubeComments,
  getFreesounds,
  getCleverbotReply,
  getNews,
  getYoutubeVideos,
} from 'middleware/middleware.js';

const getRandomIn = array => array[Math.floor(Math.random() * array.length)];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todaysArticle: '',
      replies: [],
      lastCBResponse: { cs: '' },
      count: 0,

      videoId: '',
      videoComments: [],

      soundUrl: '',
    };

    this.getNews = this.getNews.bind(this);
    this.getYoutubeData = this.getYoutubeData.bind(this);
    this.getSounds = this.getSounds.bind(this);
    this.getCleverbotReply = this.getCleverbotReply.bind(this);
    this.continue = this.continue.bind(this);
  }

  async componentDidMount() {
    const { articles } = await getNews().catch(error => {
      // TODO: handle get news error
      console.log('error getting news', error);
    });
    if (!articles) return;

    let firstArticle = articles[0];

    // search top headline on youtube
    const [{ videoId, videoComments }] = await Promise.all(
      this.getYoutubeData(firstArticle.title),
      this.getSounds(firstArticle.title)
    );

    // initialize with top headline
    this.setState({
      todaysArticle: firstArticle,
      replies: [firstArticle.title],
      videoId,
      videoComments,
    });
  }

  async getSounds(query) {
    const freeSounds = await getFreesounds(query).catch(error => {
      console.log('get sounds error:', error);
    });
    if (!freeSounds) return;

    const previewUrl = freeSounds[0].previews['preview-hq-mp3'];
    this.setState({ soundUrl: previewUrl });
  }

  async getYoutubeData(query) {
    let videoId = '';
    let videoComments = [];
    console.log('===========');
    console.log('Searching Youtube for', query);
    const videos = await getYoutubeVideos(query).catch(error => {
      // TODO: handle no videos
      console.log('error');
      console.log(error);
    });
    console.log('videos:', videos);
    if (!videos) return { videoId, videoComments };

    const randomVideo = getRandomIn(videos);
    videoId = randomVideo.id.videoId;

    console.log(videoId);
    videoComments = await getYoutubeComments(videoId).catch(error => {
      // TODO: handle no comments
      return [];
    });

    return { videoId, videoComments };
  }

  continue() {
    const { replies } = this.state;
    this.getCleverbotReply(replies[replies.length - 1]);
  }

  async getCleverbotReply(query) {
    const { lastCBResponse } = this.state;

    console.log('===========================');
    console.log('searching cleverbot for...');
    console.log(query);

    const data = await getCleverbotReply(query, lastCBResponse.cs);
    console.log('RESULT:', data);

    const replies = this.state.replies.slice();
    const output = data.output;
    replies.push(output);

    const { videoId, videoComments } = await this.getYoutubeData(output);

    this.setState({
      replies,
      lastCBResponse: data,
      count: this.state.count + 1,
      videoId,
      videoComments,
    });
    this.getSounds(output);
  }

  async getNews() {
    const { articles } = await getNews();
    if (articles[0].title !== this.state.todaysArticle.title) {
      console.log('NEW HEADLINE');
      console.log(articles[0].title);
    } else {
      console.log('same title');
      console.log(articles[0].title);
      console.log(this.state.todaysArticle.title);
    }
  }

  render() {
    const { videoId, videoComments, replies } = this.state;
    const n = replies.length;
    return (
      <div className="App" style={{ paddingBottom: 100 }}>
        <Sketch1
          currReply={replies.length > 0 && replies[n - 1]}
          prevReply={replies.length > 1 && replies[n - 2]}
          count={this.state.count}
        />
        <YoutubePlayer videoId={videoId} />

        <button onClick={this.continue}>GO</button>
        <button onClick={this.getNews}>CHECK FOR NEWS UPDATES</button>

        {videoComments.map(comment => (
          <div key={comment.id} style={{ padding: 10 }}>
            <div>{comment.author}</div>
            <div>{comment.text}</div>
          </div>
        ))}

        <div>
          <h2>SoundUrl</h2>
          {this.state.soundUrl}
        </div>

        <div style={{ padding: 20 }}>
          <h2>Headline</h2>
          {this.state.todaysArticle.title}
        </div>
        <div
          style={{
            padding: 20,
            position: 'fixed',
            bottom: 0,
            maxHeight: 200,
            overflow: 'scroll',
            background: 'white',
            borderTop: '2px solid gray',
            width: '100%',
          }}
        >
          <h2>replies</h2>
          {replies.map((text, i) => (
            <div style={{ textAlign: i % 2 !== 0 && 'right' }}>{text}</div>
          ))}
        </div>
        <div style={{ padding: 20 }}>
          <h2>Count</h2>
          {this.state.count}
        </div>
      </div>
    );
  }
}

export default App;
