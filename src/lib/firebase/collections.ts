import { getDb } from "@/lib/firebase/firestore";
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp } from "firebase/firestore";

export type ApiCollection = {
  id: string;
  name: string;
  createdAt: number;
};

function collectionsRef(userId: string, projectId: string) {
  const firestore = getDb();
  if (!firestore) return null;
  return collection(firestore, "users", userId, "projects", projectId, "collections");
}

export async function listCollections(userId: string, projectId: string): Promise<ApiCollection[]> {
  const ref = collectionsRef(userId, projectId);
  if (!ref) return [];
  const snapshot = await getDocs(ref);
  return snapshot.docs
    .map((docSnapshot) => {
      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        name: data.name as string,
        createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
      };
    })
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function createCollection(userId: string, projectId: string, name: string): Promise<void> {
  const ref = collectionsRef(userId, projectId);
  if (!ref) return;
  await addDoc(ref, { name, createdAt: serverTimestamp() });
}

export async function deleteCollection(userId: string, projectId: string, collectionId: string): Promise<void> {
  const firestore = getDb();
  if (!firestore) return;
  await deleteDoc(doc(firestore, "users", userId, "projects", projectId, "collections", collectionId));
}
