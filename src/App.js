import React, { Component } from 'react';
import './App.css';
import Sketch1 from 'components/p5sketches/Sketch1';
import RovingEye from 'components/RovingEye';
import NewsHeadline from 'components/NewsHeadline';
import YoutubePlayer from 'components/YoutubePlayer';
import AudioPlayer from 'components/AudioPlayer';
import EmotionManager from 'utils/EmotionManager';
import {
  getYoutubeComments,
  getFreesounds,
  getCleverbotReply,
  getNews,
  getYoutubeVideos,
  getLanguage,
} from 'middleware/middleware.js';
const em = new EmotionManager();

const getRandomIn = array => array[Math.floor(Math.random() * array.length)];
/* hex to rgb and vice versa */
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}
const rgbToHex = col => {
  var r = col.r;
  var g = col.g;
  var b = col.b;

  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

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
      youtubeBlurAmount1: 0,
      youtubeBlurAmount2: 0,
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

    // let initArticle = getRandomIn(articles);
    let initArticle = articles[0];

    // search top headline on youtube
    const [{ videoId, videoComments }, soundUrl] = await Promise.all([
      this.getYoutubeData(initArticle.title),
      this.getSoundUrl(initArticle.title),
    ]);

    this.speak(initArticle.title);
    // initialize with top headline
    this.setState({
      todaysArticle: initArticle,
      replies: [{ text: initArticle.title, source: 'news' }],
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
    // const languageCode = await getLanguage(input);
    // const voice = this.state.voices.find(
    //   voice => voice.lang.slice(0, 2) === languageCode
    // );

    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(input);
    // utterThis.pitch = 0.5;
    // utterThis.rate = 0.5;
    utterThis.onend = () => {
      console.log('DONE SPEAKING');
      this.setState({ showCommentOverlay: false });
      const maxTimeUntilNextResponse = 5 * 1000;
      const minTimeUntilNextResponse = 1 * 1000;

      setTimeout(
        this.getNextReply,
        Math.random() * maxTimeUntilNextResponse + minTimeUntilNextResponse
      );
    };
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
    console.log('get next reply', 'prev reply:', replies[replies.length - 1]);

    const prevReply = replies[replies.length - 1];
    const nextReplies = replies.slice();

    if (
      (replies.length === 2 || replies.length % 20 === 0) &&
      videoComments.length > 0
    ) {
      // get comment reply
      const { text, author } = videoComments[0];
      const nextReply = text;

      nextReplies.push({ text, source: 'comment' });

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
        showCommentOverlay: true,
      });

      if (soundUrl) {
        this.setState({
          soundUrl,
        });
      }
      this.speak(text);
    } else {
      // Get cleverbot response
      const cleverbotResponse = await getCleverbotReply(prevReply.text);
      const nextReply = cleverbotResponse.output;
      nextReplies.push({ text: nextReply, source: 'cleverbot' });

      const [{ videoId, videoComments }, soundUrl] = await Promise.all([
        this.getYoutubeData(nextReply),
        this.getSoundUrl(nextReply),
      ]);

      const emotion = cleverbotResponse.emotion;
      const emotionColor = rgbToHex(em.getColorForEmotion(emotion));
      const emotionSoundUrl = !soundUrl && (await this.getSoundUrl(emotion));
      this.setState({
        replies: nextReplies,
        lastCBResponse: cleverbotResponse,
        count: this.state.count + 1,
        videoId,
        videoComments,
        showCommentOverlay: false,
        filterColor: emotionColor,
      });
      if (soundUrl || emotionSoundUrl) {
        this.setState({
          soundUrl: soundUrl || emotionSoundUrl,
        });
      }
      this.speak(nextReply);
    }
  }

  async getNews() {
    const { articles } = await getNews().catch(() => ({}));
    if (articles[0].title !== this.state.todaysArticle.title) {
      console.log('NEW HEADLINE');
      console.log(articles[0].title);

      // let initArticle = getRandomIn(articles);
      let initArticle = articles[0];

      // search top headline on youtube
      const [{ videoId, videoComments }, soundUrl] = await Promise.all([
        this.getYoutubeData(initArticle.title),
        this.getSoundUrl(initArticle.title),
      ]);

      this.speak(initArticle.title);
      // initialize with top headline
      this.setState({
        todaysArticle: initArticle,
        replies: [{ text: initArticle.title, source: 'news' }],
        videoId,
        videoComments,
      });
      if (soundUrl) {
        this.setState({
          soundUrl,
        });
      }
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
      youtubeBlurAmount1,
      youtubeBlurAmount2,
      showCommentOverlay,
      soundUrl,
    } = this.state;
    const n = replies.length;
    const latestReply = replies[n - 1];

    if (!this.state.currentVoice) {
      return null;
    }

    return (
      <div className="App" style={{ paddingBottom: 100 }}>
        <div className="VideoContainer">
          <YoutubePlayer
            getNextReply={this.getNextReply}
            count={n}
            blurAmount1={youtubeBlurAmount1}
            blurAmount2={youtubeBlurAmount2}
            videoId={videoId}
          />
        </div>

        {/*<RovingEye />*/}

        <div
          style={{
            mixBlendMode: 'hue',
            transition: 'all 0.5s',
            position: 'absolute',
            width: '100vw',
            height: '100vh',
            background: this.state.filterColor,
          }}
        />

        <div className="SketchContainer">
          {latestReply && (
            <Sketch1
              newReply={latestReply}
              newData={lastCBResponse}
              count={this.state.count}
            />
          )}
        </div>

        {latestReply &&
          showCommentOverlay && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                color: 'white',
                fontSize: '10em',
              }}
            >
              {latestReply.text}
            </div>
          )}
        <div className="controls">
          <button onClick={this.begin}>BEGIN</button>
          <button onClick={this.getNextReply}>GO</button>
          <button onClick={this.getNews}>CHECK FOR NEWS UPDATES</button>
          <button
            onClick={() => {
              this.setState({
                youtubeBlurAmount1: 0,
                youtubeBlurAmount2: 0,
              });
            }}
          >
            CLEAR BLUR
          </button>
          <button
            onClick={() => {
              this.setState({
                youtubeBlurAmount1: Math.random() * 50,
              });
            }}
          >
            RANDOM BLUR 1
          </button>
          <button
            onClick={() => {
              this.setState({
                youtubeBlurAmount2: Math.random() * 50,
              });
            }}
          >
            RANDOM BLUR 2
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
            {soundUrl}
          </div>
          <div style={{ padding: 20 }}>
            <h2>Headline</h2>
            {this.state.todaysArticle.title}
          </div>
          <h2>replies</h2>
          {replies.map(({ text }, i) => (
            <div key={text} style={{ textAlign: i % 2 !== 0 && 'right' }}>
              {text}
            </div>
          ))}
        </div>
        <div style={{ padding: 20 }}>
          <h2>Count</h2>
          {this.state.count}
        </div>
        <NewsHeadline headline={this.state.replies[0]} />

        <AudioPlayer src={soundUrl} />
      </div>
    );
  }
}

export default App;
