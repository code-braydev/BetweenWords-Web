import { ref, onBeforeUnmount } from "vue";

export const useMicrophone = (initialCount = 0) => {
  const transcripts = ref<string[]>(
    Array.from({ length: initialCount }, () => ""),
  );
  const isRecording = ref(false);
  const currentIdx = ref<number | null>(null);

  let recognition: any = null;

  const stopRecognition = () => {
    if (!import.meta.client || !recognition) return;

    recognition.onstart = null;
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;

    try {
      recognition.stop();
    } catch {
      /* ignore */
    }

    recognition = null;
    isRecording.value = false;
    currentIdx.value = null;
  };

  const startRecognition = (idx: number) => {
    if (!import.meta.client) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech Recognition no soportado en este navegador.");
      return;
    }

    stopRecognition();

    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      isRecording.value = true;
      currentIdx.value = idx;
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      transcripts.value[idx] = (finalTranscript + interim).trim();
    };

    recognition.onerror = (event: any) => {
      if (event.error === "not-allowed") {
        console.error("Acceso al micrófono denegado.");
      }
      stopRecognition();
    };

    recognition.onend = () => {
      isRecording.value = false;
      currentIdx.value = null;
    };

    recognition.start();
  };

  const toggleRecord = (idx: number) => {
    if (isRecording.value && currentIdx.value === idx) {
      stopRecognition();
    } else {
      startRecognition(idx);
    }
  };

  onBeforeUnmount(() => stopRecognition());

  return {
    transcripts,
    isRecording,
    currentIdx,
    toggleRecord,
  };
};
