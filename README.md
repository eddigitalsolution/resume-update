# Professional Duality - Portfolio & Resume System

Professional Duality is a high-performance, modern portfolio and resume management system built with **Next.js 16 (App Router)**, **Supabase**, and **Framer Motion**. It is designed for professionals who manage multiple career paths (e.g., Freelance Marketing and Engineering) and need a unified system to showcase projects and generate ATS-friendly resumes.

## 🚀 New & Enhanced Features

- **🎭 Dynamic Professional Duality**: 100% data-driven split-system to showcase different career paths. No more hardcoded categories.
- **📱 Mobile-First Design**: Completely responsive navigation with an interactive hamburger menu and touch-optimized components.
- **💬 Dynamic Lead Capture**: Integrated WhatsApp "Quick Ask" system on the Progress page, fully manageable from the admin panel.
- **📊 Live Impact Metrics**: Real-time stats dashboard powered by Supabase JSONB, featuring dynamic icons and values.
- **🛠️ Branding Command Center**: Manage your entire identity—headlines, labels, SEO metadata, and contact details—directly from a secure dashboard.
- **📄 PDF Resume Generator**: ATS-optimized resume generator with A4 print formatting and auto-download capability.
- **✨ Premium Aesthetics**: Dark-mode aesthetic, glassmorphism, smooth Framer Motion transitions, and Tailwind CSS v4 performance.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Engine**: React 19
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (RBAC ready)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🏁 Getting Started

### 1. Prerequisites

- Node.js 20+ installed.
- A Supabase project.

### 2. Environment Setup

Create a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Initialization (The `supabase/` Directory)

All database scripts are organized in the `supabase/` folder:

1.  **Fresh Install**: Run `supabase/schema.sql` in your Supabase SQL Editor.
2.  **Updating Existing DB**: Run the scripts in `supabase/migrations/` in chronological order.
3.  **Required Migrations**:
    *   `20260423_contact_options.sql`: Enables dynamic WhatsApp buttons.
    *   `20260423_project_enhancements.sql`: Adds 'type' and 'is_featured' columns.
    *   `20260423_security_sync.sql`: Enables automatic RBAC role syncing.
    *   `20260423_storage_setup.sql`: Creates the 'portfolio' image bucket.
    *   `20260423_database_polish.sql`: Performance indexes and singleton constraints.

### 4. Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view.
Admin Access: [http://localhost:3000/login](http://localhost:3000/login)

## 📄 License

This project is licensed under the MIT License.
