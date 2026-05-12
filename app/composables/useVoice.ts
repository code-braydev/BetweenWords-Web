export const useVoice = () => {
  const speak = (text: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Buscar una voz premium en el sistema
    const voices = window.speechSynthesis.getVoices();
    // Priorizamos voces de Google o Microsoft Online que suenan más naturales
    const bestVoice =
      voices.find(
        (v) => v.name.includes("Google") && v.lang.startsWith("en"),
      ) || voices.find((v) => v.lang.startsWith("en"));

    if (bestVoice) utterance.voice = bestVoice;

    utterance.lang = "en-US";
    utterance.rate = 1.4;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  return { speak };
};
