# GitNews Project Analysis

## 1. Project overview

The current repository is not a finished GitNews product yet. It is an existing monorepo starter template built around Convex and Next.js, with a multi-tenant dashboard, authentication, workspace management, file uploads, jobs, and billing hooks already scaffolded.

This means the codebase already has a strong application foundation, but the domain model and product features are still generic. For GitNews, the existing structure can be reused as the platform foundation rather than rebuilt from scratch.

---

## 2. Complete folder structure

```text
convex-template5-main/
├── apps/
│   ├── app/                 # Main authenticated product app
│   │   ├── src/
│   │   │   ├── app/          # Next.js App Router pages and layouts
│   │   │   ├── components/   # App-specific UI components
│   │   │   ├── lib/          # Workspace/context helpers
│   │   │   └── env.mjs       # App environment config
│   └── web/                 # Marketing/public website
│       ├── src/
│       └── env.ts
├── packages/
│   ├── analytics/           # OpenPanel analytics integration
│   ├── backend/             # Convex backend functions and schema
│   │   └── convex/          # Queries, mutations, actions, auth, schema
│   ├── email/               # Email template package
│   ├── logger/              # Shared logging package
│   └── ui/                  # Shared UI component library
├── deploy/                  # Deployment and environment scripts
├── e2e/                     # End-to-end browser tests
├── self-hosted/             # Self-hosted deployment configs
├── scripts/                 # Project helper scripts
├── tooling/                 # Shared TypeScript config
├── package.json             # Root workspace manifest
├── turbo.json               # Turborepo task config
├── project.config.ts        # Project metadata / deployment config
└── README.md                # Project overview and setup docs
```

---

## 3. Frontend framework and version

### Frontend stack
- Next.js: 14.2.7
- React: 18.3.1
- TypeScript: 5.5.4
- Tailwind CSS: 3.x
- App Router architecture
- Internationalization via next-international
- Theme support via next-themes
- UI primitives from a local shared package similar to shadcn/ui

### Frontend apps
- apps/app: authenticated product application with dashboard UI
- apps/web: public marketing/landing site

---

## 4. Backend framework

### Backend stack
- Convex 1.19.2
- TypeScript-based server functions
- Built-in database, auth, file storage, scheduling, and HTTP routes

### Backend organization
The backend lives in packages/backend/convex and is organized by domain modules:
- auth.ts: authentication providers and flows
- orgs.ts: workspace and membership management
- jobs.ts: async job lifecycle and processing
- files.ts: file storage and metadata
- users.ts: profile/account operations
- apiKeys.ts: workspace API key issuance and verification
- notifications.ts: in-app notifications
- subscriptions.ts: billing integration wrapper
- backend.ts: bridge to an external backend
- http.ts: HTTP routes and webhooks
- schema.ts: main database schema

---

## 5. Routing architecture

### Frontend routing
The main app uses Next.js App Router with locale-based routes under apps/app/src/app.

#### Main route structure
- /login: public sign-in page
- /[locale]/: dashboard home
- /[locale]/jobs: job queue UI
- /[locale]/platform: workspace, members, invites, usage, API keys
- /[locale]/files: file upload and management
- /[locale]/settings: user settings and session management
- /[locale]/settings/billing: billing-related UI
- /[locale]/onboarding: onboarding username flow

### Routing behavior
- Middleware redirects unauthenticated users to /login
- Authenticated users are routed into the dashboard shell
- Locale middleware supports English, French, and Spanish

### Marketing site routing
The marketing site in apps/web has a simpler public structure with landing pages and a contact/talk-to-us page.

---

## 6. API structure

The project uses Convex as the primary API layer rather than a traditional REST API.

### API style
- Queries: read-only data access
- Mutations: state changes
- Actions: external integrations and side effects
- HTTP routes: custom endpoints for webhooks and verification flows

