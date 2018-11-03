import { emotionGraphNoiseAmounts } from 'utils/data';
import { getColorForEmotion } from 'utils/color';

const convertRange = (value, r1, r2) =>
  ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];

export default function sketch(p) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  let emotionColor = { r: 255, g: 255, b: 255 };

  const replyData = {
    reply: '',
    emotion: '',
    x: width / 2,
    y: height / 2,
  };

  let targetPoint = {
    x: width / 2,
    y: height / 2,
  };

  let lastReply = '';
  let count = 0;

  p.setup = function() {
    p.createCanvas(width, height);
    p.frameRate(60);
    p.noStroke();
    p.textFont('Input Mono');
  };

  p.myCustomRedrawAccordingToNewPropsHandler = props => {
    const { newReply, newData } = props;
    if (!newReply) {
      return;
    }
    if (newReply.source === 'comment' || newReply.source === 'news') {
      return;
    }
    const {
      emotion,
      emotion_degree: emotionDegree,
      reaction_degree: reactionDegree,
      interaction_count: interactionCount,
    } = newData;

    const r = convertRange(emotionDegree, [0, 80], [0, height / 2]) || 0;
    const theta = convertRange(reactionDegree, [0, 80], [0, 360]) || 0;
    emotionColor = getColorForEmotion(emotion, true);
    targetPoint = {
      x: r * Math.cos(theta) + width / 2,
      y: r * Math.sin(theta) + height / 2,
    };

    count = interactionCount;
    replyData.emotion = emotion;
    replyData.reply = newReply.text || '';
  };

  // let percentage = 0;
  p.draw = () => {
    if (replyData.reply !== lastReply) {
      p.fill(255);
      p.textAlign(p.CENTER);
      p.text(replyData.reply, targetPoint.x || 20, targetPoint.y || 20);
      replyData.x = width / 2;
      replyData.y = height / 2;
    }

    p.fill(255);
    const randomModifier = emotionGraphNoiseAmounts[replyData.emotion] * 0.9;
    let xMod = 0;
    let yMod = 0;

    if (randomModifier) {
      xMod = Math.random() * randomModifier - randomModifier / 2;
      yMod = Math.random() * randomModifier - randomModifier / 2;
    }
    const yDiff = targetPoint.y - replyData.y;
    const xDiff = targetPoint.x - replyData.x;

    replyData.x = replyData.x + (xDiff / 50 + xMod);
    replyData.y = replyData.y + (yDiff / 50 + yMod);

    p.rect(replyData.x, replyData.y, 3, 3);
    const c = emotionColor;
    p.fill(c.r, c.g, c.b, (replyData.y / targetPoint.y) * 244);
    p.rect(replyData.x + 1, replyData.y + 1, 1, 1);
    p.rect(replyData.x - 1, replyData.y - 1, 2, 2);

    lastReply = replyData.reply;
  };
}
