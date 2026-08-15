"use client";

import { useAuth } from "@/components/auth-provider";
import { CollectionsPanel } from "@/components/dashboard/collections-panel";
import { EnvironmentsPanel } from "@/components/dashboard/environments-panel";
import { deleteProject, getProject, renameProject, type Project } from "@/lib/firebase/projects";
import { inputClass, primaryButtonClass, secondaryButtonClass } from "@/lib/utils";
import { AlertCircle, ArrowLeft, Check, Loader2, Pencil, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ProjectDetail({ projectId }: { projectId: string }) {
  const { user, loading, isConfigured } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState<Project | null | undefined>(undefined);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!loading && isConfigured && !user) {
      router.replace("/login");
    }
  }, [loading, isConfigured, user, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getProject(user.uid, projectId).then((result) => {
      if (!cancelled) {
        setProject(result);
        setName(result?.name ?? "");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [user, projectId]);

  if (!isConfigured) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <AlertCircle className="mx-auto mb-3 h-6 w-6 text-warning" />
        <h1 className="text-lg font-medium text-foreground">Dashboard unavailable</h1>
        <p className="mt-2 text-sm text-foreground-muted">Authentication isn&apos;t configured for this deployment yet.</p>
      </div>
    );
  }

  if (loading || !user || project === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center py-32">
        <Loader2 className="h-5 w-5 animate-spin text-foreground-subtle" />
      </div>
    );
  }

  if (project === null) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <AlertCircle className="mx-auto mb-3 h-6 w-6 text-warning" />
        <h1 className="text-lg font-medium text-foreground">Project not found</h1>
        <Link href="/dashboard" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
          Back to dashboard →
        </Link>
      </div>
    );
  }

  async function handleSaveName() {
    if (!user || !name.trim()) return;
    setSaving(true);
    await renameProject(user.uid, projectId, name.trim());
    setProject((prev) => (prev ? { ...prev, name: name.trim() } : prev));
    setSaving(false);
    setEditing(false);
  }

  async function handleDelete() {
    if (!user) return;
    if (!window.confirm("Delete this project and everything in it? This can't be undone.")) return;
    setDeleting(true);
    await deleteProject(user.uid, projectId);
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-8 sm:px-6">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Dashboard
      </Link>

      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
              autoFocus
            />
            <button type="button" onClick={handleSaveName} disabled={saving} className={primaryButtonClass}>
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setName(project.name);
              }}
              className={secondaryButtonClass}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{project.name}</h1>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-foreground-subtle transition-colors hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1.5 self-start rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:border-danger disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          Delete project
        </button>
      </div>

      <div className="flex flex-col gap-10">
        <CollectionsPanel userId={user.uid} projectId={projectId} />
        <EnvironmentsPanel userId={user.uid} projectId={projectId} />
      </div>
    </div>
  );
}
