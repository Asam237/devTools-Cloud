import { getDb } from "@/lib/firebase/firestore";
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, updateDoc, writeBatch } from "firebase/firestore";

export type Project = {
  id: string;
  name: string;
  createdAt: number;
};

function projectsCollection(userId: string) {
  const firestore = getDb();
  if (!firestore) return null;
  return collection(firestore, "users", userId, "projects");
}

export async function listProjects(userId: string): Promise<Project[]> {
  const ref = projectsCollection(userId);
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

export async function getProject(userId: string, projectId: string): Promise<Project | null> {
  const firestore = getDb();
  if (!firestore) return null;
  const snapshot = await getDoc(doc(firestore, "users", userId, "projects", projectId));
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  return {
    id: snapshot.id,
    name: data.name as string,
    createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
  };
}

export async function createProject(userId: string, name: string): Promise<void> {
  const ref = projectsCollection(userId);
  if (!ref) return;
  await addDoc(ref, { name, createdAt: serverTimestamp() });
}

export async function renameProject(userId: string, projectId: string, name: string): Promise<void> {
  const firestore = getDb();
  if (!firestore) return;
  await updateDoc(doc(firestore, "users", userId, "projects", projectId), { name });
}

export async function deleteProject(userId: string, projectId: string): Promise<void> {
  const firestore = getDb();
  if (!firestore) return;

  const projectRef = doc(firestore, "users", userId, "projects", projectId);
  const [collectionsSnapshot, requestsSnapshot, environmentsSnapshot] = await Promise.all([
    getDocs(collection(firestore, "users", userId, "projects", projectId, "collections")),
    getDocs(collection(firestore, "users", userId, "projects", projectId, "requests")),
    getDocs(collection(firestore, "users", userId, "projects", projectId, "environments")),
  ]);

  const batch = writeBatch(firestore);
  for (const docSnapshot of collectionsSnapshot.docs) batch.delete(docSnapshot.ref);
  for (const docSnapshot of requestsSnapshot.docs) batch.delete(docSnapshot.ref);
  for (const docSnapshot of environmentsSnapshot.docs) batch.delete(docSnapshot.ref);
  batch.delete(projectRef);
  await batch.commit();
}
