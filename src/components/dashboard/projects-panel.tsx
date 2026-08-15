"use client";

import { Modal } from "@/components/ui/modal";
import { createProject, listProjects, type Project } from "@/lib/firebase/projects";
import { inputClass, labelClass, primaryButtonClass } from "@/lib/utils";
import { FolderClosed, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

export function ProjectsPanel({ userId }: { userId: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listProjects(userId)
      .catch(() => [])
      .then((list) => {
        if (!cancelled) {
          setProjects(list);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function refresh() {
    const list = await listProjects(userId);
    setProjects(list);
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    await createProject(userId, name.trim());
    setName("");
    setCreating(false);
    setOpen(false);
    await refresh();
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium uppercase tracking-wide text-foreground-subtle">Projects</h2>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
        >
          <Plus className="h-3.5 w-3.5" />
          New project
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-dashed border-border p-6">
          <Loader2 className="h-4 w-4 animate-spin text-foreground-subtle" />
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-foreground-subtle">
          No projects yet. Create one to organize collections, environments, and snippets.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="group flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:border-foreground-subtle"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background-subtle">
                <FolderClosed className="h-4 w-4 text-accent" />
              </span>
              <p className="truncate text-sm font-medium text-foreground">{project.name}</p>
            </Link>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="New project">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. E-commerce API"
              className={inputClass}
              autoFocus
              required
            />
          </div>
          <button type="submit" disabled={creating || !name.trim()} className={primaryButtonClass}>
            {creating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Create project
          </button>
        </form>
      </Modal>
    </section>
  );
}
