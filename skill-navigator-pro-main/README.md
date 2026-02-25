# Skill Navigator (Local)

This repository is configured to run locally without the Lovable service. AI calls are directed to the URL defined by the `AI_API_URL` environment variable (defaults to `http://localhost:8081/v1/chat/completions`).

Quick start:

```sh
# 1. Install dependencies
npm install

# 2. (Optional) Start a local AI service that supports the Chat Completions API and listen on http://localhost:8081
# If your local AI requires an API key, set AI_API_KEY in your environment.

# 3. Run the dev server
npm run dev
```

Environment variables used by server functions:

- `SUPABASE_URL` - your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key used by server functions
- `AI_API_URL` - (optional) overrides the AI endpoint; defaults to `http://localhost:8081/v1/chat/completions`
- `AI_API_KEY` - (optional) API key for the AI endpoint

If you want to remove local AI usage entirely, set `AI_API_URL` to an empty value or ensure no AI server is running; the application will continue to work but AI-powered enhancements will be skipped.

More detailed local development instructions

Prerequisites:

- Node.js (v18+ recommended) and npm
- (Optional) Supabase CLI if you want to run Supabase locally: https://supabase.com/docs/guides/cli

1) Install dependencies and regenerate lockfile

```bash
npm install
```

2) Set environment variables

On Windows PowerShell:

```powershell
$env:SUPABASE_URL='https://your-project.supabase.co'
$env:SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'
$env:AI_API_URL='http://localhost:8081/v1/chat/completions'
$env:AI_API_KEY='your_ai_key_optional'
npm run dev
```

On macOS / Linux (bash):

```bash
export SUPABASE_URL='https://your-project.supabase.co'
export SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'
export AI_API_URL='http://localhost:8081/v1/chat/completions'
export AI_API_KEY='your_ai_key_optional'
npm run dev
```

3) Running Supabase functions locally (optional)

If you want to run the Deno-based Supabase Edge Functions locally you can use the Supabase CLI:

```bash
supabase functions serve analyze-resume
supabase functions serve parse-resume
```

4) Notes

- If you don't have a local AI service, the code will skip AI calls when `AI_API_URL` is unset or unreachable.
- After changing `package.json` (we removed `lovable-tagger`), run `npm install` to update `package-lock.json`.
- The frontend runs on the Vite dev server (defaults to http://localhost:8080; `vite.config.ts` uses port 8080).

Troubleshooting

- If `npm run dev` fails due to missing modules, run `npm ci` or remove `node_modules` and run `npm install` again.
- For function errors, check the function logs printed by the Supabase CLI when serving functions.
