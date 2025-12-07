---
description: Code review without making changes — read-only analysis
allowed-tools: Read, Grep, Glob, Bash
---

# Code Review (Read-Only)

Review the current changes without making any modifications.

## Scope

Review changes compared to main branch:
```bash
git diff main...HEAD
```

## Review Criteria

### 1. Correctness
- Logic errors
- Off-by-one errors
- Null/undefined handling
- Edge cases not handled
- Race conditions

### 2. Security
- SQL/NoSQL injection
- XSS vulnerabilities
- Exposed credentials or secrets
- Insecure data handling
- Missing input validation
- Authentication/authorization gaps

### 3. Performance
- N+1 queries
- Unnecessary re-renders
- Memory leaks
- Inefficient algorithms
- Missing caching opportunities
- Large bundle impacts

### 4. Accessibility
- Missing alt text
- Poor semantic HTML
- Keyboard navigation issues
- Missing ARIA attributes
- Color contrast problems

### 5. Maintainability
- Code clarity
- Naming conventions
- Function complexity
- Test coverage gaps
- Documentation needs

### 6. Best Practices
- DRY violations
- SOLID principle violations
- Framework anti-patterns
- Error handling patterns

## Output Format

For each issue:

```
### [Severity: Critical/High/Medium/Low]

**File:** path/to/file.ts:42
**Issue:** [Brief description]
**Details:** [Explanation of why it's problematic]
**Recommendation:** [How to fix]
```

## Summary

Provide:
1. Total issues by severity
2. Top 3 priority items
3. Overall assessment (approve / request changes / needs discussion)
4. Positive observations (good patterns, clean code, etc.)

## Important

- DO NOT make any changes
- DO NOT use Edit or Write tools
- Only analyze and report
