import { getAdminDb } from "@/lib/firebase/admin";
import type { Snippet, SnippetLanguage } from "@/lib/firebase/snippets";
import type { DocumentData, Query } from "firebase-admin/firestore";

function toSnippet(id: string, data: DocumentData): Snippet {
  return {
    id,
    ownerId: data.ownerId,
    ownerName: data.ownerName ?? null,
    title: data.title,
    description: data.description ?? "",
    language: data.language,
    code: data.code,
    tags: data.tags ?? [],
    visibility: data.visibility ?? "private",
    folderId: data.folderId ?? null,
    sourceGistUrl: data.sourceGistUrl ?? null,
    createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
    updatedAt: data.updatedAt?.toMillis?.() ?? Date.now(),
  };
}

export async function listPublicSnippetsAdmin(
  options: { tag?: string; language?: SnippetLanguage; limit?: number } = {}
): Promise<Snippet[]> {
  const db = getAdminDb();
  if (!db) return [];
  try {
    let q: Query = db.collection("snippets").where("visibility", "==", "public");
    if (options.tag) q = q.where("tags", "array-contains", options.tag);
    if (options.language) q = q.where("language", "==", options.language);
    q = q.orderBy("createdAt", "desc").limit(options.limit ?? 60);
    const snapshot = await q.get();
    return snapshot.docs.map((docSnapshot) => toSnippet(docSnapshot.id, docSnapshot.data()));
  } catch (error) {
    // Missing composite index, transient network error, etc. — fail soft so a
    // Firestore hiccup never takes down the build or the page. See firestore.indexes.json;
    // deploy with `firebase deploy --only firestore:indexes` if this is a missing-index error.
    console.error("listPublicSnippetsAdmin failed:", error);
    return [];
  }
}

/**
 * The Admin SDK bypasses Firestore security rules entirely, so "private" must be
 * excluded here explicitly — this is the only thing standing between a private
 * snippet and a server-rendered page.
 */
export async function getSnippetByIdAdmin(id: string): Promise<Snippet | null> {
  const db = getAdminDb();
  if (!db) return null;
  try {
    const docSnap = await db.collection("snippets").doc(id).get();
    if (!docSnap.exists) return null;
    const snippet = toSnippet(docSnap.id, docSnap.data()!);
    if (snippet.visibility === "private") return null;
    return snippet;
  } catch (error) {
    console.error("getSnippetByIdAdmin failed:", error);
    return null;
  }
}

export type SnippetCommentRecord = {
  id: string;
  authorId: string;
  authorName: string | null;
  body: string;
  createdAt: number;
};

export async function listCommentsAdmin(snippetId: string): Promise<SnippetCommentRecord[]> {
  const db = getAdminDb();
  if (!db) return [];
  try {
    const snapshot = await db.collection("snippets").doc(snippetId).collection("comments").orderBy("createdAt", "asc").get();
    return snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        authorId: data.authorId,
        authorName: data.authorName ?? null,
        body: data.body,
        createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
      };
    });
  } catch (error) {
    console.error("listCommentsAdmin failed:", error);
    return [];
  }
}
