interface Sentence {
  text: string;
  audio: string;
  keyword: string[];
}

const SPEAK_ACTIVITIES: Sentence[] = [
  {
    text: "I have traveled to many countries",
    audio: "/audios/speaking-1.mp3",
    keyword: ["have", "traveled"],
  },
  {
    text: "She has worked in this company for five years",
    audio: "/audios/speaking-2.mp3",
    keyword: ["has", "worked"],
  },
  {
    text: "We have seen that movie twice already",
    audio: "/audios/speaking-3.mp3",
    keyword: ["have", "seen"],
  },
  {
    text: "He has just finished his homework",
    audio: "/audios/speaking-4.mp3",
    keyword: ["has", "finished"],
  },
  {
    text: "They have lived in London since last year",
    audio: "/audios/speaking-5.mp3",
    keyword: ["have", "lived"],
  },
  {
    text: "I have already seen that movie",
    audio: "/audios/speaking-6.mp3",
    keyword: ["have", "seen"],
  },
  {
    text: "She has never visited New York",
    audio: "/audios/speaking-7.mp3",
    keyword: ["has", "visited"],
  },
  {
    text: "We have finished our homework",
    audio: "/audios/speaking-8.mp3",
    keyword: ["have", "finished"],
  },
  {
    text: "He has lost his mobile phone",
    audio: "/audios/speaking-9.mp3",
    keyword: ["has", "lost"],
  },
  {
    text: "You have done a great job",
    audio: "/audios/speaking-10.mp3",
    keyword: ["have", "done"],
  },
];

export default SPEAK_ACTIVITIES;
