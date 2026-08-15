import { getDb } from "@/lib/firebase/firestore";
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiRequestMeta = {
  id: string;
  collectionId: string | null;
  name: string;
  method: HttpMethod;
  url: string;
  notes: string;
  createdAt: number;
};

export type ApiRequestInput = {
  collectionId: string | null;
  name: string;
  method: HttpMethod;
  url: string;
  notes: string;
};

function requestsRef(userId: string, projectId: string) {
  const firestore = getDb();
  if (!firestore) return null;
  return collection(firestore, "users", userId, "projects", projectId, "requests");
}

export async function listRequests(userId: string, projectId: string): Promise<ApiRequestMeta[]> {
  const ref = requestsRef(userId, projectId);
  if (!ref) return [];
  const snapshot = await getDocs(ref);
  return snapshot.docs
    .map((docSnapshot) => {
      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        collectionId: (data.collectionId as string | null) ?? null,
        name: data.name as string,
        method: data.method as HttpMethod,
        url: data.url as string,
        notes: (data.notes as string) ?? "",
        createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
      };
    })
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function createRequest(userId: string, projectId: string, input: ApiRequestInput): Promise<void> {
  const ref = requestsRef(userId, projectId);
  if (!ref) return;
  await addDoc(ref, { ...input, createdAt: serverTimestamp() });
}

export async function updateRequest(
  userId: string,
  projectId: string,
  requestId: string,
  input: ApiRequestInput
): Promise<void> {
  const firestore = getDb();
  if (!firestore) return;
  await updateDoc(doc(firestore, "users", userId, "projects", projectId, "requests", requestId), { ...input });
}

export async function deleteRequest(userId: string, projectId: string, requestId: string): Promise<void> {
  const firestore = getDb();
  if (!firestore) return;
  await deleteDoc(doc(firestore, "users", userId, "projects", projectId, "requests", requestId));
}
