// ===== DATA TYPES =====

export interface WorkExperience {
  id: string;
  period: string;
  title: string;
  company: string;
  company_url: string | null;
  description: string;
  sort_order: number;
  created_at: string;
}

export interface Education {
  id: string;
  period: string;
  title: string;
  institution: string;
  institution_url: string | null;
  description: string;
  sort_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  project_url: string;
  tags: string[];
  sort_order: number;
  created_at: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  sort_order: number;
}

export interface Skill {
  id: string;
  category_id: string;
  name: string;
  url: string | null;
  sort_order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_url: string | null;
  tags: string[];
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  tagline: string;
  bio: string;
  photo_url: string | null;
  cv_url: string | null;
  instagram_url: string | null;
  github_url: string | null;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number | null;
  type: string;
  index_type: string | null;
  doi_url: string | null;
  url: string | null;
  sort_order: number;
  created_at: string;
}

export interface HkiEntry {
  id: string;
  title: string;
  type: string;
  registration_number: string | null;
  status: string | null;
  holder: string | null;
  grant_date: string | null;
  description: string | null;
  image_url: string | null;
  document_url: string | null;
  url: string | null;
  sort_order: number;
  created_at: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string | null;
  expiration_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

// ===== SETTINGS =====

export type MenuKey =
  | 'home'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'blog'
  | 'hki'
  | 'publikasi'
  | 'sertifikasi'
  | 'contact';

export type MenuVisibility = Record<MenuKey, boolean>;

export interface Settings {
  id: string;
  data: {
    menu_visibility: Partial<MenuVisibility>;
    [key: string]: unknown;
  };
  updated_at: string;
}

// ===== COMPONENT PROP TYPES =====

export interface TimelineItemProps {
  title: string;
  period: string;
  company: string;
  url?: string | null;
  description: string;
  direction: 'left' | 'right';
}

export interface ProjectCardProps {
  project: Project;
  direction: 'left' | 'right';
}

export interface SkillCategoryProps {
  category: string;
  skills: Skill[];
}

export interface BlogCardProps {
  post: BlogPost;
}

// ===== THEME =====

export type Theme = 'dark' | 'light';
