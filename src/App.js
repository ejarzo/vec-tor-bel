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
  getLanguage,
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

      voices: [],
      currentVoice: null,

      videoId: '',
      videoComments: [],

      soundUrl: '',

      filterColor: 'rgb(255,255,255)',
      youtubeBlurAmount: 100,
    };

    this.begin = this.begin.bind(this);
    this.speak = this.speak.bind(this);

    this.getNews = this.getNews.bind(this);
    this.getVoices = this.getVoices.bind(this);
    this.getYoutubeData = this.getYoutubeData.bind(this);
    this.getSoundUrl = this.getSoundUrl.bind(this);
    this.getNextReply = this.getNextReply.bind(this);
  }

  async componentDidMount() {
    if (
      typeof speechSynthesis !== 'undefined' &&
      speechSynthesis.onvoiceschanged !== undefined
    ) {
      speechSynthesis.onvoiceschanged = this.getVoices;
    }
  }

  async begin() {
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

    this.speak(initArticle.title);
    // initialize with top headline
    this.setState({
      todaysArticle: initArticle,
      replies: [initArticle.title],
      videoId,
      videoComments,
      soundUrl,
    });
  }

  getVoices() {
    if (typeof speechSynthesis === 'undefined') {
      return;
    }

    const voices = speechSynthesis.getVoices();
    this.setState({ voices });
    return voices;
  }

  async speak(input) {
    if (this.state.voices.length === 0) {
      console.log('no voice yet');
      return;
    }
    console.log('should be speaking', input);
    // const languageCode = await getLanguage(input);
    // const voice = this.state.voices.find(
    //   voice => voice.lang.slice(0, 2) === languageCode
    // );

    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(input);
    // utterThis.pitch = 0.5;
    // utterThis.rate = 0.5;
    console.log(utterThis);
    // utterThis.voice = this.state.currentVoice;
    synth.speak(utterThis);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.voices.length === 0 && this.state.voices.length > 0) {
      this.setState({
        currentVoice: this.state.voices[67],
      });
    }
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
      console.log('error getting videos');
      console.log(error);
    });

    if (!videos) return { videoId, videoComments };

    const randomVideo = getRandomIn(videos);
    console.log('video data...', randomVideo);
    videoId = randomVideo.id.videoId;
    videoComments = await getYoutubeComments(videoId).catch(error => {
      // TODO: handle no comments
      return [];
    });

    return { videoId, videoComments };
  }

  async getNextReply() {
    const { replies, videoComments, lastCBResponse, count } = this.state;

    const prevReply = replies[replies.length - 1];
    const nextReplies = replies.slice();

    if (
      (replies.length === 2 || replies.length % 20 === 0) &&
      videoComments.length > 0
    ) {
      // get comment reply
      const { text, author } = videoComments[0];

      const nextReply = text;

      nextReplies.push(text);

      const [
        { videoId, videoComments: nextVideoComments },
        soundUrl,
      ] = await Promise.all([
        this.getYoutubeData(nextReply),
        this.getSoundUrl(nextReply),
      ]);

      this.setState({
        replies: nextReplies,
        count: this.state.count + 1,
        videoId,
        videoComments: nextVideoComments,
        soundUrl,
        showCommentOverlay: true,
      });
      this.speak(text);
    } else {
      // Get cleverbot response
      const cleverbotResponse = await getCleverbotReply(prevReply);
      const nextReply = cleverbotResponse.output;
      nextReplies.push(nextReply);
      // const nextEmotion = cleverbotResponse.emotion;

      const [{ videoId, videoComments }, soundUrl] = await Promise.all([
        this.getYoutubeData(nextReply),
        this.getSoundUrl(nextReply),
      ]);

      this.setState({
        replies: nextReplies,
        lastCBResponse: cleverbotResponse,
        count: this.state.count + 1,
        videoId,
        videoComments,
        soundUrl,
        showCommentOverlay: false,
      });
      this.speak(nextReply);
    }
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
    const {
      videoId,
      videoComments,
      replies,
      lastCBResponse,
      youtubeBlurAmount,
    } = this.state;
    const n = replies.length;

    if (!this.state.currentVoice) {
      return null;
    }

    return (
      <div className="App" style={{ paddingBottom: 100 }}>
        <div className="VideoContainer">
          <YoutubePlayer
            getNextReply={this.getNextReply}
            count={n}
            blurAmount={youtubeBlurAmount}
            videoId={videoId}
          />
        </div>

        {/*<RovingEye />*/}

        <div
          style={{
            mixBlendMode: 'multiply',
            transition: 'all 0.5s',
            position: 'absolute',
            width: '100vw',
            height: '100vh',
            background: this.state.filterColor,
          }}
        />

        <div className="SketchContainer">
          <Sketch1
            newReply={replies.length > 0 && replies[n - 1]}
            newData={lastCBResponse}
            count={this.state.count}
          />
        </div>

        {this.state.showCommentOverlay && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              color: 'white',
              fontSize: '10em',
            }}
          >
            {replies[n - 1]}
          </div>
        )}
        <div className="controls">
          <button onClick={this.begin}>BEGIN</button>
          <button onClick={this.getNextReply}>GO</button>
          <button onClick={this.getNews}>CHECK FOR NEWS UPDATES</button>
          <button
            onClick={() => {
              this.setState({
                youtubeBlurAmount: Math.random() * 50,
              });
            }}
          >
            RANDOM BLUR
          </button>
          <button
            onClick={() => {
              const r = Math.random() * 255;
              const g = Math.random() * 255;
              const b = Math.random() * 255;
              this.setState({
                filterColor: `rgb(${r},${g},${b})`,
              });
            }}
          >
            RANDOM COLOR
          </button>
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
            <div key={text} style={{ textAlign: i % 2 !== 0 && 'right' }}>
              {text}
            </div>
          ))}
        </div>
        <div style={{ padding: 20 }}>
          <h2>Count</h2>
          {this.state.count}
        </div>
        {this.state.replies[0] && (
          <marquee
            style={{
              width: '100%',
              position: 'fixed',
              bottom: 0,
              color: 'white',
              fontSize: '3em',
            }}
          >
            {this.state.replies[0]}
          </marquee>
        )}
      </div>
    );
  }
}

export default App;
