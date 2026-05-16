import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import { getOrCreateStudentSession, updateStudentSession } from '../utils/session'

export default defineEventHandler(async (event) => {
  // 1. Identificación y Control de Cuota
  const { id: sessionId, session } = await getOrCreateStudentSession(event)
  
  if (session.speechAttemptsCount >= 35) {
    throw createError({ 
      statusCode: 429, 
      statusMessage: 'Cuota de interacción agotada para esta sesión' 
    })
  }

  const formData = await readMultipartFormData(event)
  
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No audio data provided' })
  }

  const audioFile = formData.find(field => field.name === 'audio')

  if (!audioFile || !audioFile.data) {
    throw createError({ statusCode: 400, statusMessage: 'Audio field missing' })
  }

  const deepgramApiKey = process.env.DEEPGRAM_API_KEY
  if (!deepgramApiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Deepgram API key not configured' })
  }

  const url = 'https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&language=en-US'

  let attempt = 0;
  const maxAttempts = 3;

  while (attempt < maxAttempts) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${deepgramApiKey}`,
          'Content-Type': audioFile.type || 'audio/webm',
        },
        body: audioFile.data
      })

      if (response.status === 429) {
        attempt++;
        if (attempt >= maxAttempts) {
          throw createError({ statusCode: 429, statusMessage: 'Too Many Requests, please try again later.' })
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw createError({ statusCode: response.status, statusMessage: `Deepgram Error: ${errorText}` })
      }

      const result = await response.json();
      let transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';

      // Normalización Fonética Inteligente
      transcript = transcript.trim().replace(/[.,!?]+$/, '');

      // Normalizaciones para evitar fallos injustos en Present Perfect
      const normalizations: Record<string, string> = {
        "she's": "she has",
        "he's": "he has",
        "it's": "it has",
        "i've": "i have",
        "we've": "we have",
        "you've": "you have",
        "they've": "they have",
        "they're": "they are"
      };

      Object.entries(normalizations).forEach(([contraction, expansion]) => {
        const regex = new RegExp(`\\b${contraction}\\b`, 'gi');
        transcript = transcript.replace(regex, expansion);
      });

      // Incrementar contador y persistir en servidor
      session.speechAttemptsCount++;
      await updateStudentSession(sessionId, session);

      return { transcript }

    } catch (err: any) {
      if (err.statusCode === 429) throw err;
      if (attempt >= maxAttempts - 1) {
          throw createError({ statusCode: 500, statusMessage: 'Failed to connect to Deepgram' })
      }
      attempt++;
    }
  }
})
