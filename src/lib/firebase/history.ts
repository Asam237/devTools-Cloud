import { getDb } from "@/lib/firebase/firestore";
import { addDoc, collection, getDocs, limit as limitFn, orderBy, query, serverTimestamp } from "firebase/firestore";

export type CloudHistoryEntry = {
  id: string;
  slug: string;
  name: string;
  timestamp: number;
  /** A snapshot of what was in the tool, if the user had entered something meaningful. */
  data: string | null;
};

function historyRef(userId: string) {
  const firestore = getDb();
  if (!firestore) return null;
  return collection(firestore, "users", userId, "history");
}

export async function recordCloudHistory(userId: string, slug: string, name: string, data?: string): Promise<void> {
  const ref = historyRef(userId);
  if (!ref) return;
  await addDoc(ref, { slug, name, data: data ?? null, timestamp: serverTimestamp() });
}

export async function listCloudHistory(userId: string, limitCount = 20): Promise<CloudHistoryEntry[]> {
  const ref = historyRef(userId);
  if (!ref) return [];
  const snapshot = await getDocs(query(ref, orderBy("timestamp", "desc"), limitFn(limitCount)));
  return snapshot.docs.map((docSnapshot) => {
    const data = docSnapshot.data();
    return {
      id: docSnapshot.id,
      slug: data.slug as string,
      name: data.name as string,
      timestamp: data.timestamp?.toMillis?.() ?? Date.now(),
      data: (data.data as string | null) ?? null,
    };
  });
}
