"use client";

import { useAuth } from "@/components/auth-provider";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

export function HeaderDashboardLink() {
  const { user, isConfigured } = useAuth();
  if (!isConfigured || !user) return null;

  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors hover:bg-surface-hover hover:text-foreground"
    >
      <LayoutDashboard className="h-3.5 w-3.5" />
      Dashboard
    </Link>
  );
}
