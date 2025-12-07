---
description: Generate a render.yaml deployment blueprint for Render.com
arguments:
  - name: type
    description: Service type override (static, web, worker, cron, docker)
    required: false
---

# Render Blueprint Generator

Generate a `render.yaml` file for deploying this project to Render.com.

## Instructions

### 1. Analyze Project

Read these files to understand the project:
- `package.json` — runtime, build/start commands, framework
- `Dockerfile` (if exists) — use Docker runtime
- `astro.config.*` — static site, output to `dist/`
- `next.config.*` — Next.js app
- `vite.config.*` — Vite static site

### 2. Determine Service Configuration

| Framework | Type | Runtime | Publish Path |
|-----------|------|---------|--------------|
| Astro (static) | web | static | `./dist` |
| Astro (SSR) | web | node | — |
| Next.js | web | node | — |
| Vite | web | static | `./dist` |
| Express/Node | web | node | — |
| Dockerfile present | web | docker | — |

### 3. Generate render.yaml

Create `render.yaml` at project root with appropriate configuration.

## Blueprint Spec Reference

### Static Sites (Astro, Vite, Hugo, etc.)

```yaml
services:
  - type: web
    name: project-name
    runtime: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    pullRequestPreviewsEnabled: true
    envVars:
      - key: NODE_VERSION
        value: "20"
```

### Node.js Web Services

```yaml
services:
  - type: web
    name: project-name
    runtime: node
    plan: starter
    buildCommand: npm install && npm run build
    startCommand: npm start
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: NODE_VERSION
        value: "20"
```

### Docker Services

```yaml
services:
  - type: web
    name: project-name
    runtime: docker
    plan: starter
    dockerfilePath: ./Dockerfile
    dockerContext: .
    envVars:
      - key: PORT
        value: "3000"
```

### Background Workers

```yaml
services:
  - type: worker
    name: project-worker
    runtime: node
    buildCommand: npm install
    startCommand: npm run worker
```

### Cron Jobs

```yaml
services:
  - type: cron
    name: project-cron
    runtime: node
    buildCommand: npm install
    startCommand: npm run scheduled-task
    schedule: "0 0 * * *"  # Daily at midnight UTC
```

### With PostgreSQL Database

```yaml
databases:
  - name: project-db
    plan: starter
    previewPlan: starter

services:
  - type: web
    name: project-name
    runtime: node
    # ... other config
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: project-db
          property: connectionString
```

### With Redis (Key Value)

```yaml
services:
  - type: redis
    name: project-cache
    plan: starter
    maxmemoryPolicy: allkeys-lru

  - type: web
    name: project-name
    # ... other config
    envVars:
      - key: REDIS_URL
        fromService:
          name: project-cache
          type: redis
          property: connectionString
```

### Environment Variable Patterns

```yaml
envVars:
  # Static value
  - key: NODE_ENV
    value: production

  # Generated secret (random 256-bit base64)
  - key: SESSION_SECRET
    generateValue: true

  # From another service
  - key: API_URL
    fromService:
      name: api-service
      type: web
      property: host

  # From database
  - key: DATABASE_URL
    fromDatabase:
      name: my-db
      property: connectionString

  # Sync from dashboard (managed externally)
  - key: EXTERNAL_API_KEY
    sync: false
```

### Preview Environments

**Free tier — automatic previews:**
```yaml
services:
  - type: web
    name: project-name
    plan: free
    pullRequestPreviewsEnabled: true
    previews:
      generation: automatic  # OK for free tier
```

**Paid plans — manual previews (to control costs):**
```yaml
services:
  - type: web
    name: project-name
    plan: starter  # or standard, pro
    pullRequestPreviewsEnabled: true
    previews:
      generation: manual  # Requires manual trigger to avoid surprise costs
```

### Auto-scaling (paid plans)

```yaml
services:
  - type: web
    name: project-name
    plan: standard
    scaling:
      minInstances: 1
      maxInstances: 5
      targetMemoryPercent: 75
      targetCPUPercent: 75
```

## Security Rules

- **NEVER** hardcode secrets in render.yaml
- Use `generateValue: true` for secrets that can be random
- Use `sync: false` for secrets managed in Render dashboard
- Use `fromDatabase` / `fromService` for internal references
- Set `pullRequestPreviewsEnabled: true` for preview environments

## Available Plans

| Plan | Use Case |
|------|----------|
| free | Static sites, hobby projects |
| starter | Small production apps |
| standard | Production with auto-scaling |
| pro | High-traffic production |

## Cost Rules

- **Free tier:** Use `generation: automatic` for previews
- **Paid plans (starter/standard/pro):** Use `generation: manual` to avoid surprise costs

## Output

After analyzing the project, create `render.yaml` at the project root with:
1. Appropriate service type and runtime
2. Correct build/start commands from package.json
3. Environment variables with NODE_VERSION
4. Preview environments enabled (manual generation if paid plan)
5. Comments explaining each section
