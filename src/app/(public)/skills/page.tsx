import { createClient } from "@/lib/supabase-server";
import { SkillsClient } from "@/components/portfolio/SkillsClient";

export const revalidate = 0;

export default async function SkillsPage() {
  const supabase = await createClient();

  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .order("level", { ascending: false });

  // Map icons and group skills
  // In a real app, you might store category icons in the DB or a map
  const groupedSkills = skills?.reduce((acc: any, skill: any) => {
    const category = skill.category;
    if (!acc[category]) {
      acc[category] = {
        title: category,
        skills: []
      };
    }
    acc[category].skills.push(skill);
    return acc;
  }, {});

  const skillCategories = Object.values(groupedSkills || {});

  const { data: profile } = await supabase
    .from("resume")
    .select("homepage_config")
    .limit(1)
    .maybeSingle();

  const config = profile?.homepage_config || {};

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
      <div className="mb-16">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 text-center">{config.skills_page_title || "Technical Skills"}</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-center">
          {config.skills_page_description || "A comprehensive overview of my technical expertise and proficiency levels across different domains of software development."}
        </p>
      </div>

      <SkillsClient categories={skillCategories} />
    </div>
  );
}
