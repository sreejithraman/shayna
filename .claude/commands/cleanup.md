---
description: Review branch for best practices violations and clean up code
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

# Code Cleanup

Review the current branch for code quality issues and fix them directly.

## 1. Code Quality Checks

### Dead Code
- Unused imports
- Unused variables and functions
- Commented-out code blocks
- Unreachable code

### Debug Artifacts
- `console.log` statements
- `debugger` statements
- TODO/FIXME comments that should be addressed

### Software Engineering Violations
- DRY violations (duplicated code blocks)
- Functions that are too long (> 50 lines)
- Deep nesting (> 3 levels)
- Magic numbers without constants

## 2. Stack-Specific Checks

### If Astro Project
- Unnecessary `client:load` on static content
- Missing image optimization
- Improper hydration directives

### If Tailwind Project
- Repeated class patterns not extracted
- Inline styles that should use utilities
- Dynamic class construction that won't purge

### If GSAP Project
- Missing cleanup/kill calls
- Animating pinned elements directly
- Markers left in production code

### If Lenis Project
- Missing required CSS
- Improper GSAP ticker integration

## 3. Actions

For each issue found:
1. Fix it directly (don't just report)
2. Keep a log of changes made

## 4. Verification

After cleanup:
1. Run build: `npm run build` (or appropriate command)
2. Fix any build errors
3. Run linter if configured

## 5. Summary

Provide a summary of:
- Number of issues found and fixed
- Categories of issues (dead code, DRY, etc.)
- Any issues that couldn't be auto-fixed
- Build/lint status after cleanup
