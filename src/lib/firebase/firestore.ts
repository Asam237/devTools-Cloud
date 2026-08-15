import { getFirebaseApp } from "@/lib/firebase/app";
import { type Firestore, addDoc, collection, doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";

let db: Firestore | null = null;

export function getDb(): Firestore | null {
  const app = getFirebaseApp();
  if (!app) return null;
  if (!db) db = getFirestore(app);
  return db;
}

export async function upsertUserProfile(user: User): Promise<void> {
  const firestore = getDb();
  if (!firestore) return;
  await setDoc(
    doc(firestore, "users", user.uid),
    {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastSeenAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export type FeedbackCategory = "bug" | "idea" | "other";

export async function submitFeedback(input: {
  userId: string;
  email: string | null;
  category: FeedbackCategory;
  message: string;
  page: string;
}): Promise<void> {
  const firestore = getDb();
  if (!firestore) return;
  await addDoc(collection(firestore, "feedback"), {
    userId: input.userId,
    email: input.email,
    category: input.category,
    message: input.message,
    page: input.page,
    createdAt: serverTimestamp(),
  });
}
