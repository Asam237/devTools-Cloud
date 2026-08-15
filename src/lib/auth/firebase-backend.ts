import { getFirebaseApp, isFirebaseConfigured } from "@/lib/firebase/app";
import { upsertUserProfile } from "@/lib/firebase/firestore";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  type User,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import type { AuthBackend, AuthUser } from "./types";

function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

function requireAuth() {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error("Firebase is not configured. Set the NEXT_PUBLIC_FIREBASE_* environment variables.");
  }
  return getAuth(app);
}

export const firebaseAuthBackend: AuthBackend = {
  isConfigured: isFirebaseConfigured,

  subscribe(callback) {
    const app = getFirebaseApp();
    if (!app) {
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(getAuth(app), (user) => {
      callback(user ? toAuthUser(user) : null);
      if (user) void upsertUserProfile(user);
    });
  },

  async signInWithEmail(email, password) {
    await signInWithEmailAndPassword(requireAuth(), email, password);
  },

  async signUpWithEmail(email, password, displayName) {
    const credential = await createUserWithEmailAndPassword(requireAuth(), email, password);
    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }
    void upsertUserProfile(credential.user);
  },

  async signInWithGoogle() {
    await signInWithPopup(requireAuth(), new GoogleAuthProvider());
  },

  async signInWithGithub() {
    await signInWithPopup(requireAuth(), new GithubAuthProvider());
  },

  async sendPasswordReset(email) {
    await sendPasswordResetEmail(requireAuth(), email);
  },

  async signOut() {
    await firebaseSignOut(requireAuth());
  },
};
