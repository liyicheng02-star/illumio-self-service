# Illumio Self-Service Portal MVP

An interactive MVP for application teams to review workloads and traffic, understand Illumio rules, create connectivity requests, and manage workload enforcement changes without requiring deep Illumio expertise.

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Open the local URL printed by the development server.

## Main source files

- `app/page.tsx` — portal screens, demo data, and interactions
- `app/globals.css` — visual design and responsive styles
- `app/layout.tsx` — application shell metadata

## Available demo flows

- Role-based sign-in and application access
- Workload visibility and Enforcement Mode guidance
- Traffic Investigation with Label-based filters
- Current rules grouped by direction
- Policy Builder with validation and approval preview
- Enforcement Change workflow with approvals, change windows, release, and back out

## Validation

```bash
npm run lint
npm run build
```

This repository contains simulated data and integrations for MVP review. ServiceNow, Illumio API, UCMDB, and identity actions are not connected to production systems.
