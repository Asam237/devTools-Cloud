"use client";

import { GoogleIcon } from "@/components/icons/google-icon";
import { useAuth } from "@/components/auth-provider";
import { authBackend } from "@/lib/auth";
import {
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/lib/utils";
import { AlertCircle, Github, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Mode = "sign-in" | "sign-up";

export function AuthForm() {
  const router = useRouter();
  const { isConfigured } = useAuth();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      if (mode === "sign-in") {
        await authBackend.signInWithEmail(email, password);
      } else {
        await authBackend.signUpWithEmail(email, password, name || undefined);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(readableAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleProvider(provider: "google" | "github") {
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      if (provider === "google") await authBackend.signInWithGoogle();
      else await authBackend.signInWithGithub();
      router.push("/dashboard");
    } catch (err) {
      setError(readableAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setError('Enter your email above first, then click "Forgot password".');
      return;
    }
    setError(null);
    try {
      await authBackend.sendPasswordReset(email);
      setInfo("Password reset email sent — check your inbox.");
    } catch (err) {
      setError(readableAuthError(err));
    }
  }

  if (!isConfigured) {
    return (
      <div className="rounded-xl border border-warning/30 bg-warning/5 p-5 text-sm text-foreground-muted">
        <p className="flex items-center gap-1.5 font-medium text-warning">
          <AlertCircle className="h-4 w-4" />
          Authentication isn&apos;t configured yet
        </p>
        <p className="mt-2">
          Set the{" "}
          <code className="rounded bg-background-subtle px-1 py-0.5 text-xs">
            NEXT_PUBLIC_FIREBASE_*
          </code>{" "}
          environment variables (see{" "}
          <code className="rounded bg-background-subtle px-1 py-0.5 text-xs">
            .env.local.example
          </code>
          ) to enable sign-in. Every free tool still works without an account.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="mb-5 flex overflow-hidden rounded-md border border-border">
        {(["sign-in", "sign-up"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
              setInfo(null);
            }}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              mode === m
                ? "bg-accent text-accent-foreground"
                : "bg-transparent text-foreground-muted hover:bg-surface-hover"
            }`}
          >
            {m === "sign-in" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => handleProvider("google")}
          disabled={submitting}
          className={`${secondaryButtonClass} w-full`}
        >
          <GoogleIcon className="h-4 w-4" />
          Continue with Google
        </button>
        {/* <button type="button" onClick={() => handleProvider("github")} disabled={submitting} className={`${secondaryButtonClass} w-full`}>
          <Github className="h-4 w-4" />
          Continue with GitHub
        </button> */}
      </div>

      <div className="mb-4 flex items-center gap-3 text-xs text-foreground-subtle">
        <span className="h-px flex-1 bg-border" />
        or with email
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {mode === "sign-up" ? (
          <div>
            <label className={labelClass}>Name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
              placeholder="Ada Lovelace"
            />
          </div>
        ) : null}
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className={labelClass}>Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>

        {error ? (
          <p className="flex items-center gap-1.5 text-xs text-danger">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </p>
        ) : null}
        {info ? <p className="text-xs text-success">{info}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className={`${primaryButtonClass} w-full`}
        >
          <Mail className="h-3.5 w-3.5" />
          {mode === "sign-in" ? "Sign in" : "Create account"}
        </button>

        {mode === "sign-in" ? (
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-center text-xs text-foreground-subtle hover:text-foreground"
          >
            Forgot password?
          </button>
        ) : null}
      </form>
    </div>
  );
}

function readableAuthError(err: unknown): string {
  if (err instanceof Error) {
    const match = err.message.match(/auth\/([a-z-]+)/);
    if (match) return match[1].replace(/-/g, " ");
    return err.message;
  }
  return "Something went wrong. Please try again.";
}
