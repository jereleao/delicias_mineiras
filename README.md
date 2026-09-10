# Delícias Mineiras

Delícias Mineiras is a multilingual product catalog for a food business. The public home page displays promotional banners and products grouped by category. Authenticated administrators can manage products, categories, banners, and users.

## Features

- Product catalog with category sections, images, descriptions, prices, and keywords
- Promotional banner management
- Administration dashboard with protected routes and permission guards
- Email and Google authentication, plus WebAuthn/passkey support
- English and Portuguese translations through `next-intl`
- Light, dark, and system theme support
- PostgreSQL persistence with Drizzle ORM and migrations
- Vercel Blob storage for uploaded media
- Sentry instrumentation for production monitoring

## Stack

- [Next.js](https://nextjs.org/) 15 with the App Router
- [React](https://react.dev/) 19 and TypeScript
- [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL
- [tRPC](https://trpc.io/) for typed application APIs
- [Auth.js](https://authjs.dev/) for authentication
- [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/)
- [next-intl](https://next-intl.dev/) for localization

## Requirements

- Node.js 20 or newer
- [pnpm](https://pnpm.io/) 11
- PostgreSQL 14 or newer, or Docker Desktop/Podman for a local database

## Getting started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create a `.env` file in the project root. The application validates these variables at startup:

   ```dotenv
   APPLICATION_NAME="Delícias Mineiras"
   DEFAULT_LANGUAGE="en"
   DEFAULT_THEME="system"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"

   POSTGRES_URL="postgres://postgres:password@localhost:5432/delicias_mineiras"

   AUTH_SECRET="replace-with-a-long-random-string"
   WEB_AUTHN_CHALLENGE="replace-with-a-random-challenge"
   AUTH_GOOGLE_ID="your-google-client-id"
   AUTH_GOOGLE_SECRET="your-google-client-secret"

   EMAIL_SERVER_HOST="smtp.example.com"
   EMAIL_SERVER_PORT="587"
   EMAIL_SERVER_USER="your-smtp-user"
   EMAIL_SERVER_PASSWORD="your-smtp-password"
   EMAIL_FROM="no-reply@example.com"

   BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
   ```

   `AUTH_GOOGLE_*`, email, and Blob credentials must point to working services when those features are used. `AUTH_SECRET` is required in production. Optional monitoring variables are `NEXT_PUBLIC_SENTRY_DSN` and `SENTRY_AUTH_TOKEN`.

3. Start a local PostgreSQL container. On Linux and macOS:

   ```bash
   ./start-database.sh
   ```

   On Windows, run the script from WSL with Docker Desktop or Podman Desktop running:

   ```bash
   wsl
   ./start-database.sh
   ```

4. Apply the database schema:

   ```bash
   pnpm db:migrate
   ```

5. Start the development server:

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Database commands

```bash
pnpm db:generate  # Generate a migration from schema changes
pnpm db:migrate   # Apply committed migrations
pnpm db:push      # Push the schema directly during development
pnpm db:studio    # Open Drizzle Studio
```

Use `db:push` for quick local iteration and `db:generate` plus `db:migrate` for changes that should be committed.

## Development commands

```bash
pnpm dev          # Start Next.js with Turbopack
pnpm build        # Create a production build
pnpm start        # Serve the production build
pnpm lint         # Run ESLint
pnpm typecheck    # Run TypeScript checks
pnpm check        # Run lint and TypeScript checks
pnpm format:check # Check Prettier formatting
pnpm intl:check   # Validate translation keys
```

## Project layout

```text
src/app/                  Next.js routes, layouts, and API handlers
src/app/(modules)/        Public catalog and administrative modules
src/components/           Shared UI and form components
src/libs/api/             tRPC routers and server API logic
src/libs/auth/            Auth.js and WebAuthn configuration
src/libs/db/              Drizzle schema, relations, and database client
messages/                 English and Portuguese translations
drizzle/                  Generated SQL migrations and snapshots
public/assets/            Static application assets
```

## Deployment

Build the application with `pnpm build` and run it with `pnpm start`, or deploy it to a Next.js-compatible platform such as Vercel. Configure all required environment variables in the deployment environment, use a managed PostgreSQL database, and set `NEXT_PUBLIC_BASE_URL` to the public application URL so authentication and passkeys validate the correct origin.
