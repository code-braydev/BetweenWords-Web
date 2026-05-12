import { useFirebaseAdmin } from '~~/server/utils/firebase';
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { db } = useFirebaseAdmin();

  const { durationDays = 1 } = body;

  // Calculate expiration time based on durationDays
  const expiresIn = durationDays * 24 * 60 * 60 * 1000;
  const expiresAt = Date.now() + expiresIn;

  const sessionId = crypto.randomUUID();


  const sessionData = {
    id: sessionId,
    ...body,
    createdAt: Date.now(),
    expiresAt,
    isActive: true
  };

  await db.collection('sessions').doc(sessionId).set(sessionData);

  return {
    success: true,
    sessionId,
    expiresAt
  };
});
