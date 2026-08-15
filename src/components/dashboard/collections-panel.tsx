"use client";

import { Modal } from "@/components/ui/modal";
import { createCollection, deleteCollection, listCollections, type ApiCollection } from "@/lib/firebase/collections";
import {
  createRequest,
  deleteRequest,
  listRequests,
  type ApiRequestMeta,
  type HttpMethod,
} from "@/lib/firebase/requests";
import { inputClass, labelClass, primaryButtonClass, textareaClass } from "@/lib/utils";
import { Boxes, ChevronDown, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "text-success",
  POST: "text-accent",
  PUT: "text-warning",
  PATCH: "text-warning",
  DELETE: "text-danger",
};

export function CollectionsPanel({ userId, projectId }: { userId: string; projectId: string }) {
  const [collections, setCollections] = useState<ApiCollection[]>([]);
  const [requests, setRequests] = useState<ApiRequestMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [creatingCollection, setCreatingCollection] = useState(false);

  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestName, setRequestName] = useState("");
  const [requestMethod, setRequestMethod] = useState<HttpMethod>("GET");
  const [requestUrl, setRequestUrl] = useState("");
  const [requestCollectionId, setRequestCollectionId] = useState<string>("");
  const [requestNotes, setRequestNotes] = useState("");
  const [creatingRequest, setCreatingRequest] = useState(false);

  async function refresh() {
    const [collectionList, requestList] = await Promise.all([
      listCollections(userId, projectId),
      listRequests(userId, projectId),
    ]);
    setCollections(collectionList);
    setRequests(requestList);
  }

  useEffect(() => {
    let cancelled = false;
    Promise.all([listCollections(userId, projectId), listRequests(userId, projectId)]).then(
      ([collectionList, requestList]) => {
        if (!cancelled) {
          setCollections(collectionList);
          setRequests(requestList);
          setLoading(false);
        }
      }
    );
    return () => {
      cancelled = true;
    };
  }, [userId, projectId]);

  function toggle(collectionId: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(collectionId)) next.delete(collectionId);
      else next.add(collectionId);
      return next;
    });
  }

  async function handleCreateCollection(event: FormEvent) {
    event.preventDefault();
    if (!collectionName.trim()) return;
    setCreatingCollection(true);
    await createCollection(userId, projectId, collectionName.trim());
    setCollectionName("");
    setCreatingCollection(false);
    setCollectionModalOpen(false);
    await refresh();
  }

  async function handleDeleteCollection(collectionId: string) {
    await deleteCollection(userId, projectId, collectionId);
    await refresh();
  }

  async function handleCreateRequest(event: FormEvent) {
    event.preventDefault();
    if (!requestName.trim() || !requestUrl.trim()) return;
    setCreatingRequest(true);
    await createRequest(userId, projectId, {
      collectionId: requestCollectionId || null,
      name: requestName.trim(),
      method: requestMethod,
      url: requestUrl.trim(),
      notes: requestNotes.trim(),
    });
    setRequestName("");
    setRequestUrl("");
    setRequestNotes("");
    setRequestMethod("GET");
    setRequestCollectionId("");
    setCreatingRequest(false);
    setRequestModalOpen(false);
    await refresh();
  }

  async function handleDeleteRequest(requestId: string) {
    await deleteRequest(userId, projectId, requestId);
    await refresh();
  }

  const uncategorized = requests.filter(
    (request) => !request.collectionId || !collections.some((c) => c.id === request.collectionId)
  );

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium uppercase tracking-wide text-foreground-subtle">
          Collections &amp; requests
        </h2>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setCollectionModalOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            New collection
          </button>
          <button
            type="button"
            onClick={() => setRequestModalOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            New request
          </button>
        </div>
      </div>

      <p className="mb-4 text-xs text-foreground-subtle">
        Requests are saved here as reference — run them directly once the API Tester ships.
      </p>

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-dashed border-border p-6">
          <Loader2 className="h-4 w-4 animate-spin text-foreground-subtle" />
        </div>
      ) : collections.length === 0 && uncategorized.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-foreground-subtle">
          No collections yet. Group related API requests together.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {collections.map((coll) => {
            const collRequests = requests.filter((r) => r.collectionId === coll.id);
            const open = expanded.has(coll.id);
            return (
              <div key={coll.id} className="overflow-hidden rounded-xl border border-border bg-surface">
                <button
                  type="button"
                  onClick={() => toggle(coll.id)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                >
                  <span className="flex items-center gap-2">
                    <Boxes className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium text-foreground">{coll.name}</span>
                    <span className="text-xs text-foreground-subtle">({collRequests.length})</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <Trash2
                      className="h-3.5 w-3.5 text-foreground-subtle transition-colors hover:text-danger"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteCollection(coll.id);
                      }}
                    />
                    <ChevronDown
                      className={`h-4 w-4 text-foreground-subtle transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </span>
                </button>
                {open ? (
                  <div className="divide-y divide-border border-t border-border">
                    {collRequests.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-foreground-subtle">No requests in this collection yet.</p>
                    ) : (
                      collRequests.map((request) => (
                        <RequestRow key={request.id} request={request} onDelete={() => handleDeleteRequest(request.id)} />
                      ))
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}

          {uncategorized.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-dashed border-border bg-surface">
              <div className="px-4 py-3 text-sm font-medium text-foreground-muted">Uncategorized</div>
              <div className="divide-y divide-border border-t border-border">
                {uncategorized.map((request) => (
                  <RequestRow key={request.id} request={request} onDelete={() => handleDeleteRequest(request.id)} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}

      <Modal open={collectionModalOpen} onClose={() => setCollectionModalOpen(false)} title="New collection">
        <form onSubmit={handleCreateCollection} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Name</label>
            <input
              value={collectionName}
              onChange={(event) => setCollectionName(event.target.value)}
              placeholder="e.g. Authentication"
              className={inputClass}
              autoFocus
              required
            />
          </div>
          <button type="submit" disabled={creatingCollection || !collectionName.trim()} className={primaryButtonClass}>
            {creatingCollection ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Create collection
          </button>
        </form>
      </Modal>

      <Modal open={requestModalOpen} onClose={() => setRequestModalOpen(false)} title="New request">
        <form onSubmit={handleCreateRequest} className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="w-28">
              <label className={labelClass}>Method</label>
              <select
                value={requestMethod}
                onChange={(event) => setRequestMethod(event.target.value as HttpMethod)}
                className={inputClass}
              >
                {METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className={labelClass}>Name</label>
              <input
                value={requestName}
                onChange={(event) => setRequestName(event.target.value)}
                placeholder="e.g. Get customers"
                className={inputClass}
                required
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>URL</label>
            <input
              value={requestUrl}
              onChange={(event) => setRequestUrl(event.target.value)}
              placeholder="https://api.example.com/customers"
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Collection</label>
            <select
              value={requestCollectionId}
              onChange={(event) => setRequestCollectionId(event.target.value)}
              className={inputClass}
            >
              <option value="">Uncategorized</option>
              {collections.map((coll) => (
                <option key={coll.id} value={coll.id}>
                  {coll.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              value={requestNotes}
              onChange={(event) => setRequestNotes(event.target.value)}
              rows={3}
              placeholder="Headers, body, auth notes..."
              className={textareaClass}
            />
          </div>
          <button
            type="submit"
            disabled={creatingRequest || !requestName.trim() || !requestUrl.trim()}
            className={primaryButtonClass}
          >
            {creatingRequest ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Create request
          </button>
        </form>
      </Modal>
    </section>
  );
}

function RequestRow({ request, onDelete }: { request: ApiRequestMeta; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5">
      <div className="flex min-w-0 items-center gap-3">
        <span className={`w-14 shrink-0 font-mono text-xs font-semibold ${METHOD_COLORS[request.method]}`}>
          {request.method}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm text-foreground">{request.name}</p>
          <p className="truncate text-xs text-foreground-subtle">{request.url}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="shrink-0 text-foreground-subtle transition-colors hover:text-danger"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
