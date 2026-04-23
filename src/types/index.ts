export type ProjectStatus = 'Draft' | 'Live' | 'In Progress' | 'Past Job';

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  tech_stack: string[];
  status: ProjectStatus;
  progress: number;
  live_url?: string;
  github_url?: string;
  type: 'Freelance' | 'Portfolio';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
}

export interface Update {
  id: string;
  project_id: string;
  note: string;
  progress: number;
  created_at: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  desc: string[];
}

export interface Education {
  school: string;
  degree: string;
  period: string;
}

export interface ResumeData {
  id: string;
  fullName: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: Experience[];
  skills: string[];
  education: Education[];
  projects?: string[]; // IDs or names of featured projects
  photo_url?: string;
  stats?: Array<{ label: string; value: string; icon: string; color: string; }>;
  homepage_config?: {
    hero_headline_part1?: string;
    hero_headline_part2?: string;
    hero_availability?: string;
    hero_cta_primary?: string;
    hero_cta_secondary?: string;
    freelance_label?: string;
    freelance_title?: string;
    freelance_description?: string;
    portfolio_label?: string;
    portfolio_title?: string;
    portfolio_description?: string;
    skills_title?: string;
    skills_description?: string;
    seo_title?: string;
    seo_description?: string;
    site_name?: string;
    portfolio_page_title?: string;
    portfolio_page_description?: string;
    skills_page_title?: string;
    skills_page_description?: string;
    progress_page_title?: string;
    progress_page_description?: string;
    whatsapp_business?: string;
    contact_options?: Array<{ label: string; message: string; }>;
  };
  whatsapp_personal?: string;
}
