import { emotionLists } from './emotions';

/* hex to rgb and vice versa */
const componentToHex = c => {
  var hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
};

const rgbToHex = col => {
  var r = col.r;
  var g = col.g;
  var b = col.b;

  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

const getEmotionCategoryForEmotion = emotion => {
  for (const key in emotionLists) {
    const found = emotionLists[key].find(x => x === emotion);
    if (found) {
      return key;
    }
  }

  console.log('emotion not found:', emotion);
  return '';
};

const getColorForEmotionCategory = input => {
  let r = 255;
  let g = 255;
  let b = 255;

  if (input === 'anger') {
    r = 175;
    g = 7;
    b = 7;
  }
  if (input === 'sad') {
    r = 145;
    g = 169;
    b = 242;
  }
  if (input === 'love') {
    r = 255;
    g = 0;
    b = 106;
  }
  if (input === 'disgust') {
    r = 77;
    g = 170;
    b = 37;
  }
  if (input === 'like') {
    r = 115;
    g = 239;
    b = 146;
  }
  if (input === 'laughing') {
    r = 255;
    g = 255;
    b = 22;
  }
  if (input === 'surprise') {
    r = 255;
    g = 170;
    b = 10;
  }

  return { r, g, b };
};

const getColorForEmotion = (emotion, rgb) => {
  const emotionCategory = getEmotionCategoryForEmotion(emotion);
  const color = getColorForEmotionCategory(emotionCategory);
  return rgb ? color : rgbToHex(color);
};

export {
  rgbToHex,
  getColorForEmotion,
  getColorForEmotionCategory,
  getEmotionCategoryForEmotion,
};
