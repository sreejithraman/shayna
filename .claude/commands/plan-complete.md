---
description: Mark an implementation phase as complete
allowed-tools: Bash, Read, Edit, Glob
argument-hint: [phase-number]
---

# Plan Complete

Mark a phase as complete after verifying acceptance criteria.

## Instructions

### If phase number provided ($1)

1. Read `.plans/0${1}-*.md` file
2. Display acceptance criteria
3. Ask user to confirm all criteria are met
4. Update front matter:
   - `status: complete`
   - `completed: [today's date in ISO format]`
5. Show what phases are now unblocked

### If no phase number

1. Find the current `in-progress` phase
2. Proceed with that phase

## Completion Checklist

Before marking complete:

1. **Review Acceptance Criteria**
   - Parse the "Acceptance Criteria" section
   - Display each criterion
   - Confirm all are satisfied

2. **Run Verification (if applicable)**
   - Build passes: `npm run build`
   - Tests pass (if any)
   - No console errors

3. **Update Documentation**
   - CLAUDE.md updated if needed
   - Code comments added where necessary

## Output Format

```
# Completing Phase 1: Threshold + Hero

## Acceptance Criteria Review

Please verify each criterion:

- [ ] Hero displays with centered name over photo
- [ ] Photo responds to cursor movement on desktop
- [ ] Photo responds to device tilt on mobile
- [ ] Scrolling triggers smooth name transition
- [ ] Name ends up fixed in nav position (top-left)
- [ ] Photo parallaxes up and fades to void
- [ ] Scroll hint visible initially, fades on scroll
- [ ] Respects prefers-reduced-motion
- [ ] No jank or layout shift during transition
- [ ] Works across Chrome, Firefox, Safari

## Quick Verification

Running build check...
✅ Build passes

## Confirm Completion

All criteria met? Marking phase as complete...

## Updated
- Status: in-progress → complete
- Completed: 2024-01-18

---

## Now Unblocked

The following phases can now be started:
- Phase 2: Navigation System (dependencies: 0 ✅, 1 ✅)
- Phase 3: Home Page Content (dependencies: 0 ✅, 1 ✅, 2 ⏳)

Run `/plan-next` for recommendation.
```

## Edge Cases

### Phase Not In Progress

```
# Cannot Complete Phase 1

Phase 1 (Threshold + Hero) is not in-progress.
Current status: draft

Start the phase first with `/plan-start 1`.
```

### Criteria Not Met

If user indicates criteria aren't met:

```
# Phase Not Ready

Some acceptance criteria are not satisfied.

Remaining work:
- [ ] Photo responds to device tilt on mobile
- [ ] Works across Chrome, Firefox, Safari

Continue working and run `/plan-complete 1` when ready.
```

### Build Fails

```
# Build Verification Failed

The build is failing with errors:

[error output]

Fix the issues and try again.
```

## Post-Completion

After marking complete:

1. Show celebration message
2. List newly unblocked phases
3. Suggest next action
4. Remind to commit changes
