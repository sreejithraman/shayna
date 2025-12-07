---
description: Get the next actionable implementation phase
allowed-tools: Bash, Read, Glob
---

# Plan Next

Identify and display the next phase that should be worked on.

## Instructions

1. Read all `.plans/*.md` files
2. Parse YAML front matter
3. Find the next actionable phase based on:
   - Status is `draft` (not started)
   - All dependencies are `complete`
   - Highest priority (P0 > P1 > P2 > P3)
   - Lowest phase number (tie-breaker)

4. Display detailed info about that phase

## Output Format

```
# Next Phase: 01 — Threshold + Hero

**Status:** draft → ready to start
**Priority:** P0 (critical)
**Effort:** large
**Dependencies:** ✅ All satisfied (Phase 0 complete)

## Overview

The signature homepage interaction — name transitions from hero to navigation on scroll.

## Key Objectives

1. Create hero section with centered name
2. Implement photo layer with parallax
3. Build three-phase scroll transition
4. Add cursor/gyroscope interaction
5. Integrate GSAP ScrollTrigger with Lenis

## Content Needed

- [ ] Hero photo (high-res, minimum 1200px height)

## To Start

Run `/plan-start 1` to mark this phase as in-progress and begin work.
```

## Edge Cases

### If a phase is already in-progress

```
# Current Phase: 01 — Threshold + Hero

**Status:** 🔄 in-progress (started 2024-01-10)

[Show same detail as above]

## Note

You already have a phase in progress. Complete it before starting a new one,
or run `/plan-status` to see all phases.
```

### If all phases are complete

```
# All Phases Complete! 🎉

All 8 implementation phases have been completed.

Run `/plan-status` to review the full timeline.
```

### If next phase is blocked

```
# Next Phase Blocked

Phase 4 (Work Page) is ready but blocked:
- "Waiting for project content from Shayna"

Consider:
1. Resolve the blocker
2. Work on a different unblocked phase
3. Run `/plan-status` to see options
```

## Priority Order

When multiple phases are ready, prioritize:
1. P0 phases (critical path)
2. P1 phases (high priority)
3. P2 phases (medium)
4. P3 phases (nice-to-have)

Within same priority, prefer lower phase numbers.