### Current API domains
- users: profile, avatar, account deletion
- orgs: workspaces, members, invites, role management
- jobs: create, inspect, and complete jobs
- files: upload URL generation, file metadata, deletion
- apiKeys: create and validate workspace keys
- backend: proxy and event ingestion
- sessions: session management
- notifications: unread counts and marking notifications read
- usage: usage tracking and reporting
- audit: recent actions and activity history

### HTTP endpoints currently exposed
- /backend/webhook: receives webhook payloads from an external backend
- /api/verify-key: verifies workspace API keys

---

## 7. Database implementation

The database layer is implemented in Convex and defined in packages/backend/convex/schema.ts.

### Core tables
- users: user profile and auth metadata
- workspaces: tenant/workspace containers
- members: workspace membership and roles
- invites: pending workspace invitations
- jobs: asynchronous task records
- files: file metadata stored with Convex file storage
- apiKeys: hashed workspace API keys
- notifications: user notifications
- usage: telemetry/usage metrics
- auditLogs: admin and activity history
- events: inbound backend events
- counters: lightweight aggregate counters

### Database design characteristics
- Multi-tenant by workspaceId
- Indexed access for common lookups
- Storage-backed file handling
- Lightweight counters for dashboard stats

---

## 8. Existing reusable components

### Shared UI package
The shared library in packages/ui contains reusable UI primitives such as:
- Button
- Input
- Tooltip
- Dialog
- Select
- Switch
- Avatar
- UploadInput
- ScrollArea
- Icons

### App-specific reusable UI
The app also contains reusable higher-level components such as:
- AuthForm
- EmailOtpSignin
- SessionsCard
- ConfirmButton
- Sidebar
- Topbar
- CommandPalette

This indicates the project already has a component-driven architecture that can be extended for GitNews screens.

---

## 9. UI/template system

The UI system is built around:
- Tailwind CSS for styling
- shared component package for consistent UI primitives
- dark/light theme support
- localized copy with locale-aware server/client helpers
- a dashboard shell with sidebar, topbar, and content panels

The design is currently a generic SaaS administration/dashboard template rather than a content-oriented news experience.

---

## 10. Authentication system

Authentication is already implemented through Convex Auth.

### Supported flows
- Email/password sign-in and sign-up
- Password strength validation
- Email verification flow
- Forgot/reset password flow
- Magic email OTP sign-in
- Google OAuth (available when configured)
- Session management and sign-out of other sessions

### Authentication architecture
- Auth providers are defined in packages/backend/convex/auth.ts
- Next.js middleware protects routes and redirects unauthenticated users
- Auth state is wired into the frontend using Convex auth providers

---

## 11. Environment variables

The project expects several environment variables for runtime and integrations.

### Frontend
- NEXT_PUBLIC_CONVEX_URL
- NEXT_PUBLIC_OPENPANEL_CLIENT_ID
- NEXT_PUBLIC_SENTRY_DSN
- NEXT_PUBLIC_APP_URL
- NEXT_PUBLIC_CAL_LINK

### Backend / Convex
- CONVEX_SITE_URL
- POLAR_ORGANIZATION_TOKEN
- POLAR_WEBHOOK_SECRET
- RESEND_API_KEY
- RESEND_SENDER_EMAIL_AUTH
- AUTH_GOOGLE_ID
- AUTH_GOOGLE_SECRET
- SITE_URL

### External service integration vars
- BACKEND_BASE_URL
- BACKEND_SERVICE_KEY
- BACKEND_WEBHOOK_SECRET
- SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / SMTP_FROM
- OPENPANEL_SECRET_KEY

The README and configuration files show that the app is built to integrate with multiple services, but those integrations are only partially configured unless the environment is prepared.

---

## 12. Package dependencies

### Core dependencies
- Next.js
- React
- Convex
- Tailwind CSS
- Radix UI primitives
- next-international
- next-themes
- sonner (toasts)
- zod
- lucide-react
- @tanstack/react-form
- @convex-dev/auth
- @convex-dev/polar
- OpenPanel analytics dependency
- Sentry monitoring

