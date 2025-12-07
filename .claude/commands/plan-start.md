---
description: Begin work on an implementation phase
allowed-tools: Bash, Read, Edit, Glob
argument-hint: [phase-number]
---

# Plan Start

Mark a phase as in-progress and prepare to begin work.

## Instructions

### If phase number provided ($1)

1. Read `.plans/0${1}-*.md` file
2. Verify dependencies are complete
3. Update front matter:
   - `status: in-progress`
   - `started: [today's date in ISO format]`
4. Display phase overview and first tasks

### If no phase number

1. Run the logic from `/plan-next` to find the recommended phase
2. Confirm with user before proceeding
3. Then follow steps above

## Pre-Start Checklist

Before marking in-progress, verify:

1. **Dependencies Complete**
   - Read each dependency phase file
   - Confirm `status: complete`
   - If not, warn and suggest completing dependencies first

2. **No Other Phase In-Progress**
   - Check all phase files for `status: in-progress`
   - If found, warn user and ask to complete or pause

3. **Content Requirements**
   - Check "Content Needed" section
   - Warn if critical content is missing

## Output Format

```
# Starting Phase 1: Threshold + Hero

## Pre-Start Check
- ✅ Dependencies: Phase 0 complete
- ✅ No other phase in progress
- ⚠️ Content: Hero photo not yet provided (can stub)

## Updated
- Status: draft → in-progress
- Started: 2024-01-15

---

## Phase Overview

The signature homepage interaction — name transitions from hero to navigation on scroll.

## First Tasks

1. Create `src/components/Threshold.astro`
2. Set up GSAP + ScrollTrigger integration with Lenis
3. Implement Phase 1 scroll behavior (0-85vh)

## Get Started

Read the full phase plan:
\`\`\`
cat .plans/01-threshold.md
\`\`\`

Good luck! Run `/plan-complete 1` when finished.
```

## Error Handling

### Dependency Not Met

```
# Cannot Start Phase 2

Phase 2 (Navigation) depends on:
- ⏳ Phase 0 (Foundation) — draft
- ⏳ Phase 1 (Threshold) — draft

Complete dependencies first, or run `/plan-next` for recommendations.
```

### Already In Progress

```
# Phase Already In Progress

Phase 1 (Threshold + Hero) is already in-progress.
Started: 2024-01-10

Options:
1. Continue working on Phase 1
2. Run `/plan-complete 1` if finished
3. Manually reset status if needed
```

### Invalid Phase Number

```
# Invalid Phase

No phase found with number: 9

Available phases: 0-7
Run `/plan-status` to see all phases.
```
