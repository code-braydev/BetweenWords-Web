export type SpeechProvider = "deepgram" | "assemblyai";

const APPROVAL_THRESHOLD_PERCENT = 90;
const KEYWORD_PENALTY_FACTOR = 0.7; // -30%
const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "been",
  "being",
  "by",
  "for",
  "from",
  "had",
  "has",
  "have",
  "he",
  "her",
  "hers",
  "him",
  "his",
  "i",
  "in",
  "is",
  "it",
  "its",
  "me",
  "my",
  "of",
  "on",
  "or",
  "our",
  "ours",
  "she",
  "that",
  "the",
  "their",
  "theirs",
  "them",
  "they",
  "to",
  "us",
  "was",
  "we",
  "were",
  "with",
  "you",
  "your",
  "yours",
]);

export const normalizeSpeechText = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
    .replace(/\s+/g, " ");

const levenshteinDistance = (left: string, right: string): number => {
  if (!left.length) return right.length;
  if (!right.length) return left.length;

  const previousRow = Array.from(
    { length: right.length + 1 },
    (_, index) => index,
  );

  for (let i = 1; i <= left.length; i++) {
    let lastDiagonal = i;

    for (let j = 1; j <= right.length; j++) {
      const insertion = previousRow[j]! + 1;
      const deletion = lastDiagonal + 1;
      const substitution =
        previousRow[j - 1]! +
        (left.charAt(i - 1) === right.charAt(j - 1) ? 0 : 1);
      previousRow[j - 1] = lastDiagonal;
      lastDiagonal = Math.min(insertion, deletion, substitution);
    }

    previousRow[right.length] = lastDiagonal;
  }

  return previousRow[right.length] ?? 0;
};

const tokenize = (value: string): string[] => {
  const normalized = normalizeSpeechText(value);
  if (!normalized) return [];
  return normalized.split(" ").filter(Boolean);
};

const buildBigrams = (tokens: string[]) => {
  if (tokens.length < 2) return tokens;
  const bigrams: string[] = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    bigrams.push(`${tokens[i]} ${tokens[i + 1]}`);
  }
  return bigrams;
};

const diceCoefficient = (leftItems: string[], rightItems: string[]): number => {
  if (!leftItems.length || !rightItems.length) return 0;

  const rightCounts = new Map<string, number>();
  for (const item of rightItems) {
    rightCounts.set(item, (rightCounts.get(item) ?? 0) + 1);
  }

  let overlap = 0;
  for (const item of leftItems) {
    const count = rightCounts.get(item) ?? 0;
    if (count > 0) {
      overlap += 1;
      rightCounts.set(item, count - 1);
    }
  }

  return (2 * overlap) / (leftItems.length + rightItems.length);
};

const uniqueTokens = (tokens: string[]) => Array.from(new Set(tokens));

const missingWordsRatio = (expected: string[], actual: string[]) => {
  if (!expected.length) return 0;
  const actualSet = new Set(actual);
  const missing = expected.filter((word) => !actualSet.has(word)).length;
  return missing / expected.length;
};

const extraWordsRatio = (expected: string[], actual: string[]) => {
  if (!actual.length) return 0;
  const expectedSet = new Set(expected);
  const extra = actual.filter((word) => !expectedSet.has(word)).length;
  return extra / actual.length;
};

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

const clampRatio = (value: number) => Math.max(0, Math.min(1, value));

const matchedWordsRatio = (expected: string[], actual: string[]) => {
  if (!expected.length) return 0;

  const actualCounts = new Map<string, number>();
  for (const word of actual) {
    actualCounts.set(word, (actualCounts.get(word) ?? 0) + 1);
  }

  let matched = 0;
  for (const word of expected) {
    const count = actualCounts.get(word) ?? 0;
    if (count > 0) {
      matched += 1;
      actualCounts.set(word, count - 1);
    }
  }

  return matched / expected.length;
};

export const extractMandatoryKeywords = (expected: string): string[] => {
  const tokens = uniqueTokens(tokenize(expected));
  return tokens.filter((token) => token.length >= 4 && !STOPWORDS.has(token));
};

const normalizeKeywords = (keywords: string[]) =>
  keywords
    .map((keyword) => normalizeSpeechText(keyword))
    .map((keyword) => keyword.trim())
    .filter(Boolean);

const wordsSet = (tokens: string[]) => new Set(tokens);

