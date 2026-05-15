import { useFirebaseAdmin } from '~~/server/utils/firebase';

export default defineEventHandler(async (event) => {
  const sessionId = getRouterParam(event, 'id');
  if (!sessionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Session ID is required',
    });
  }

  const { db } = useFirebaseAdmin();
  const sessionDoc = await db.collection('sessions').doc(sessionId).get();

  if (!sessionDoc.exists) {
    return {
      valid: false,
      message: 'Session not found'
    };
  }

  const sessionData = sessionDoc.data();
  const now = Date.now();

  if (sessionData?.expiresAt && now > sessionData.expiresAt) {
    return {
      valid: false,
      message: 'Session expired'
    };
  }

  return {
    valid: true,
    session: sessionData
  };
});
