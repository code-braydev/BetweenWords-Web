import {
  evaluateSpeechSimilarity,
  similarityScore,
  transcribeWithFallback,
} from "../../../utils/speech-processor";
import type { H3Event } from "h3";

type MultipartItem = {
  name?: string;
  filename?: string;
  type?: string;
  data: Buffer;
};

const MAX_REQUESTS_PER_HOUR = 50;

const readMultipartField = (
  items: MultipartItem[] | undefined,
  fieldName: string,
) => {
  const field = items?.find((item) => item.name === fieldName);
  if (!field) return "";
  return field.data.toString("utf8").trim();
};

const readKeywordsField = (items: MultipartItem[] | undefined) => {
  const raw = readMultipartField(items, "keywords");
  if (!raw) return [] as string[];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string");
    }
  } catch {
    // fallback to comma-separated keywords
  }

  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
};

const getClientIp = (event: H3Event) => {
  const forwardedFor = getRequestHeader(event, "x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const realIp = getRequestHeader(event, "x-real-ip")?.trim();
  const remoteAddress = event.node.req.socket.remoteAddress?.trim();

  return forwardedFor || realIp || remoteAddress || "unknown";
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const items = (await readMultipartFormData(event)) as
    | MultipartItem[]
    | undefined;

  if (!items?.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "Se esperaba FormData con audio y expectedText.",
    });
  }

  const audio = items.find((item) => item.name === "audio");
  const expectedText = readMultipartField(items, "expectedText");
  const keywords = readKeywordsField(items);

  if (!audio?.data?.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "El archivo de audio es obligatorio.",
    });
  }

  if (!expectedText) {
    throw createError({
      statusCode: 400,
      statusMessage: "El texto esperado es obligatorio.",
    });
  }

  const storage = useStorage();
  const requestHour = Math.floor(Date.now() / 3_600_000);
  const clientIp = getClientIp(event);
  const rateKey = `speech-rate:${clientIp}:${requestHour}`;
  const rateEntry = (await storage.getItem<{ count: number }>(rateKey)) ?? {
    count: 0,
  };

  if (rateEntry.count >= MAX_REQUESTS_PER_HOUR) {
    throw createError({
      statusCode: 429,
      statusMessage: "Límite de 50 peticiones por hora alcanzado.",
    });
  }

  await storage.setItem(rateKey, { count: rateEntry.count + 1 });

  const deepgramApiKey = config.deepgramApiKey || process.env.DEEPGRAM_API_KEY;
  const assemblyAiApiKey =
    config.assemblyAiApiKey || process.env.ASSEMBLYAI_API_KEY;

  if (!deepgramApiKey && !assemblyAiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Faltan claves de Deepgram/AssemblyAI en el entorno.",
    });
  }

  try {
    const mimeType = audio.type || "audio/webm";
    const { transcript, provider } = await transcribeWithFallback(
      Buffer.from(audio.data),
      mimeType,
      deepgramApiKey,
      assemblyAiApiKey,
    );

    const evaluation = evaluateSpeechSimilarity(
      expectedText,
      transcript,
      keywords,
    );

    return {
      success: true,
      transcript,
      expectedText,
      keywords,
      provider,
      similarityScore: evaluation.similarityScore,
      similarityPercent: evaluation.similarityPercent,
      passed: evaluation.passed,
      isValid: evaluation.isValid,
      thresholdPercent: evaluation.thresholdPercent,
      mandatoryKeywords: evaluation.mandatoryKeywords,
      missingMandatoryKeywords: evaluation.missingMandatoryKeywords,
      keywordPenaltyApplied: evaluation.keywordPenaltyApplied,
      feedback: evaluation.feedback,
      requestsRemaining: Math.max(
        0,
        MAX_REQUESTS_PER_HOUR - (rateEntry.count + 1),
      ),
    };
  } catch (error: any) {
    console.error("Speech evaluation error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || "No se pudo evaluar el audio.",
    });
  }
});
