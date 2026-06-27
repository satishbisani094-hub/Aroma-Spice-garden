import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let db = null;
let bucket = null;
let isFirebaseConnected = false;

try {
  // Check for service account configuration in environment variables
  // Can be a JSON string in FIREBASE_SERVICE_ACCOUNT or individual vars
  const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
  const databaseURL = process.env.FIREBASE_DATABASE_URL;
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  let credential = null;

  if (serviceAccountVar) {
    const serviceAccount = JSON.parse(serviceAccountVar);
    credential = admin.credential.cert(serviceAccount);
  } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
  }

  if (credential) {
    admin.initializeApp({
      credential,
      databaseURL,
      storageBucket
    });
    db = admin.firestore();
    try {
      bucket = admin.storage().bucket();
    } catch (e) {
      console.warn("Firebase Storage bucket initialization failed, storage fallback active:", e.message);
    }
    isFirebaseConnected = true;
    console.log("Firebase Admin SDK successfully initialized.");
  } else {
    console.warn("Firebase credentials not configured. Using local JSON database fallback.");
  }
} catch (error) {
  console.error("Failed to initialize Firebase Admin SDK. Using local fallback. Error:", error.message);
}

export { db, bucket, isFirebaseConnected };
