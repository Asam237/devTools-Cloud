"use client";

import { CopyButton } from "@/components/copy-button";
import { Modal } from "@/components/ui/modal";
import {
  createEnvironment,
  deleteEnvironment,
  listEnvironments,
  setEnvironmentVariables,
  type EnvVariable,
  type Environment,
} from "@/lib/firebase/environments";
import { inputClass, labelClass, primaryButtonClass } from "@/lib/utils";
import { Eye, EyeOff, Layers, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

export function EnvironmentsPanel({ userId, projectId }: { userId: string; projectId: string }) {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState<Record<string, Set<number>>>({});

  const [modalOpen, setModalOpen] = useState(false);
  const [envName, setEnvName] = useState("");
  const [creating, setCreating] = useState(false);

  async function refresh() {
    const list = await listEnvironments(userId, projectId);
    setEnvironments(list);
  }

  useEffect(() => {
    let cancelled = false;
    listEnvironments(userId, projectId).then((list) => {
      if (!cancelled) {
        setEnvironments(list);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [userId, projectId]);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!envName.trim()) return;
    setCreating(true);
    await createEnvironment(userId, projectId, envName.trim());
    setEnvName("");
    setCreating(false);
    setModalOpen(false);
    await refresh();
  }

  async function handleDeleteEnvironment(environmentId: string) {
    await deleteEnvironment(userId, projectId, environmentId);
    await refresh();
  }

  function toggleReveal(environmentId: string, index: number) {
    setRevealed((prev) => {
      const set = new Set(prev[environmentId] ?? []);
      if (set.has(index)) set.delete(index);
      else set.add(index);
      return { ...prev, [environmentId]: set };
    });
  }

  async function updateVariables(environment: Environment, variables: EnvVariable[]) {
    setEnvironments((prev) => prev.map((env) => (env.id === environment.id ? { ...env, variables } : env)));
    await setEnvironmentVariables(userId, projectId, environment.id, variables);
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium uppercase tracking-wide text-foreground-subtle">Environments</h2>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
        >
          <Plus className="h-3.5 w-3.5" />
          New environment
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-dashed border-border p-6">
          <Loader2 className="h-4 w-4 animate-spin text-foreground-subtle" />
        </div>
      ) : environments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-foreground-subtle">
          No environments yet. Store BASE_URL, API keys, and other per-environment variables here.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {environments.map((environment) => (
            <EnvironmentCard
              key={environment.id}
              environment={environment}
              revealedIndexes={revealed[environment.id] ?? new Set()}
              onToggleReveal={(index) => toggleReveal(environment.id, index)}
              onChangeVariables={(variables) => updateVariables(environment, variables)}
              onDelete={() => handleDeleteEnvironment(environment.id)}
            />
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New environment">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Name</label>
            <input
              value={envName}
              onChange={(event) => setEnvName(event.target.value)}
              placeholder="e.g. Development"
              className={inputClass}
              autoFocus
              required
            />
          </div>
          <button type="submit" disabled={creating || !envName.trim()} className={primaryButtonClass}>
            {creating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Create environment
          </button>
        </form>
      </Modal>
    </section>
  );
}

function EnvironmentCard({
  environment,
  revealedIndexes,
  onToggleReveal,
  onChangeVariables,
  onDelete,
}: {
  environment: Environment;
  revealedIndexes: Set<number>;
  onToggleReveal: (index: number) => void;
  onChangeVariables: (variables: EnvVariable[]) => void;
  onDelete: () => void;
}) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [secret, setSecret] = useState(false);

  function handleAddVariable(event: FormEvent) {
    event.preventDefault();
    if (!key.trim()) return;
    onChangeVariables([...environment.variables, { key: key.trim(), value, secret }]);
    setKey("");
    setValue("");
    setSecret(false);
  }

  function handleDeleteVariable(index: number) {
    onChangeVariables(environment.variables.filter((_, i) => i !== index));
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-foreground">{environment.name}</span>
        </span>
        <button type="button" onClick={onDelete} className="text-foreground-subtle transition-colors hover:text-danger">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {environment.variables.length > 0 ? (
        <div className="mb-3 flex flex-col gap-1.5">
          {environment.variables.map((variable, index) => {
            const isRevealed = revealedIndexes.has(index);
            const displayValue = variable.secret && !isRevealed ? "•".repeat(Math.max(variable.value.length, 8)) : variable.value;
            return (
              <div
                key={`${variable.key}-${index}`}
                className="flex items-center gap-2 rounded-md border border-border bg-background-subtle px-3 py-2 font-mono text-xs"
              >
                <span className="w-32 shrink-0 truncate font-medium text-foreground">{variable.key}</span>
                <span className="min-w-0 flex-1 truncate text-foreground-muted">{displayValue}</span>
                {variable.secret ? (
                  <button
                    type="button"
                    onClick={() => onToggleReveal(index)}
                    className="shrink-0 text-foreground-subtle transition-colors hover:text-foreground"
                  >
                    {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                ) : null}
                <CopyButton value={variable.value} label="" className="shrink-0 border-none bg-transparent px-1 py-0" />
                <button
                  type="button"
                  onClick={() => handleDeleteVariable(index)}
                  className="shrink-0 text-foreground-subtle transition-colors hover:text-danger"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      ) : null}

      <form onSubmit={handleAddVariable} className="flex flex-wrap items-center gap-2">
        <input
          value={key}
          onChange={(event) => setKey(event.target.value)}
          placeholder="KEY"
          className={`${inputClass} w-32 font-mono text-xs`}
        />
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="value"
          className={`${inputClass} min-w-0 flex-1 font-mono text-xs`}
        />
        <label className="flex shrink-0 items-center gap-1.5 text-xs text-foreground-muted">
          <input type="checkbox" checked={secret} onChange={(event) => setSecret(event.target.checked)} />
          Secret
        </label>
        <button
          type="submit"
          disabled={!key.trim()}
          className="shrink-0 rounded-md border border-border bg-background-subtle px-2.5 py-1.5 text-xs font-medium text-foreground-muted transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add
        </button>
      </form>
    </div>
  );
}
