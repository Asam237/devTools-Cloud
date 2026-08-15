import { getDb } from "@/lib/firebase/firestore";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

export type SnippetLanguage =
  | "JavaScript"
  | "TypeScript"
  | "Python"
  | "PHP"
  | "SQL"
  | "Bash"
  | "CSS"
  | "HTML"
  | "Go"
  | "Rust"
  | "Java"
  | "C++"
  | "C#"
  | "Ruby"
  | "Markdown"
  | "JSON"
  | "YAML"
  | "Other";

export const SNIPPET_LANGUAGES: SnippetLanguage[] = [
  "JavaScript",
  "TypeScript",
  "Python",
  "PHP",
  "SQL",
  "Bash",
  "CSS",
  "HTML",
  "Go",
  "Rust",
  "Java",
  "C++",
  "C#",
  "Ruby",
  "Markdown",
  "JSON",
  "YAML",
  "Other",
];

export type SnippetVisibility = "private" | "unlisted" | "public";

export type Snippet = {
  id: string;
  ownerId: string;
  ownerName: string | null;
  title: string;
  description: string;
  language: SnippetLanguage;
  code: string;
  tags: string[];
  visibility: SnippetVisibility;
  folderId: string | null;
  sourceGistUrl: string | null;
  createdAt: number;
  updatedAt: number;
};

export type SnippetInput = {
  title: string;
  description: string;
  language: SnippetLanguage;
  code: string;
  tags: string[];
  visibility: SnippetVisibility;
  folderId: string | null;
  sourceGistUrl?: string | null;
};

function snippetsRef() {
  const firestore = getDb();
  if (!firestore) return null;
  return collection(firestore, "snippets");
}

function toSnippet(id: string, data: Record<string, unknown>): Snippet {
  return {
    id,
    ownerId: data.ownerId as string,
    ownerName: (data.ownerName as string | null) ?? null,
    title: data.title as string,
    description: (data.description as string) ?? "",
    language: data.language as SnippetLanguage,
    code: data.code as string,
    tags: (data.tags as string[]) ?? [],
    visibility: (data.visibility as SnippetVisibility) ?? "private",
    folderId: (data.folderId as string | null) ?? null,
    sourceGistUrl: (data.sourceGistUrl as string | null) ?? null,
    createdAt: (data.createdAt as { toMillis?: () => number })?.toMillis?.() ?? Date.now(),
    updatedAt: (data.updatedAt as { toMillis?: () => number })?.toMillis?.() ?? Date.now(),
  };
}

/** The signed-in user's own snippets, of any visibility. */
export async function listSnippets(userId: string): Promise<Snippet[]> {
  const ref = snippetsRef();
  if (!ref) return [];
  const snapshot = await getDocs(query(ref, where("ownerId", "==", userId), orderBy("createdAt", "desc")));
  return snapshot.docs.map((docSnapshot) => toSnippet(docSnapshot.id, docSnapshot.data()));
}

export async function createSnippet(userId: string, ownerName: string | null, input: SnippetInput): Promise<string> {
  const ref = snippetsRef();
  if (!ref) throw new Error("Firestore is not configured");
  const docRef = await addDoc(ref, {
    ...input,
    sourceGistUrl: input.sourceGistUrl ?? null,
    ownerId: userId,
    ownerName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateSnippet(snippetId: string, input: SnippetInput): Promise<void> {
  const firestore = getDb();
  if (!firestore) return;
  await updateDoc(doc(firestore, "snippets", snippetId), { ...input, updatedAt: serverTimestamp() });
}

export async function deleteSnippet(snippetId: string): Promise<void> {
  const firestore = getDb();
  if (!firestore) return;
  await deleteDoc(doc(firestore, "snippets", snippetId));
}
