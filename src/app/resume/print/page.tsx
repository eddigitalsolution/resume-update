import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { PrintResumeClient } from "../../../components/portfolio/PrintResumeClient";
import type { ResumeData, Project } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PrintResumePage() {
  const supabase = await createClient();

  const { data: resume } = await supabase
    .from("resume")
    .select("*")
    .order('id', { ascending: true })
    .limit(1)
    .maybeSingle() as { data: ResumeData | null };

  if (!resume) {
    notFound();
  }

  // Filter out legacy object data from the projects array, ensuring only valid UUID strings are queried
  const validProjectIds = (resume.projects || []).filter(
    (item: string | unknown): item is string => typeof item === 'string'
  );

  let projects: Project[] = [];
  if (validProjectIds.length > 0) {
    const { data: fetchedProjects } = await supabase
      .from("projects")
      .select("*")
      .in("id", validProjectIds) as { data: Project[] | null };
    
    // Explicitly sort the fetched projects to match the exact order they were selected/saved
    if (fetchedProjects) {
       projects = validProjectIds
         .map((id: string) => fetchedProjects.find((p: Project) => p.id === id))
         .filter((p): p is Project => !!p); // Remove any nulls if a project was deleted from the master list
    }
  }

  const data = {
    ...resume,
    featured_projects: projects || []
  };

  return <PrintResumeClient data={data} />;
}
