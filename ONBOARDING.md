# Hecta CMS - Developer Onboarding Guide

Welcome to Hecta! This guide will get you up to speed on the project architecture, setup process, and key workflows.

## Quick Start (5 minutes)

### Prerequisites

- **Node.js**: 18.20.2 or higher (recommend 20.9.0+)
- **pnpm**: Package manager (install with `npm install -g pnpm`)
- **Git**: For version control
- **Database Access**: PostgreSQL connection details (from Supabase or your DBA)
- **Cloudinary Account**: For media uploads (credentials in `.env`)

### Setup Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd hecta

# 2. Copy environment variables
cp .env.example .env

# 3. Update .env with your credentials (see "Environment Variables" section below)
# Edit .env in your editor and fill in the values

# 4. Install dependencies
pnpm install

# 5. Start the development server
pnpm dev

# 6. Open browser
# Admin panel: http://localhost:3000/admin
# Frontend: http://localhost:3000
```

**Expected output**: Server running on port 3000, both frontend and admin accessible.

---

## Understanding the Architecture

### What is Hecta?

Hecta is a **headless CMS** built on **Payload CMS 3.0** that separates content management from the public website:

- **Payload Admin Panel** (`/admin`) - Content editors manage posts, media, and users
- **Frontend** (`/`) - Public-facing website that displays managed content
- **PostgreSQL Database** - All content stored here (Supabase)
- **Cloudinary** - Media storage (images, files)

### Data Flow Diagram

```
Editor -> Payload Admin Panel -> PostgreSQL (Supabase)
                             \-> Cloudinary (media)

Frontend Website <- GraphQL/REST APIs <- PostgreSQL
```

### Directory Structure

```
hecta/
├── src/
│   ├── app/
│   │   ├── (frontend)/           # Public website routes
│   │   │   ├── layout.tsx        # Frontend layout wrapper
│   │   │   └── page.tsx          # Home page
│   │   └── (payload)/            # Admin panel routes (isolated)
│   │       ├── admin/            # Payload admin UI
│   │       └── api/              # GraphQL & REST endpoints
│   │
│   ├── collections/              # Content schemas
│   │   ├── Users.ts              # User auth (admin accounts)
│   │   ├── Posts.ts              # Blog posts/content
│   │   └── Media.ts              # Image uploads
│   │
│   ├── payload.config.ts         # Central configuration (MOST IMPORTANT)
│   ├── payload-types.ts          # Auto-generated TypeScript types (don't edit)
│   ├── cloudinary.ts             # Cloudinary API setup
│   └── middleware.ts             # CORS & security headers
│
├── package.json                  # Dependencies & scripts
├── next.config.mjs               # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── .env.example                  # Template environment variables
└── README.md                     # Basic setup info

```

---

## Environment Variables

### Required Variables

Create a `.env` file in the project root with these values:

```bash
# Payload CMS Secret
PAYLOAD_SECRET=your_secure_random_string

# Database Connection (Supabase PostgreSQL)
DATABASE_URI=postgresql://username:password@host:port/database_name

# Cloudinary Media Storage
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Where to Get Credentials

| Variable                | Source                   | Notes                                                                |
| ----------------------- | ------------------------ | -------------------------------------------------------------------- |
| `PAYLOAD_SECRET`        | Generate a random string | Use `openssl rand -base64 32` or similar                             |
| `DATABASE_URI`          | Supabase dashboard       | Copy from Supabase > Project > Database > Connection String (Pooler) |
| `CLOUDINARY_NAME`       | Cloudinary dashboard     | From your Cloudinary account settings                                |
| `CLOUDINARY_API_KEY`    | Cloudinary dashboard     | From API Credentials section                                         |
| `CLOUDINARY_API_SECRET` | Cloudinary dashboard     | From API Credentials section (keep secret!)                          |

⚠️ **Never commit `.env` file** - it contains secrets!

---

## Essential Commands

### Development

```bash
# Start dev server (port 3000)
pnpm dev

# Clean cache & start (use if config changes don't take effect)
pnpm devsafe

# Run linter (check for code style issues)
pnpm lint

# Fix linting issues automatically
pnpm lint --fix
```

### After Schema Changes

```bash
# Regenerate TypeScript types (run after modifying collections)
pnpm generate:types

# Update admin import map (run after adding custom admin components)
pnpm generate:importmap
```

### Production

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

---

## Key Concepts & Patterns

### 1. Collections - Content Schemas

Collections define what content can be stored. They're in `src/collections/`:

- **Users** (`Users.ts`) - Admin user accounts with authentication
- **Posts** (`Posts.ts`) - Blog posts with title, slug, content, publish date
- **Media** (`Media.ts`) - Images uploaded to Cloudinary

**To add a new field to a collection:**

1. Edit the collection file (e.g., `src/collections/Posts.ts`)
2. Add a new field object to the `fields` array
3. Run `pnpm generate:types` to update TypeScript types
4. Restart dev server (`pnpm devsafe`)

Example: Adding a "description" field to Posts:

```typescript
{
  name: 'description',
  type: 'text',
  required: false,
  maxLength: 200,
}
```

### 2. Payload Config - The Control Center

`src/payload.config.ts` is **the most important file**. It controls:

- Which collections exist and their configuration
- Database connection
- Media storage (Cloudinary)
- CORS/security settings
- Admin panel customization

⚠️ **Critical**: If you add a new domain for CORS, update **both** places:

- `payload.config.ts` → `cors` array
- `middleware.ts` → `allowed_origins` array

### 3. Route Groups & Next.js Structure

Next.js route groups (`(name)`) don't affect URLs but organize code:

- `(frontend)` - Public website routes
- `(payload)` - Admin routes

So `/admin` still works, but code is organized in `src/app/(payload)/admin/`.

