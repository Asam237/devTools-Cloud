import { getDb } from "@/lib/firebase/firestore";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";

export type Folder = {
  id: string;
  name: string;
  createdAt: number;
};

function foldersRef(userId: string) {
  const firestore = getDb();
  if (!firestore) return null;
  return collection(firestore, "users", userId, "folders");
}

export async function listFolders(userId: string): Promise<Folder[]> {
  const ref = foldersRef(userId);
  if (!ref) return [];
  const snapshot = await getDocs(query(ref, orderBy("createdAt", "asc")));
  return snapshot.docs.map((docSnapshot) => ({
    id: docSnapshot.id,
    name: docSnapshot.data().name as string,
    createdAt: docSnapshot.data().createdAt?.toMillis?.() ?? Date.now(),
  }));
}

export async function createFolder(userId: string, name: string): Promise<string> {
  const ref = foldersRef(userId);
  if (!ref) throw new Error("Firestore is not configured");
  const docRef = await addDoc(ref, { name, createdAt: serverTimestamp() });
  return docRef.id;
}

export async function deleteFolder(userId: string, folderId: string): Promise<void> {
  const firestore = getDb();
  if (!firestore) return;
  await deleteDoc(doc(firestore, "users", userId, "folders", folderId));
}
