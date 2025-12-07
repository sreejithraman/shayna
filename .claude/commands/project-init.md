---
description: Detect project stack and create/update CLAUDE.md with appropriate context
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

# Project Initialization

Analyze this project and create or update the project's CLAUDE.md file.

## Step 1: Detect Stack

Check for these files and identify the stack:

### Package Managers & Runtimes
- `package.json` → Node.js project (check dependencies)
- `pyproject.toml` / `requirements.txt` → Python
- `Cargo.toml` → Rust
- `go.mod` → Go
- `Gemfile` → Ruby

### Frameworks (check package.json dependencies)
- `astro` → Astro
- `next` → Next.js
- `react` → React
- `vue` → Vue
- `svelte` → Svelte
- `tailwindcss` → Tailwind CSS
- `gsap` → GSAP animations
- `lenis` / `@studio-freight/lenis` → Lenis smooth scroll

### Configuration Files
- `astro.config.mjs` → Astro
- `next.config.js` → Next.js
- `tailwind.config.js` → Tailwind
- `tsconfig.json` → TypeScript
- `.eslintrc*` → ESLint
- `.prettierrc*` → Prettier

## Step 2: Gather Context

- Read `README.md` if exists
- Check for existing documentation
- Identify build/dev/test commands from package.json scripts
- Note any existing CLAUDE.md content to preserve

## Step 3: Create/Update CLAUDE.md

Create `CLAUDE.md` in the project root with:

```markdown
# [Project Name]

## Overview
[Brief description from README or package.json]

## Stack
- [Framework] (version)
- [Styling solution]
- [Other key dependencies]

## Commands
- `npm install` — Install dependencies
- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run test` — Run tests (if applicable)

## Skills

Invoke these skills when entering their domains:

| Context | Skill |
|---------|-------|
| [Language] code | `[language]` |
| [Framework] files | `[framework]` |
| [Styling] classes | `[styling]` |
| All code changes | `software-engineering` |

Only include skills that exist in `.claude/skills/` and are relevant to this project.

## Project Structure
[Key directories and their purpose]

## Key Files
[Important configuration or entry points]

## Do Not
- [Any project-specific warnings]
```

## Step 4: Report

Summarize:
- Detected stack
- Skills added to the table (check `.claude/skills/` for available skills)
- CLAUDE.md location and contents
- Any manual configuration needed
