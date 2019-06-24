export const getRandomIn = array => {
  const randomIndex = Math.floor(Math.random() * array.length);
  // console.log('results random index', randomIndex);
  return array[randomIndex];
};

export const convertRange = (value, r1, r2) =>
  value > r1[1]
    ? r2[1]
    : ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];

export const emotionGraphNoiseAmounts = {
  flirty: 2,
  silly: 5,
  amused: 1,
  shocked: 6,
  surprised: 5,
  jumpy: 8,
  crying: 3,
  'very sad': 2,
  confused: 5,
  embarrassed: 3,
  reluctant: 2,
  concerned: 3,
  distracted: 6,
  lazy: 1,
  furious: 7,
  infuriated: 9,
  sarcastic: 3,
};

const scale = (num, in_min, in_max, out_min, out_max) => {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

export const scaleIntensity = (num, outMin, outMax) =>
  scale(num, 0, 2, outMin, outMax);
