import { getDb } from "@/lib/firebase/firestore";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export type SnippetCommentInput = {
  authorId: string;
  authorName: string | null;
  body: string;
};

export async function createSnippetComment(snippetId: string, input: SnippetCommentInput): Promise<void> {
  const firestore = getDb();
  if (!firestore) return;
  await addDoc(collection(firestore, "snippets", snippetId, "comments"), {
    ...input,
    createdAt: serverTimestamp(),
  });
}