export const evaluateSpeechSimilarity = (
  expected: string,
  actual: string,
  providedKeywords: string[] = [],
) => {
  const expectedTokens = tokenize(expected);
  const actualTokens = tokenize(actual);

  if (!expectedTokens.length || !actualTokens.length) {
    return {
      similarityScore: 1,
      similarityPercent: 0,
      passed: false,
      thresholdPercent: APPROVAL_THRESHOLD_PERCENT,
      mandatoryKeywords: [] as string[],
      missingMandatoryKeywords: [] as string[],
      keywordPenaltyApplied: false,
      isValid: false,
      feedback: "Pronunciacion poco clara, intenta de nuevo.",
    };
  }

  const expectedText = expectedTokens.join(" ");
  const actualText = actualTokens.join(" ");

  const sequenceDice = diceCoefficient(
    buildBigrams(expectedTokens),
    buildBigrams(actualTokens),
  );
  const coverageRatio = matchedWordsRatio(expectedTokens, actualTokens);
  const extraRatio = extraWordsRatio(expectedTokens, actualTokens);

  // Score base tipo string-similarity, pero acotado por cobertura real de palabras.
  let finalScore = sequenceDice * coverageRatio;
  finalScore *= 1 - Math.min(0.35, extraRatio * 0.35);
  finalScore = clampRatio(finalScore);

  const mandatoryKeywords =
    normalizeKeywords(providedKeywords).length > 0
      ? normalizeKeywords(providedKeywords)
      : extractMandatoryKeywords(expected);
  const actualSet = wordsSet(actualTokens);
  const missingMandatoryKeywords = mandatoryKeywords.filter(
    (keyword) => !actualSet.has(keyword),
  );
  const keywordPenaltyApplied = missingMandatoryKeywords.length > 0;

  if (keywordPenaltyApplied) {
    finalScore *= KEYWORD_PENALTY_FACTOR;
  }

  const similarityPercent = clampPercent(Math.round(finalScore * 100));
  const similarityScore = Number((1 + finalScore * 4).toFixed(1));
  const isValid = similarityPercent >= APPROVAL_THRESHOLD_PERCENT;

  let feedback = "Pronunciacion poco clara, intenta de nuevo.";
  if (keywordPenaltyApplied && similarityPercent >= 70) {
    feedback = "Revisa la estructura gramatical (Auxiliar/Participio).";
  } else if (isValid) {
    feedback = "Buen trabajo.";
  }

  return {
    similarityScore,
    similarityPercent,
    passed: isValid,
    thresholdPercent: APPROVAL_THRESHOLD_PERCENT,
    mandatoryKeywords,
    missingMandatoryKeywords,
    keywordPenaltyApplied,
    isValid,
    feedback,
  };
};

export const similarityScore = (
  expected: string,
  actual: string,
  providedKeywords: string[] = [],
): number => {
  return evaluateSpeechSimilarity(expected, actual, providedKeywords)
    .similarityPercent;
};

export const scoreToPercent = (score: number) =>
  Math.max(0, Math.min(100, Math.round(((score - 1) / 4) * 100)));

export const transcribeWithDeepgram = async (
  audio: Buffer,
  mimeType: string,
  apiKey: string,
): Promise<string> => {
  const url = new URL("https://api.deepgram.com/v1/listen");
  url.searchParams.set("model", "nova-2");
  url.searchParams.set("smart_format", "true");
  url.searchParams.set("punctuate", "true");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": mimeType,
      Accept: "application/json",
    },
    body: audio,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Deepgram error ${response.status}: ${errorText}`);
  }

  const data: any = await response.json();
  const transcript =
    data?.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim();

  if (!transcript) {
    throw new Error("Deepgram returned an empty transcript.");
  }

  return transcript;
};

export const transcribeWithAssemblyAI = async (
  audio: Buffer,
  mimeType: string,
  apiKey: string,
): Promise<string> => {
  const uploadResponse = await fetch("https://api.assemblyai.com/v2/upload", {
    method: "POST",
    headers: {
      authorization: apiKey,
      "content-type": mimeType || "application/octet-stream",
    },
    body: audio,
  });

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    throw new Error(
      `AssemblyAI upload error ${uploadResponse.status}: ${errorText}`,
    );
  }

  const uploadData: any = await uploadResponse.json();
  if (!uploadData?.upload_url) {
    throw new Error("AssemblyAI upload response is missing upload_url.");
  }

  const transcriptResponse = await fetch(
    "https://api.assemblyai.com/v2/transcript",
    {
      method: "POST",
      headers: {
        authorization: apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        audio_url: uploadData.upload_url,
        punctuate: true,
        format_text: true,
        disfluencies: false,
      }),
    },
  );

  if (!transcriptResponse.ok) {
    const errorText = await transcriptResponse.text();
    throw new Error(
      `AssemblyAI create transcript error ${transcriptResponse.status}: ${errorText}`,
    );
  }

  const transcriptData: any = await transcriptResponse.json();
  if (!transcriptData?.id) {
    throw new Error("AssemblyAI transcript response is missing id.");
  }

  for (let attempt = 0; attempt < 20; attempt++) {
    const pollResponse = await fetch(
      `https://api.assemblyai.com/v2/transcript/${transcriptData.id}`,
      {
        headers: { authorization: apiKey },
      },
    );

    if (!pollResponse.ok) {
      const errorText = await pollResponse.text();
      throw new Error(
        `AssemblyAI poll error ${pollResponse.status}: ${errorText}`,
      );
    }

    const pollData: any = await pollResponse.json();

    if (pollData.status === "completed") {
      const transcript = pollData.text?.trim();
      if (!transcript) {
        throw new Error("AssemblyAI returned an empty transcript.");
      }
      return transcript;
    }

    if (pollData.status === "error") {
      throw new Error(pollData.error || "AssemblyAI transcription failed.");
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  throw new Error("AssemblyAI transcription timed out.");
};

export const transcribeWithFallback = async (
  audio: Buffer,
  mimeType: string,
  deepgramApiKey?: string,
  assemblyAiApiKey?: string,
): Promise<{ transcript: string; provider: SpeechProvider }> => {
  if (deepgramApiKey) {
    try {
      const transcript = await transcribeWithDeepgram(
        audio,
        mimeType,
        deepgramApiKey,
      );
      return { transcript, provider: "deepgram" };
    } catch (error) {
      console.error("Deepgram transcription failed:", error);
    }
  }

  if (!assemblyAiApiKey) {
    throw new Error("Missing AssemblyAI API key for fallback transcription.");
  }

  const transcript = await transcribeWithAssemblyAI(
    audio,
    mimeType,
    assemblyAiApiKey,
  );
  return { transcript, provider: "assemblyai" };
};
