import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

export const isFirebaseAdminConfigured = Boolean(projectId && clientEmail && privateKey);

let app: App | null = null;

function getAdminApp(): App | null {
  if (!isFirebaseAdminConfigured) return null;
  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  }
  return app;
}

/** Server-only. Used by the public snippet routes, sitemap, and OG images — never import from a client component. */
export function getAdminDb(): Firestore | null {
  const adminApp = getAdminApp();
  return adminApp ? getFirestore(adminApp) : null;
}
