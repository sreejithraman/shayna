---
description: Evaluate a captured idea for priority and promotion
allowed-tools: Read, Edit
argument-hint: [idea-number]
---

# Evaluate Idea

Assess a captured idea and decide its fate.

## Instructions

1. Read `.plans/backlog.md`
2. Find the specified idea by ID
3. Walk through evaluation criteria
4. Update the idea with assessment
5. Recommend action (promote, decline, or quick-win)

## Evaluation Framework

### 1. Alignment Check

Does this idea:
- [ ] Fit the brand aesthetic?
- [ ] Serve the target audience (industry contacts, fans)?
- [ ] Support the site's core purpose?

**Score:** High / Medium / Low / Misaligned

### 2. Impact Assessment

What value does it add?
- [ ] Improves user experience significantly
- [ ] Adds important functionality
- [ ] Nice-to-have enhancement
- [ ] Minimal impact

**Score:** High / Medium / Low

### 3. Effort Estimation

How complex is implementation?
- [ ] Quick win (< 2 hours)
- [ ] Small (< 1 day)
- [ ] Medium (1-3 days)
- [ ] Large (> 3 days)
- [ ] Requires research/unknowns

**Effort:** small / medium / large / xlarge

### 4. Dependencies

What must exist first?
- List any phase dependencies
- Note content requirements
- Identify technical prerequisites

### 5. Priority Matrix

| | High Impact | Low Impact |
|---|------------|-----------|
| **Low Effort** | Do Now (P1) | Maybe (P3) |
| **High Effort** | Plan (P2) | Skip |

## Output Format

```
# Evaluating idea-003: Project filtering

## Assessment

| Criterion | Score | Notes |
|-----------|-------|-------|
| Alignment | High | Fits portfolio purpose |
| Impact | Medium | Useful as archive grows |
| Effort | Small | Tag-based filtering is simple |
| Dependencies | Phase 4 | Work page must exist |

## Priority: P3 (nice-to-have)

## Recommendation: Defer

This is a good idea but low priority. Archive is small initially.
Revisit when >20 projects exist.

## Updated Status

idea-003: captured → evaluating
Priority: P3
Effort: small

---

Promote to phase? [y/n]
```

## Actions

### Promote
- Create new phase file or add to existing
- Update idea status to `promoted`
- Set `promoted_to` reference

### Decline
- Update status to `declined`
- Add reason in notes

### Quick Win
- If effort is "quick" and impact is positive
- Suggest implementing immediately
- Mark as `completed` when done

### Defer
- Keep status as `evaluating`
- Add reassessment trigger (e.g., "when archive > 20 items")
