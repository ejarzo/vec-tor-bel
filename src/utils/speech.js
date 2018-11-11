export const getVoice() {
  if (typeof speechSynthesis === 'undefined') {
    return;
  }

  const voices = speechSynthesis.getVoices();
  return new voices;
}

export const getVoice = async () => {
  const voices = populateVoiceList();
  if (
    typeof speechSynthesis !== 'undefined' &&
    speechSynthesis.onvoiceschanged !== undefined
  ) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
  }
  // console.log(voices);
};
