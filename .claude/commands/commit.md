---
description: Create a well-formatted git commit with conventional commit message
allowed-tools: Bash
argument-hint: [type] [scope] [description]
---

# Create Git Commit

Create a commit following conventional commit format.

## If Arguments Provided

Use the provided arguments:
- `$1` = type (feat, fix, docs, style, refactor, test, chore)
- `$2` = scope (optional component/area)
- `$3+` = description

Example: `/commit feat auth add login form validation`
→ `feat(auth): add login form validation`

## If No Arguments

1. Check `git status` for changes
2. Check `git diff --staged` for what's being committed
3. Analyze the changes and determine:
   - **Type**: What kind of change is this?
     - `feat`: New feature
     - `fix`: Bug fix
     - `docs`: Documentation only
     - `style`: Formatting, no code change
     - `refactor`: Code change that neither fixes bug nor adds feature
     - `test`: Adding or updating tests
     - `chore`: Maintenance, dependencies, config
   - **Scope**: What area is affected? (optional)
   - **Description**: What does this change do? (imperative mood)

4. Generate commit message in format:
   ```
   type(scope): description

   [optional body with more details]
   ```

## Commit Guidelines

- **Imperative mood**: "add feature" not "added feature"
- **Lowercase**: Don't capitalize first letter
- **No period**: Don't end with a period
- **50 char limit**: Keep subject line under 50 characters
- **Body**: Use for complex changes that need explanation

## Examples

```
feat(auth): add password reset flow

fix(api): handle null response from user endpoint

refactor(components): extract button into shared component

docs: update README with setup instructions

chore(deps): upgrade astro to 4.0
```

## Execute

1. Stage changes if not already staged: `git add -A` (or selective)
2. Create commit with generated message
3. Show the commit result

## Important

- Review staged changes before committing
- Don't commit sensitive files (.env, credentials)
- Ensure build passes before committing (warn if not checked)
