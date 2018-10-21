import { emotionGraphNoiseAmounts } from 'data/utils';

const convertRange = (value, r1, r2) =>
  ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];

export default function sketch(p) {
  const width = window.innerWidth;
  const height = window.innerHeight;

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
  };

  p.myCustomRedrawAccordingToNewPropsHandler = props => {
    const { newReply, newData } = props;
    console.log(newReply, newData);
    const {
      emotion,
      emotion_degree: emotionDegree,
      reaction_degree: reactionDegree,
      interaction_count: interactionCount,
    } = newData;

    const r = convertRange(emotionDegree, [0, 80], [0, width / 2]) || 0;
    const theta = convertRange(reactionDegree, [0, 80], [0, 360]) || 0;

    targetPoint = {
      x: r * Math.cos(theta) + width / 2,
      y: r * Math.sin(theta) + height / 2,
    };

    console.log('target point', targetPoint);
    console.log('left data', replyData);
    count = interactionCount;
    replyData.emotion = emotion;
    replyData.reply = newReply || '';
  };

  // let percentage = 0;
  p.draw = () => {
    if (replyData.reply !== lastReply) {
      p.fill(0);
      p.textAlign(p.CENTER);
      p.text(replyData.reply, targetPoint.x || 20, targetPoint.y || 20);
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

    replyData.x = replyData.x + (xDiff / 100 + xMod);
    replyData.y = replyData.y + (yDiff / 100 + yMod);

    p.rect(replyData.x, replyData.y, 3, 3);

    lastReply = replyData.reply;
  };
}
