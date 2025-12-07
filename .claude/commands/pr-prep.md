---
description: Prepare branch for pull request — cleanup, review, and verification
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
argument-hint: [base-branch]
---

# Pull Request Preparation

Prepare this branch for a pull request against `$ARGUMENTS` (defaults to `main` if not specified).

## Step 1: Cleanup

Run the cleanup process:
- Remove dead code and debug statements
- Fix DRY violations
- Address TODO comments if quick
- Apply stack-specific best practices

## Step 2: Code Review

Review all changes (git diff against base branch):
- Logic errors or bugs
- Security vulnerabilities
- Performance issues
- Accessibility concerns
- Missing error handling

Flag any issues that need attention.

## Step 3: Build Verification

```bash
npm run build  # or appropriate build command
```

Fix any build errors or type errors.

## Step 4: Lint Check

If linter is configured:
```bash
npm run lint  # or appropriate lint command
```

Fix any linting errors.

## Step 5: Test Check

If tests exist:
```bash
npm run test  # or appropriate test command
```

Ensure tests pass.

## Step 6: Git Status

Show current state:
- Files changed
- Commits ahead of base branch
- Any uncommitted changes

## Step 7: PR Summary

Generate:

### PR Title
Concise, imperative mood (e.g., "Add user authentication flow")

### PR Description
```markdown
## Summary
[2-3 sentences describing the change]

## Changes
- [Bullet list of key changes]

## Testing
- [ ] Build passes
- [ ] Lint passes
- [ ] Tests pass
- [Any manual testing done]

## Notes
[Any reviewer context needed]
```

## Final Output

Provide:
1. Summary of cleanup changes made
2. Any issues found during review
3. Build/lint/test status
4. Draft PR title and description
5. Recommendation: Ready to PR or needs more work
