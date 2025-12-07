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

## Design References

The `.plans/references/` folder contains HTML design references. **Do not copy code from these files** — use them as visual and behavioral reference only.

| File | Purpose |
|------|---------|
| `shayna-dunkelman-moodboard.html` | Visual direction: color palette, typography, motion principles, artistic references |
| `shayna-threshold-v5.html` | Threshold interaction reference: scroll phases, name animation, parallax behavior |
| `shayna-dunkelman-wireframes.html` | Page structure wireframes for Home, Work, About, and Press pages |

### Key Design Decisions from References

**Color Palette (from moodboard):**
- Void: `#0A0A0A` — primary background
- Obsidian: `#161616` — elevated surfaces
- Smoke: `#2A2A2A` — borders, dividers
- Violet: `#8B5CF6` — cool accent (Home, nav)
- Cobalt: `#3B82F6` — secondary cool accent
- Amethyst: `#A855F7` — warm accent
- Ember: `#DC2626` — warm accent (Work page)
- Bone: `#F5F5F5` — primary text

**Motion Principles:**
- **Breathing** — Autonomous, slow opacity pulse (4-6s cycles)
- **Drifting** — Gentle continuous movement, elements float
- **Reactive** — Responds to cursor/hover, subtle not performative

**Threshold Animation Phases (from threshold v5):**
- Phase 1 (0–85vh): Name centered, large, photo parallax active
- Phase 2 (85vh–140vh): Name shrinks/moves to nav position
- Phase 3 (140vh+): Name locked as nav logo, content visible

**Page Structure (from wireframes):**
- Home: Threshold → Bio → Latest → Updates → Footer
- Work: Header → Featured (expandable) → Archive divider → Archive
- About: Split hero (photo|intro) → Artist Statement → Background → Influences
- Press: Header → Grid of press cards → Press kit download

View these files in a browser to see the visual direction and interactions.