### Workspace tooling
- Turborepo for monorepo orchestration
- Bun as the package manager
- Biome for formatting/linting
- TypeScript project references and shared config

---

## 13. Build process

The project uses a monorepo build pipeline:

### Root scripts
- bun dev: start all apps in parallel
- bun build: build all workspaces via Turbo
- bun typecheck: run type checks across packages
- bun lint: lint the repo

### Per-app scripts
- apps/app: Next.js dev/build/start
- apps/web: Next.js dev/build/start
- packages/backend: Convex dev/setup/seed scripts

### Current build status signals
VS Code diagnostics currently show unresolved workspace TypeScript config references and a deprecation warning around baseUrl in tsconfig. These appear to be environment/setup-related issues rather than application logic bugs.

---

## 14. Current errors/issues

### Observed issues
- TypeScript config resolution errors for shared workspace configs such as @v1/typescript/base.json and @v1/typescript/nextjs.json
- TypeScript deprecation warning for baseUrl in app and web tsconfig
- Several runtime capabilities depend on environment variables that are not yet configured
- The backend includes integration points for external services (Polar, Resend, Sentry, OpenPanel, external backend) that require service setup

### Overall assessment
The codebase is structurally healthy but not yet fully operational without environment configuration and dependency installation. It is a strong scaffold rather than a fully wired product.

---

## 15. Features already available

The current implementation already includes:
- Landing page and marketing website
- Authentication flows
- User onboarding
- Workspace creation and switching
- Multi-tenant member management
- Workspace invitations
- Dashboard overview with activity stats
- Jobs UI with queued/running/completed state
- File upload and file storage management
- API key management
- Notifications center
- Session management
- Billing integration hooks
- Audit history and usage views
- Email OTP and password reset flows
- Theme support and responsive shell

---

## 16. Features missing for GitNews

The current product is still generic. For a GitNews product, the following capabilities are missing or would need to be redefined:

### Content/domain features
- News article or story data model
- Feed generation and article listing
- Source ingestion or content import pipeline
- Topic/category/tag system
- Search and filtering across content
- Bookmark/save/read-later flows
- Personalized recommendations

### Product features
- Admin/content moderation workflow
- Publishing lifecycle for stories
- Reader-facing experience for articles
- Subscription or premium content gating
- Notification preferences for news topics
- Commenting or discussion system
- Analytics for content engagement

### Platform features
- Dedicated newsroom/workspace concepts tailored to content operations
- Content team roles beyond basic workspace membership
- Approval and publishing workflows
- Content scheduling and automation
- Integration with external news APIs or RSS feeds

---

## 17. Recommended GitNews conversion plan

### Phase 1 — Preserve the foundation
Keep the current architecture and reuse:
- auth and user management
- workspace-based multi-tenancy
- shared UI components and layout patterns
- Convex backend structure and data access model
- file storage and jobs pipeline

### Phase 2 — Replace the domain model
Introduce GitNews-specific entities such as:
- articles/stories
- sources
- categories/topics
- feeds
- bookmarks
- moderation states
- publishers/admins

### Phase 3 — Rework the product experience
Transform the current dashboard into:
- a newsroom administration experience
- a reader experience for published content
- a content pipeline dashboard

### Phase 4 — Add content operations
Add the core news workflow:
- ingestion from sources
- editorial review
- publishing
- scheduling
- notifications and alerts

### Phase 5 — Integrate product-specific services
Wire in services relevant to GitNews such as:
- RSS/API feed ingestion
- search indexing
- analytics dashboard
- newsletter or alert delivery

---

## 18. Bottom line

The repository already contains a robust foundation for a modern SaaS application:
- a monorepo with Next.js frontends
- a Convex backend with auth, storage, and workflow support
- a shared UI system
- multi-tenancy and product-ready infrastructure

For GitNews, the best path is not to build from scratch, but to repurpose this existing platform into a newsroom/content product by replacing the generic SaaS domain with GitNews-specific data models, workflows, and user experiences.