### 4. Custom Cloudinary Integration

Media files don't store locally - they go straight to Cloudinary:

- Custom adapter in `payload.config.ts` handles upload/delete
- Files stored as `media/{filename}` on Cloudinary
- URLs generated with `cloudinary.url()` for secure delivery

⚠️ **If Cloudinary credentials are wrong**, media uploads will fail silently.

### 5. TypeScript Types from Payload

**Auto-generated file**: `src/payload-types.ts`

- Creates TypeScript types for all collections (Post, Media, User, etc.)
- Regenerated when you run `pnpm generate:types`
- **Must be committed** to keep types in sync across team

---

## Common Tasks

### Task: Add a New Blog Post Field

1. Open `src/collections/Posts.ts`
2. Add field to the `fields` array:
   ```typescript
   {
     name: 'author',
     type: 'text',
     required: true,
   }
   ```
3. Run `pnpm generate:types`
4. Restart dev server (`pnpm devsafe`)
5. Go to admin panel and refresh - new field appears!

### Task: Add a New Allowed Domain

1. Open `src/payload.config.ts` - find `cors` array
2. Add the domain: `'https://mysite.com'`
3. Open `middleware.ts` - find `allowed_origins` array
4. Add the same domain: `'https://mysite.com'`
5. Restart dev server

### Task: Upload Media via Admin Panel

1. Go to http://localhost:3000/admin
2. Login with your user account
3. Click "Media" in sidebar
4. Click "Upload" and select an image
5. Image uploads to Cloudinary and appears in admin

### Task: Fetch Content on Frontend

The frontend can query Payload's REST or GraphQL APIs. Example in Next.js:

```typescript
import { getPayload } from 'payload'
import config from '@/payload.config'

export default async function BlogPage() {
  const payload = await getPayload({ config })

  // Fetch all posts
  const { docs: posts } = await payload.find({
    collection: 'posts',
  })

  return (
    <div>
      {posts.map(post => (
        <h2 key={post.id}>{post.title}</h2>
      ))}
    </div>
  )
}
```

---

## Troubleshooting

### Issue: "Admin panel shows 404"

**Cause**: Types not generated after config changes.

**Fix**:

```bash
pnpm generate:types
pnpm devsafe
```

### Issue: "Media uploads fail silently"

**Cause**: Cloudinary credentials missing or incorrect.

**Fix**:

1. Check `.env` - verify `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
2. Restart dev server
3. Check browser console for errors

### Issue: "CORS errors when frontend calls API"

**Cause**: Domain not in allowed list.

**Fix**:

1. Find which domain is causing the error (check error message)
2. Add to both `payload.config.ts` (cors array) and `middleware.ts` (allowed_origins)
3. Restart dev server

### Issue: "Database connection error"

**Cause**: Wrong `DATABASE_URI` format.

**Fix**:

1. Check that `DATABASE_URI` uses `postgresql://` prefix (not `mongodb://`)
2. Verify username, password, host, port, database name
3. Test connection in database client (DBeaver, psql)

### Issue: "Config changes don't take effect"

**Cause**: Next.js cache hasn't cleared.

**Fix**:

```bash
pnpm devsafe
```

---

## Deployment

### Vercel (Current Setup)

Hecta is deployed to Vercel (see `vercel.json`).

**Deployment workflow**:

1. Push to `main` branch
2. Vercel auto-detects changes
3. Builds and deploys automatically
4. Environment variables set in Vercel dashboard (not `.env`)

**Important**: Never commit `.env` - Vercel uses its own env vars dashboard!

### Environment Variables on Vercel

Go to Vercel Dashboard > Project Settings > Environment Variables:

- Add `PAYLOAD_SECRET`
- Add `DATABASE_URI`
- Add Cloudinary credentials

---

## Code Style & Standards

### TypeScript

- **Strict mode** enabled - all code must have proper types
- Avoid `any` type - use specific types instead
- Use `@ts-expect-error` for intentional type issues (never `@ts-ignore`)

### ESLint

```bash
# Check for style issues
pnpm lint

# Auto-fix issues
pnpm lint --fix
```

### Naming Conventions

- Files: `PascalCase` for components (e.g., `UserCard.tsx`), `camelCase` for utilities
- Variables: `camelCase` (e.g., `userName`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_FILE_SIZE`)
- Unused variables: prefix with `_` (e.g., `const _unused = ...`)

---

## Learning Resources

### Payload CMS Docs

- https://payloadcms.com/docs - Official documentation
- Collections: https://payloadcms.com/docs/configuration/collections
- Fields: https://payloadcms.com/docs/fields/overview

### Next.js Docs

- https://nextjs.org/docs - Official Next.js documentation
- App Router: https://nextjs.org/docs/app

### TypeScript

- https://www.typescriptlang.org/docs/ - TypeScript handbook

---

## Getting Help

### Common Questions

**Q: Where is the production database?**
A: Supabase PostgreSQL (see `DATABASE_URI` in `.env`)

**Q: How do I back up the database?**
A: Use Supabase dashboard > Database > Backups

**Q: Can I preview changes before deploying?**
A: Run `pnpm build && pnpm start` locally to test production build

**Q: Who has access to Cloudinary/Supabase?**
A: Ask the project owner for credentials and dashboard access

---

## Next Steps

1. ✅ Complete the "Quick Start" section above
2. ✅ Understand the "Architecture Overview" section
3. ✅ Review the "Common Tasks" section
4. ✅ Try adding a new field to Posts collection
5. ✅ Explore the admin panel at http://localhost:3000/admin

**You're ready to go!** 🚀

---

**Last Updated**: November 17, 2025
**Questions?** Reach out to the previous developer or check the `/docs` folder if available.
