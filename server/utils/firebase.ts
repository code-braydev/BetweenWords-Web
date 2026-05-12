import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

export const useFirebaseAdmin = () => {
  const config = useRuntimeConfig();

  const apps = getApps();
  if (!apps.length) {
    // We need to handle the private key newline characters if they are escaped in the env
    const privateKey = config.firebasePrivateKey?.replace(/\\n/g, '\n');

    initializeApp({
      credential: cert({
        projectId: config.firebaseProjectId,
        clientEmail: config.firebaseClientEmail,
        privateKey: privateKey,
      }),
    });
  }

  return {
    db: getFirestore(),
    auth: getAuth(),
  };
};
