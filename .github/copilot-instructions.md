# Hecta CMS - AI Coding Agent Instructions

## Architecture Overview

**Hecta** is a Payload CMS 3.0 + Next.js 15 full-stack application with a PostgreSQL database and Cloudinary media storage. The architecture separates concerns into two main zones:

- **Admin Panel** (`/admin/*`): Payload CMS admin interface for content management
- **Frontend** (`/(frontend)/*`): Public-facing website with dynamic content from Payload

### Data Flow

1. Content managed in Payload collections (Users, Posts, Media)
2. PostgreSQL stores all data via `@payloadcms/db-postgres`
3. Media uploaded to Cloudinary via custom adapter in `src/payload.config.ts`
4. Frontend fetches content via Payload's built-in GraphQL/REST APIs

### Key Integration Points

- **Middleware** (`middleware.ts`): CORS handling for specific allowed origins (hectaconsulting.com, localhost)
- **Payload Config** (`src/payload.config.ts`): Central hub for collections, database, storage, and plugins
- **Collections** (`src/collections/`): Define content schemas (Users with auth, Posts with richText, Media with Cloudinary)

## Tech Stack & Conventions

### Framework & Language

- **Runtime**: Next.js 15 with React 19 (edge-ready)
- **Language**: TypeScript 5.7.3 (strict mode enabled)
- **Node**: >=18.20.2 || >=20.9.0
- **Package Manager**: pnpm (with hoisted dependencies)

### Payload CMS Patterns

- Collections are defined as `CollectionConfig` objects in `src/collections/*.ts`
- `slug` property is the unique identifier for REST/GraphQL endpoints
- Fields use Payload's type system (text, richText, date, etc.)
- Authentication enabled on Users collection via `auth: true`
- Media collection uses Cloudinary adapter (custom `handleUpload`/`handleDelete`)

### Next.js App Router Structure

```
src/app/
├── (frontend)/        # Public site - auto-wrapped layout
│   ├── layout.tsx    # Root frontend layout
│   └── page.tsx      # Home page (fetches from Payload)
└── (payload)/        # Admin panel - isolated route group
    ├── admin/        # Payload admin UI entry point
    └── api/          # API routes
```

**Route Groups** (`(name)`) enable multiple layouts without affecting URL structure.

## Development Workflows

### Local Development

```bash
pnpm install                    # Install dependencies
pnpm dev                        # Start dev server (port 3000)
pnpm devsafe                    # Clean .next/ cache first (use if config changes fail)
pnpm generate:types            # Regenerate src/payload-types.ts after schema changes
pnpm generate:importmap        # Update admin import map after adding custom admin components
```

### Using Docker

```bash
docker-compose up              # Runs Node + MongoDB (check .env DATABASE_URI)
```

**Note**: Config uses PostgreSQL by default; docker-compose.yml has MongoDB commented setup.

### Build & Deployment

```bash
pnpm build                     # Production build (next build)
pnpm start                     # Start production server
pnpm lint                      # ESLint (enforced on CI)
```

### Environment Setup

Critical `.env` variables (copy from `.env.example`):

- `PAYLOAD_SECRET`: Payload encryption key
- `DATABASE_URI`: PostgreSQL connection string (e.g., `postgresql://user:pass@host/db`)
- `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Media uploads
- `MONGODB_URI`: Optional, if using MongoDB instead of PostgreSQL

## Project-Specific Patterns

### 1. Custom Storage Adapter Pattern

Cloudinary integration in `src/payload.config.ts` shows custom plugin pattern:

- `cloudinaryAdapter()` implements `HandleUpload` and `HandleDelete` interfaces
- File paths stored as `media/{filename}` on Cloudinary
- Public URLs generated via `cloudinary.url()` with `secure: true`
- Media collection disables local storage via `disableLocalStorage: true`

### 2. CORS & Security Headers

Hardcoded in two places (keep synchronized):

- `payload.config.ts`: `cors` and `csrf` arrays
- `middleware.ts`: `allowed_origins` array
- Always update both when adding new domains

### 3. Payload Type Generation

After modifying any collection schema:

```bash
pnpm generate:types
```

This regenerates `src/payload-types.ts` - **commit this file** so TypeScript types stay in sync.

### 4. Admin Import Map

If adding custom admin UI components:

```bash
pnpm generate:importmap
```

Updates `src/app/(payload)/admin/importMap.js` to expose components to Payload admin.

## Code Style & Rules

### TypeScript & ESLint

- **Strict mode** enabled; handle `any` types carefully
- ESLint allows unused vars starting with `_` (e.g., `const _unused = ...`)
- Next.js core-web-vitals rules enforced
- Suppress TS comments with `@ts-expect-error` (preferred over `@ts-ignore`)

### File Organization

- Collections: `src/collections/*.ts` (one export per file)
- App routes: Use file-based routing with `route.ts` for API endpoints
- Styling: CSS modules + `custom.scss` in payload admin
- Imports: Use `@/*` alias for `src/*` (configured in `tsconfig.json`)

## Common Pitfalls & Solutions

| Issue                      | Root Cause                     | Fix                                                 |
| -------------------------- | ------------------------------ | --------------------------------------------------- |
| Admin panel shows 404      | Missing type generation        | Run `pnpm generate:types`                           |
| Media uploads fail         | Cloudinary credentials missing | Check `.env` for API keys                           |
| CORS errors on frontend    | Domain not in allowed list     | Add to both `payload.config.ts` and `middleware.ts` |
| Config changes don't apply | Stale `.next/` cache           | Run `pnpm devsafe`                                  |
| Database connection error  | Wrong `DATABASE_URI` format    | Verify `postgresql://` vs `mongodb://`              |

## Git & Deployment

- **Main branch**: Production-ready (deployed via Vercel)
- **Vercel config**: `vercel.json` present (check deployment overrides there)
- **Commit generated files**: `payload-types.ts`, `.next/` should NOT be committed (in .gitignore)
- **Environment**: Use Vercel environment variables dashboard, not `.env` in repo

---

**Last Updated**: November 17, 2025
