type QuestionType = "multiple" | "writing";

interface Question {
  id: string;
  section?: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correct?: number;
  acceptedAnswers?: string[];
  placeholder?: string;
  audioUrl?: string;
}

export const questions: Question[] = [
  // --- SECCIÓN 1: GRAMMAR & STRUCTURE (Multiple Choice) ---
  {
    id: "q1",
    section: "Grammar Selection",
    type: "multiple",
    question:
      "Complete the sentence: 'I _______ never seen a volcano in my life.'",
    options: ["has", "have", "am"],
    correct: 1,
  },
  {
    id: "q2",
    section: "Grammar Selection",
    type: "multiple",
    question: "Which is the correct past participle for the verb 'BREAK'?",
    options: ["Breaked", "Broke", "Broken"],
    correct: 2,
  },
  {
    id: "q3",
    section: "Grammar Selection",
    type: "multiple",
    question: "Choose the correct negative form:",
    options: [
      "He hasn't traveled to Asia yet.",
      "He haven't traveled to Asia yet.",
      "He don't has traveled to Asia yet.",
    ],
    correct: 0,
  },
  {
    id: "q4",
    section: "Grammar Selection",
    type: "multiple",
    question: "Select the correct question:",
    options: [
      "Have you ever ate sushi?",
      "Has you ever eaten sushi?",
      "Have you ever eaten sushi?",
    ],
    correct: 2,
  },
  {
    id: "q5",
    section: "Grammar Selection",
    type: "multiple",
    question:
      "Complete the sentence: 'My family _______ traveled to many cities in Colombia this year.'",
    options: ["has", "have", "is"],
    correct: 0,
  },

  // --- SECCIÓN 2: SENTENCE BUILDING (Writing / Fill in the blanks) ---
  {
    id: "q6",
    section: "Sentence Building",
    type: "writing",
    question:
      "Write the correct form: 'We _______ (be) friends for ten years.'",
    acceptedAnswers: ["have been", "'ve been"],
    placeholder: "Type the missing words...",
  },
  {
    id: "q7",
    section: "Sentence Building",
    type: "writing",
    question: "Put the words in order: 'just / has / she / arrived'.",
    acceptedAnswers: ["she has just arrived"],
    placeholder: "Write the full sentence...",
  },
  {
    id: "q8",
    section: "Sentence Building",
    type: "writing",
    question: "Transform to negative: 'They have finished the project.'",
    acceptedAnswers: [
      "they haven't finished the project",
      "they have not finished the project",
    ],
    placeholder: "They...",
  },
  {
    id: "q9",
    section: "Sentence Building",
    type: "writing",
    question: "Complete: 'I _______ (write) three emails this morning.'",
    acceptedAnswers: ["have written", "i've written"],
    placeholder: "Type auxiliary + participle...",
  },
  {
    id: "q10",
    section: "Sentence Building",
    type: "writing",
    question:
      "Write a question using 'Ever' and the verb 'SEE' (Subject: You).",
    acceptedAnswers: [
      "have you ever seen",
      "have you ever seen a movie",
      "have you ever seen it",
    ],
    placeholder: "Start with Have or Has...",
  },

  // --- SECCIÓN 3: LISTENING COMPREHENSION (Audios de ElevenLabs) ---
  {
    id: "q11",
    section: "Listening",
    type: "multiple",
    question: "Listen to the audio. What has Mark done today?",
    audioUrl: "/audios/listening-mark.mp3",
    options: [
      "He has cleaned the house",
      "He has lost his keys",
      "He has bought a car",
    ],
    correct: 0,
  },
  {
    id: "q12",
    section: "Listening",
    type: "multiple",
    question: "Listen. How long has Sarah worked at the hospital?",
    audioUrl: "/audios/listening-hospital.mp3",
    options: ["Since 2015", "For 5 years", "Since last month"],
    correct: 1,
  },
  {
    id: "q13",
    section: "Listening (Dictation)",
    type: "writing",
    question: "Listen and write exactly what you hear.",
    audioUrl: "/audios/listening-dictation-1.mp3",
    acceptedAnswers: [
      "i have already visited londres",
      "i've already visited londres",
    ],
    placeholder: "Write what you hear...",
  },
  {
    id: "q14",
    section: "Listening (Comprehension)",
    type: "writing",
    question: "Listen to the question and answer it: 'What has she lost?'",
    audioUrl: "/audios/listening-lost-item.mp3",
    acceptedAnswers: ["her phone", "phone", "she has lost her phone"],
    placeholder: "Your answer here...",
  },
  {
    id: "q15",
    section: "Listening (Logic)",
    type: "multiple",
    question: "Listen to the context. Has the train already left?",
    audioUrl: "/audios/listening-train.mp3",
    options: ["Yes, it has", "No, it hasn't", "It arrives tomorrow"],
    correct: 0,
  },
];

export const TOTAL_QUESTIONS = questions.length;
