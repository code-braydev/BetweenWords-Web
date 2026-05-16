import { ref } from "vue";

export function useSpeech() {
  const isRecording = ref(false);
  const isProcessing = ref(false);
  const transcript = ref("");
  const attemptsLeft = ref(35);
  const micError = ref("");

  let mediaRecorder: MediaRecorder | null = null;
  let audioChunks: Blob[] = [];

  const startRecording = async () => {
    if (attemptsLeft.value <= 0) {
      micError.value = "Maximum number of attempts reached.";
      return;
    }

    micError.value = "";

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Prefer webm, fallback to ogg
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")
          ? "audio/ogg;codecs=opus"
          : undefined;

      mediaRecorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );
      audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        isRecording.value = false;
        isProcessing.value = true;
        transcript.value = "";

        const audioBlob = new Blob(audioChunks, {
          type: mediaRecorder?.mimeType || "audio/webm",
        });

        // Stop all microphone tracks to release the hardware
        stream.getTracks().forEach((track) => track.stop());

        const formData = new FormData();
        formData.append("audio", audioBlob, "audio.webm");

        try {
          const response = await $fetch<{ transcript: string }>(
            "/api/speech-to-text",
            {
              method: "POST",
              body: formData,
              credentials: "include",
            },
          );
          transcript.value = response.transcript;
          attemptsLeft.value--;
        } catch (error: any) {
          console.error("Error processing speech-to-text:", error);
          if (error?.statusCode === 429 || error?.status === 429) {
            micError.value =
              "Cuota de intentos agotada para esta sesión.";
          } else {
            micError.value = "Error processing audio. Try again.";
          }
          transcript.value = "";
        } finally {
          isProcessing.value = false;
        }
      };

      mediaRecorder.start();
      isRecording.value = true;
    } catch (error) {
      console.error("Microphone access denied or error:", error);
      micError.value = "Microphone access denied. Please allow permissions.";
      isRecording.value = false;
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
  };

  return {
    isRecording,
    isProcessing,
    transcript,
    attemptsLeft,
    micError,
    startRecording,
    stopRecording,
  };
}
