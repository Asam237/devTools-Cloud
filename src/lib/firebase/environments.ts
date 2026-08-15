import { getDb } from "@/lib/firebase/firestore";
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";

export type EnvVariable = {
  key: string;
  value: string;
  secret: boolean;
};

export type Environment = {
  id: string;
  name: string;
  variables: EnvVariable[];
  createdAt: number;
};

function environmentsRef(userId: string, projectId: string) {
  const firestore = getDb();
  if (!firestore) return null;
  return collection(firestore, "users", userId, "projects", projectId, "environments");
}

export async function listEnvironments(userId: string, projectId: string): Promise<Environment[]> {
  const ref = environmentsRef(userId, projectId);
  if (!ref) return [];
  const snapshot = await getDocs(ref);
  return snapshot.docs
    .map((docSnapshot) => {
      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        name: data.name as string,
        variables: (data.variables as EnvVariable[]) ?? [],
        createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
      };
    })
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function createEnvironment(userId: string, projectId: string, name: string): Promise<void> {
  const ref = environmentsRef(userId, projectId);
  if (!ref) return;
  await addDoc(ref, { name, variables: [], createdAt: serverTimestamp() });
}

export async function deleteEnvironment(userId: string, projectId: string, environmentId: string): Promise<void> {
  const firestore = getDb();
  if (!firestore) return;
  await deleteDoc(doc(firestore, "users", userId, "projects", projectId, "environments", environmentId));
}

export async function setEnvironmentVariables(
  userId: string,
  projectId: string,
  environmentId: string,
  variables: EnvVariable[]
): Promise<void> {
  const firestore = getDb();
  if (!firestore) return;
  await updateDoc(doc(firestore, "users", userId, "projects", projectId, "environments", environmentId), {
    variables,
  });
}
