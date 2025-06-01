import * as admin from 'firebase-admin';


const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });

  console.log("✅ Firebase Admin SDK initialized!");
}