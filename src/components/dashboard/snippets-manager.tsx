"use client";

import { useAuth } from "@/components/auth-provider";
import { CopyButton } from "@/components/copy-button";
import { Modal } from "@/components/ui/modal";
import { createFolder, listFolders, type Folder } from "@/lib/firebase/folders";
import { fetchGist, mapGistLanguage, type GistFile } from "@/lib/github-gist";
import {
  createSnippet,
  deleteSnippet,
  listSnippets,
  SNIPPET_LANGUAGES,
  updateSnippet,
  type Snippet,
  type SnippetLanguage,
  type SnippetVisibility,
} from "@/lib/firebase/snippets";
import { SITE_URL } from "@/lib/site";
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass, textareaClass } from "@/lib/utils";
import { AlertCircle, ArrowLeft, Download, Globe, Link2, Loader2, Lock, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

const VISIBILITY_OPTIONS: { value: SnippetVisibility; label: string; icon: typeof Lock }[] = [
  { value: "private", label: "Private", icon: Lock },
  { value: "unlisted", label: "Unlisted", icon: Link2 },
  { value: "public", label: "Public", icon: Globe },
];

export function SnippetsManager() {
  const { user, loading, isConfigured } = useAuth();
  const router = useRouter();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [snippetsLoading, setSnippetsLoading] = useState(true);
  const [languageFilter, setLanguageFilter] = useState<SnippetLanguage | "All">("All");
  const [folderFilter, setFolderFilter] = useState<string | "All">("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState<SnippetLanguage>("JavaScript");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [visibility, setVisibility] = useState<SnippetVisibility>("private");
  const [folderId, setFolderId] = useState<string | null>(null);
  const [sourceGistUrl, setSourceGistUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [newFolderName, setNewFolderName] = useState("");

  const [gistModalOpen, setGistModalOpen] = useState(false);
  const [gistInput, setGistInput] = useState("");
  const [gistFiles, setGistFiles] = useState<GistFile[] | null>(null);
  const [gistLoading, setGistLoading] = useState(false);
  const [gistError, setGistError] = useState<string | null>(null);
  const [gistHtmlUrl, setGistHtmlUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && isConfigured && !user) {
      router.replace("/login");
    }
  }, [loading, isConfigured, user, router]);

  async function refresh() {
    if (!user) return;
    const [snippetList, folderList] = await Promise.all([listSnippets(user.uid), listFolders(user.uid)]);
    setSnippets(snippetList);
    setFolders(folderList);
  }

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    Promise.all([listSnippets(user.uid), listFolders(user.uid)]).then(([snippetList, folderList]) => {
      if (!cancelled) {
        setSnippets(snippetList);
        setFolders(folderList);
        setSnippetsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!isConfigured) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <AlertCircle className="mx-auto mb-3 h-6 w-6 text-warning" />
        <h1 className="text-lg font-medium text-foreground">Dashboard unavailable</h1>
        <p className="mt-2 text-sm text-foreground-muted">Authentication isn&apos;t configured for this deployment yet.</p>
      </div>
    );
  }

  if (loading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center py-32">
        <Loader2 className="h-5 w-5 animate-spin text-foreground-subtle" />
      </div>
    );
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setLanguage("JavaScript");
    setCode("");
    setDescription("");
    setTagsText("");
    setVisibility("private");
    setFolderId(null);
    setSourceGistUrl(null);
  }

  function openCreate() {
    resetForm();
    setModalOpen(true);
  }

  function openEdit(snippet: Snippet) {
    setEditingId(snippet.id);
    setTitle(snippet.title);
    setLanguage(snippet.language);
    setCode(snippet.code);
    setDescription(snippet.description);
    setTagsText(snippet.tags.join(", "));
    setVisibility(snippet.visibility);
    setFolderId(snippet.folderId);
    setSourceGistUrl(snippet.sourceGistUrl);
    setModalOpen(true);
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!user || !title.trim() || !code.trim()) return;
    setSaving(true);
    const tags = tagsText
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 5);
    const input = {
      title: title.trim(),
      description: description.trim(),
      language,
      code,
      tags,
      visibility,
      folderId,
      sourceGistUrl,
    };
    if (editingId) {
      await updateSnippet(editingId, input);
    } else {
      const ownerName = user.displayName || user.email || null;
      await createSnippet(user.uid, ownerName, input);
    }
    setSaving(false);
    setModalOpen(false);
    await refresh();
  }

  async function handleDelete(snippetId: string) {
    if (!window.confirm("Delete this snippet?")) return;
    await deleteSnippet(snippetId);
    await refresh();
  }

  async function handleCreateFolder(event: FormEvent) {
    event.preventDefault();
    if (!user || !newFolderName.trim()) return;
    const id = await createFolder(user.uid, newFolderName.trim());
    setNewFolderName("");
    await refresh();
    setFolderId(id);
  }

  function openGistImport() {
    setGistInput("");
    setGistFiles(null);
    setGistError(null);
    setGistHtmlUrl(null);
    setGistModalOpen(true);
  }

  async function handleGistFetch(event: FormEvent) {
    event.preventDefault();
    if (!gistInput.trim()) return;
    setGistLoading(true);
    setGistError(null);
    try {
      const result = await fetchGist(gistInput);
      setGistFiles(result.files);
      setGistHtmlUrl(result.htmlUrl);
      if (!description.trim()) setDescription(result.description);
    } catch (err) {
      setGistError(err instanceof Error ? err.message : "Couldn't import this Gist.");
    }
    setGistLoading(false);
  }

  function applyGistFile(file: GistFile) {
    resetForm();
    setTitle(file.filename);
    setCode(file.content);
    setLanguage(mapGistLanguage(file.language));
    setSourceGistUrl(gistHtmlUrl);
    setGistModalOpen(false);
    setModalOpen(true);
  }

  const filtered = snippets.filter((snippet) => {
    if (languageFilter !== "All" && snippet.language !== languageFilter) return false;
    if (folderFilter !== "All" && snippet.folderId !== folderFilter) return false;
    return true;
  });

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-24 pt-8 sm:px-6">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Dashboard
      </Link>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Snippets</h1>
          <p className="mt-1 text-sm text-foreground-muted">Reusable code, saved across devices — private, unlisted, or public.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={openGistImport} className={secondaryButtonClass}>
            <Download className="h-3.5 w-3.5" />
            Import from Gist
          </button>
          <button type="button" onClick={openCreate} className={primaryButtonClass}>
            <Plus className="h-3.5 w-3.5" />
            New snippet
          </button>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setLanguageFilter("All")}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            languageFilter === "All" ? "border-accent bg-accent-soft text-accent" : "border-border text-foreground-muted hover:text-foreground"
          }`}
        >
          All languages
        </button>
        {SNIPPET_LANGUAGES.map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setLanguageFilter(lang)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              languageFilter === lang ? "border-accent bg-accent-soft text-accent" : "border-border text-foreground-muted hover:text-foreground"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {folders.length > 0 ? (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFolderFilter("All")}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              folderFilter === "All" ? "border-accent bg-accent-soft text-accent" : "border-border text-foreground-muted hover:text-foreground"
            }`}
          >
            All folders
          </button>
          {folders.map((folder) => (
            <button
              key={folder.id}
              type="button"
              onClick={() => setFolderFilter(folder.id)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                folderFilter === folder.id ? "border-accent bg-accent-soft text-accent" : "border-border text-foreground-muted hover:text-foreground"
              }`}
            >
              {folder.name}
            </button>
          ))}
        </div>
      ) : null}

      {snippetsLoading ? (
        <div className="flex items-center justify-center rounded-xl border border-dashed border-border p-6">
          <Loader2 className="h-4 w-4 animate-spin text-foreground-subtle" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-foreground-subtle">
          {snippets.length === 0 ? "No snippets yet." : "No snippets match this filter."}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((snippet) => {
            const VisibilityIcon = VISIBILITY_OPTIONS.find((option) => option.value === snippet.visibility)?.icon ?? Lock;
            const folderName = folders.find((folder) => folder.id === snippet.folderId)?.name;
            return (
              <div key={snippet.id} className="rounded-xl border border-border bg-surface p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-sm font-medium text-foreground">{snippet.title}</h3>
                      <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-xs text-foreground-subtle">
                        {snippet.language}
                      </span>
                      <span className="flex shrink-0 items-center gap-1 text-xs text-foreground-subtle" title={snippet.visibility}>
                        <VisibilityIcon className="h-3 w-3" />
                        {snippet.visibility}
                      </span>
                      {folderName ? (
                        <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-xs text-foreground-subtle">
                          {folderName}
                        </span>
                      ) : null}
                    </div>
                    {snippet.description ? <p className="mt-1 text-sm text-foreground-muted">{snippet.description}</p> : null}
                    {snippet.tags.length > 0 ? (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {snippet.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-background-subtle px-2 py-0.5 text-xs text-foreground-subtle">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <CopyButton value={snippet.code} label="Copy" />
                    {snippet.visibility !== "private" ? (
                      <CopyButton value={`${SITE_URL}/snippets/${snippet.id}`} label="" className="px-1.5">
                      </CopyButton>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => openEdit(snippet)}
                      className="rounded-md p-1.5 text-foreground-subtle transition-colors hover:text-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(snippet.id)}
                      className="rounded-md p-1.5 text-foreground-subtle transition-colors hover:text-danger"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <pre className="overflow-x-auto rounded-lg border border-border bg-background-subtle px-3.5 py-3 font-mono text-xs leading-relaxed text-foreground">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit snippet" : "New snippet"}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className={labelClass}>Title</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Fetch with auth header"
                className={inputClass}
                autoFocus
                required
              />
            </div>
            <div className="w-36">
              <label className={labelClass}>Language</label>
              <select value={language} onChange={(event) => setLanguage(event.target.value as SnippetLanguage)} className={inputClass}>
                {SNIPPET_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Description (optional)</label>
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What is this for?"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Tags (comma-separated, up to 5)</label>
            <input
              value={tagsText}
              onChange={(event) => setTagsText(event.target.value)}
              placeholder="react, hooks, auth"
              className={inputClass}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className={labelClass}>Visibility</label>
              <div className="flex overflow-hidden rounded-md border border-border">
                {VISIBILITY_OPTIONS.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setVisibility(value)}
                    className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-2 text-xs transition-colors ${
                      visibility === value ? "bg-accent text-accent-foreground" : "bg-transparent text-foreground-muted hover:bg-surface-hover"
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <label className={labelClass}>Folder (optional)</label>
              <select
                value={folderId ?? ""}
                onChange={(event) => setFolderId(event.target.value || null)}
                className={inputClass}
              >
                <option value="">No folder</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-end gap-2 rounded-lg border border-dashed border-border p-3">
            <div className="flex-1">
              <label className={labelClass}>New folder</label>
              <input
                value={newFolderName}
                onChange={(event) => setNewFolderName(event.target.value)}
                placeholder="e.g. Auth snippets"
                className={inputClass}
              />
            </div>
            <button type="button" onClick={handleCreateFolder} disabled={!newFolderName.trim()} className={secondaryButtonClass}>
              Create
            </button>
          </div>

          {editingId && visibility !== "private" ? (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background-subtle px-3.5 py-2.5">
              <span className="truncate text-xs text-foreground-subtle">{SITE_URL}/snippets/{editingId}</span>
              <CopyButton value={`${SITE_URL}/snippets/${editingId}`} label="Copy link" className="shrink-0" />
            </div>
          ) : null}

          <div>
            <label className={labelClass}>Code</label>
            <textarea value={code} onChange={(event) => setCode(event.target.value)} rows={8} className={`${textareaClass} font-mono`} required />
          </div>

          <button type="submit" disabled={saving || !title.trim() || !code.trim()} className={primaryButtonClass}>
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {editingId ? "Save changes" : "Create snippet"}
          </button>
        </form>
      </Modal>

      <Modal open={gistModalOpen} onClose={() => setGistModalOpen(false)} title="Import from GitHub Gist">
        <form onSubmit={handleGistFetch} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Gist ID or URL</label>
            <input
              value={gistInput}
              onChange={(event) => setGistInput(event.target.value)}
              placeholder="https://gist.github.com/user/abc123..."
              className={inputClass}
              autoFocus
            />
          </div>
          <button type="submit" disabled={gistLoading || !gistInput.trim()} className={primaryButtonClass}>
            {gistLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Fetch Gist
          </button>
          {gistError ? <p className="text-xs text-danger">{gistError}</p> : null}

          {gistFiles ? (
            <div className="flex flex-col gap-2">
              <p className={labelClass}>{gistFiles.length > 1 ? "Choose a file to import" : "File found"}</p>
              {gistFiles.map((file) => (
                <button
                  key={file.filename}
                  type="button"
                  onClick={() => applyGistFile(file)}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background-subtle px-3.5 py-2.5 text-left text-sm text-foreground transition-colors hover:border-foreground-subtle"
                >
                  <span className="truncate font-mono">{file.filename}</span>
                  <span className="shrink-0 text-xs text-foreground-subtle">{mapGistLanguage(file.language)}</span>
                </button>
              ))}
            </div>
          ) : null}
        </form>
      </Modal>
    </div>
  );
}
