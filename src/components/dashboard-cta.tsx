"use client";

import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import type { ReactNode } from "react";

export function DashboardCta({ className, children }: { className?: string; children: ReactNode }) {
  const { user, isConfigured } = useAuth();
  const href = isConfigured && user ? "/dashboard" : "/login";
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
