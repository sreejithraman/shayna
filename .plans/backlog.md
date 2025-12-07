# Ideas Backlog

Captured ideas for future consideration. Ideas can be promoted to phases or converted to quick tasks.

## Idea Schema

```yaml
---
id: idea-001
title: "Short title"
status: captured         # captured | evaluating | promoted | declined | completed
priority: null           # null until evaluated, then P0-P3
effort: null             # null until evaluated
source: user             # user | review | research | feedback
captured: 2024-01-15
promoted_to: null        # Phase number or task reference if promoted
tags: []
---

Description of the idea...
```

## Status Flow

```
captured → evaluating → promoted (becomes phase/task)
                     → declined (with reason)
                     → completed (quick win, done immediately)
```

## Current Ideas

<!-- Ideas are appended below this line -->

---

### idea-001: Dark mode toggle
**Status:** captured
**Captured:** 2024-01-15
**Source:** user

Add a dark/light mode toggle. Currently the site is dark-only, but some users may prefer light mode.

**Notes:**
- Would require significant CSS work
- Consider `prefers-color-scheme` first
- Low priority given brand aesthetic

---

### idea-002: Audio player component
**Status:** captured
**Captured:** 2024-01-15
**Source:** research

Custom audio player that matches the site aesthetic instead of embedded players.

**Notes:**
- Would replace Bandcamp/SoundCloud embeds
- Could include waveform visualization (carefully, per brand guidelines)
- Medium effort, high impact for music portfolio

---

### idea-003: Project filtering
**Status:** captured
**Captured:** 2024-01-15
**Source:** user

Add ability to filter projects by year, role, or type on the Work page.

**Notes:**
- Useful once archive grows larger
- Could be simple tag-based filtering
- Low priority initially

---

## Evaluation Criteria

When evaluating an idea, consider:

1. **Alignment** — Does it fit the brand and user needs?
2. **Impact** — How much value does it add?
3. **Effort** — How complex is implementation?
4. **Dependencies** — What must exist first?
5. **Urgency** — Is there a deadline or trigger?

## Promoting Ideas

To promote an idea to a phase:

1. Create new phase file in `.plans/`
2. Update idea status to `promoted`
3. Set `promoted_to: [phase number]`
4. Link back from phase to original idea

For quick wins (small, immediate):
1. Just do it
2. Update status to `completed`
3. Note what was done
