---
name: vercel-deploy
description: "Guidelines and checklist for deploying Next.js applications on Vercel without breaking existing features or configuration."
---

# Vercel Deployment Skill & Checklist

This skill outlines the standard deployment process and safety checks when deploying Next.js projects to Vercel.

## 1. Pre-Deployment Verification

Before triggering a deployment to Vercel:

1. **Type & Lint Check**: Ensure there are no TypeScript syntax or lint errors.
2. **Build Validation**: Validate that `next build` passes cleanly.
3. **Environment Variables**:
   - Verify required environment variables in `.env.local` are configured in the Vercel Dashboard (e.g., `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).

---

## 2. Deployment Rules ("Don't Change" Policy)

- **Preserve Existing Routes**: Do not modify or break working API endpoints, public pages (`/portfolio`, `/skills`, `/gallery`, `/project/[id]`), or admin pages (`/admin/...`).
- **Git Push Deployment**:
  - Main deployments are triggered automatically by pushing commits to `origin main`.
  - Maintain a clean commit history with concise commit messages.

```bash
git add .
git commit -m "feat: design update for skills page and agent skills"
git push origin main
```

---

## 3. Post-Deployment Verification

- Check deployment logs on Vercel dashboard.
- Verify live production URL responsiveness and error-free loading.
