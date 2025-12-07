# Project Plans

Structured implementation phases for the Shayna Dunkelman Portfolio.

## Front Matter Schema

Each phase file uses YAML front matter for status tracking:

```yaml
---
phase: 0                          # Numeric order (0-indexed)
title: "Phase Title"              # Human-readable name
status: draft                     # draft | in-progress | blocked | review | complete
priority: P1                      # P0 (critical) | P1 (high) | P2 (medium) | P3 (low)
effort: medium                    # small | medium | large | xlarge
dependencies: []                  # Array of phase numbers this depends on
blockers: []                      # Array of blocking issues/notes
started: null                     # ISO date when work began
completed: null                   # ISO date when finished
owner: null                       # Optional assignee
---
```

## Status Definitions

| Status | Description |
|--------|-------------|
| `draft` | Phase defined but not yet actionable |
| `in-progress` | Active development underway |
| `blocked` | Cannot proceed due to dependencies or issues |
| `review` | Implementation complete, needs verification |
| `complete` | Fully implemented and verified |

## Priority Levels

| Priority | Description |
|----------|-------------|
| `P0` | Critical path, blocks everything |
| `P1` | High priority, core functionality |
| `P2` | Medium priority, important but not blocking |
| `P3` | Low priority, nice-to-have |

## Effort Estimates

| Effort | Description |
|--------|-------------|
| `small` | < 2 hours focused work |
| `medium` | 2-8 hours focused work |
| `large` | 1-3 days focused work |
| `xlarge` | > 3 days focused work |

## Phase Files

- `00-foundation.md` — Project setup, tokens, base layout
- `01-threshold.md` — Hero section + scroll transition
- `02-navigation.md` — Nav system + name-to-logo
- `03-home-content.md` — Bio, latest, footer sections
- `04-work-page.md` — Curated projects + archive
- `05-about-page.md` — Bio + artist statement
- `06-press-page.md` — Press grid + cards
- `07-polish.md` — Performance, a11y, deployment

## Usage

Use the Claude Code commands to interact with plans:

- `/plan-status` — View status of all phases
- `/plan-next` — Get the next actionable phase
- `/plan-start [phase]` — Begin work on a phase
- `/plan-complete [phase]` — Mark a phase complete

Or use the `plans` skill for context when working on implementation.
