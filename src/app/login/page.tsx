import { AuthForm } from "@/components/auth/auth-form";
import { Clock, FolderKanban, SquareCode } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to DevTools Cloud to save history, projects, and collections across devices.",
};

const BENEFITS = [
  { icon: Clock, text: "Every tool you use is saved to your history, automatically, across devices" },
  { icon: FolderKanban, text: "Organize API requests and collections into projects" },
  { icon: SquareCode, text: "Save reusable snippets you can pull up any time" },
];

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16 sm:px-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome to DevTools Cloud</h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Every tool stays free without an account — sign in and it also remembers your work.
        </p>
      </div>

      <ul className="mb-6 flex flex-col gap-2.5 rounded-xl border border-border bg-surface p-4">
        {BENEFITS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-start gap-2.5 text-sm text-foreground-muted">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span>{text}</span>
          </li>
        ))}
      </ul>

      <AuthForm />
    </div>
  );
}
