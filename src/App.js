import React, { Component } from 'react';
import './App.css';

import Sketch1 from 'components/p5sketches/Sketch1';
import RovingEye from 'components/RovingEye';
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
    this.getSoundUrl = this.getSoundUrl.bind(this);
    this.getCleverbotReply = this.getCleverbotReply.bind(this);
    this.continue = this.continue.bind(this);
  }

  async componentDidMount() {
    const { articles } = await getNews().catch(error => {
      console.log(error);
      return {};
      // TODO: handle get news error
    });
    if (!articles) return;

    let initArticle = getRandomIn(articles);

    // search top headline on youtube
    const [{ videoId, videoComments }, soundUrl] = await Promise.all([
      this.getYoutubeData(initArticle.title),
      this.getSoundUrl(initArticle.title),
    ]);

    // initialize with top headline
    this.setState({
      todaysArticle: initArticle,
      replies: [initArticle.title],
      videoId,
      videoComments,
      soundUrl,
    });
  }

  async getSoundUrl(query) {
    const freeSounds = await getFreesounds(query).catch(error => {
      console.log('get sounds error:', error);
    });

    if (!freeSounds) return '';
    return getRandomIn(freeSounds).previews['preview-hq-mp3'];
  }

  async getYoutubeData(query) {
    let videoId = '';
    let videoComments = [];
    const videos = await getYoutubeVideos(query).catch(error => {
      // TODO: handle no videos
      console.log('error');
      console.log(error);
    });
    if (!videos) return { videoId, videoComments };

    const randomVideo = getRandomIn(videos);
    videoId = randomVideo.id.videoId;
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
    console.log(query);

    const data = await getCleverbotReply(query, lastCBResponse.cs);
    const replies = this.state.replies.slice();
    const { output, emotion } = data;

    replies.push(output);
    const [{ videoId, videoComments }, soundUrl] = await Promise.all([
      this.getYoutubeData(output),
      this.getSoundUrl(emotion),
    ]);

    this.setState({
      replies,
      lastCBResponse: data,
      count: this.state.count + 1,
      videoId,
      videoComments,
      soundUrl,
    });
  }

  async getNews() {
    const { articles } = await getNews().catch(() => ({}));
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
    const { videoId, videoComments, replies, lastCBResponse } = this.state;
    const n = replies.length;

    return (
      <div className="App" style={{ paddingBottom: 100 }}>
        <div className="VideoContainer">
          <YoutubePlayer videoId={videoId} />
        </div>

        <div className="SketchContainer">
          <Sketch1
            newReply={replies.length > 0 && replies[n - 1]}
            newData={lastCBResponse}
            count={this.state.count}
          />
        </div>

        <RovingEye />

        <div className="controls">
          <button onClick={this.continue}>GO</button>
          <button onClick={this.getNews}>CHECK FOR NEWS UPDATES</button>
        </div>

        <div
          style={{
            display: 'none',
            padding: 20,
            position: 'fixed',
            bottom: 0,
            maxHeight: 200,
            overflow: 'scroll',
            borderTop: '2px solid gray',
            width: '100%',
          }}
        >
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
