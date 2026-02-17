# Backend (MVP AI scaffold)

This folder contains a minimal Express backend scaffold used by the frontend for the disease-detection MVP.

- POST /api/ai/disease-detection — accepts optional multipart field `image`, returns `{ jobId }`.
- GET  /api/ai/jobs/:id — returns job status and result.

Storage: local filesystem (`uploads/crops`) in dev (set STORAGE env var for other adapters).
AI provider: if `AI_PROVIDER_URL` + `AI_PROVIDER_API_KEY` are set, the worker will attempt a provider call and fall back to a local mock result.

Run locally:
  pnpm install
  pnpm dev

Env example: see `.env.example`.
