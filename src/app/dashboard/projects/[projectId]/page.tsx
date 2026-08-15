import { ProjectDetail } from "@/components/dashboard/project-detail";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project",
  robots: { index: false },
};

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <ProjectDetail projectId={projectId} />;
}
