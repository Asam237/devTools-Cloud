import { type FirebaseApp, getApps, initializeApp } from "firebase/app";

// Configuration Firebase Client (avec valeurs par défaut)
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "REDACTED_API_KEY",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "devtools-cloud.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "devtools-cloud",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "devtools-cloud.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "755061458556",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:755061458556:web:96fb90fae00133ab856bf9",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Configuration Firebase Admin (avec valeurs par défaut - Côté Serveur)
export const adminConfig = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || "devtools-cloud",
  clientEmail:
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL ||
    "firebase-adminsdk-fbsvc@devtools-cloud.iam.gserviceaccount.com",
  privateKey: (
    process.env.FIREBASE_ADMIN_PRIVATE_KEY ||
    `REDACTED_PRIVATE_KEY`
  ).replace(/\\n/g, "\n"),
};

// Flags de vérification de la configuration
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
);
export const isAnalyticsConfigured = Boolean(
  isFirebaseConfigured && firebaseConfig.measurementId,
);
export const isAdminConfigured = Boolean(
  adminConfig.projectId && adminConfig.clientEmail && adminConfig.privateKey,
);

// Initialisation Singleton Client
let app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) return null;
  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return app;
}
