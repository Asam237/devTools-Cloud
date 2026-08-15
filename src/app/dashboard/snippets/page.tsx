import { SnippetsManager } from "@/components/dashboard/snippets-manager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Snippets",
  robots: { index: false },
};

export default function SnippetsPage() {
  return <SnippetsManager />;
}
