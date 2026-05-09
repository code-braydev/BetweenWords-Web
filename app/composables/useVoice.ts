export const useVoice = () => {
  const speak = (text: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 0.8;

    window.speechSynthesis.speak(utterance);
  };

  return { speak };
};
