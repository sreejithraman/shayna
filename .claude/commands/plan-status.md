---
description: View status of all implementation phases
allowed-tools: Bash, Read, Glob
---

# Plan Status

Display the current status of all implementation phases.

## Instructions

1. Read all `.plans/*.md` files (excluding README.md)
2. Parse the YAML front matter from each file
3. Display a summary table showing:
   - Phase number
   - Title
   - Status (with visual indicator)
   - Priority
   - Dependencies status

## Output Format

```
# Implementation Phases

| # | Phase              | Status      | Priority | Dependencies |
|---|--------------------| ------------|----------|--------------|
| 0 | Foundation         | ✅ complete | P0       | —            |
| 1 | Threshold + Hero   | 🔄 progress | P0       | ✅ 0         |
| 2 | Navigation         | ⏳ draft    | P1       | ⏳ 0, 1      |
| 3 | Home Content       | ⏳ draft    | P1       | ⏳ 0, 1, 2   |
...

## Summary
- Complete: 1/8
- In Progress: 1/8
- Blocked: 0/8
- Ready to Start: 1/8
```

## Status Icons

- `✅` — complete
- `🔄` — in-progress
- `🚫` — blocked
- `👀` — review
- `⏳` — draft (pending)

## Dependency Status

Show each dependency number with its completion status:
- `✅ 0` — Phase 0 is complete
- `⏳ 1` — Phase 1 is not complete

A phase is "ready to start" when:
- Status is `draft`
- All dependencies are `complete`

## Additional Info

After the table, show:
1. Summary counts
2. Next recommended action (which phase to work on)
3. Any blocked phases with their blockers
