# Illumio Self-Service Portal MVP

Interactive front-end MVP for an intent-driven Illumio self-service experience.
It is designed for application teams that do not know Illumio terminology or
how to create rulesets and change enforcement modes.

## Included flows

- Task-led application homepage
- Traffic flow map and connection table
- Traffic status filtering
- Four-step guided connectivity policy builder
- Plain-language policy preview
- Deterministic-looking impact assessment UI
- Enforcement readiness checks and acknowledgement gate
- Request tracking and audit-oriented statuses

## Important limitation

This repository is a UI prototype using in-memory sample data. It does **not**
connect to Illumio PCE, ServiceNow, an approval service, CMDB, or production
identity/RBAC. The displayed readiness and impact results are demonstration
data and must not be treated as real control decisions.

## Technology

- React 19
- TypeScript
- Vinext / Vite
- Tailwind CSS import with custom CSS components

## Run locally

Prerequisites: Node.js 22.13 or later.

```bash
npm ci
npm run dev -- --host 0.0.0.0
```

Open the local URL shown by Vite.

## Validate a production build

```bash
npm run lint
npm run build
```

## Main source files

- `app/page.tsx` — screens, sample data, and interactions
- `app/globals.css` — visual system and responsive layout
- `app/layout.tsx` — application layout and metadata

## Recommended production work

Before connecting this prototype to Illumio, add server-side RBAC, application
ownership validation, deterministic policy schema validation, PCE API adapters,
impact simulation, approval/change controls, audit logging, idempotency, and a
tested rollback workflow. LLM output must never be sent directly to Illumio PCE
without deterministic validation and authorization.

