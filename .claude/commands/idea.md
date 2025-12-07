---
description: Quickly capture an idea to the backlog
allowed-tools: Read, Edit
argument-hint: [title] [description...]
---

# Capture Idea

Quickly add an idea to the backlog for future consideration.

## Usage

```
/idea Custom audio player to replace embeds
/idea "Project filtering" Add ability to filter by year or role
```

## Instructions

### Parse Arguments

- First argument (or quoted string): Title
- Remaining arguments: Description
- If no description, prompt for one

### Generate Idea Entry

1. Read `.plans/backlog.md`
2. Find the highest existing `idea-XXX` number
3. Generate next ID
4. Get today's date in ISO format
5. Append new idea entry

### Idea Template

```markdown
---

### idea-XXX: [title]
**Status:** captured
**Captured:** [today's date]
**Source:** user

[description]

**Notes:**
- (to be added during evaluation)
```

## Output

```
# Idea Captured

**ID:** idea-004
**Title:** Custom audio player

Added to `.plans/backlog.md`

Run `/idea-evaluate 004` to assess priority and effort.
```

## Quick Capture Mode

If user just types `/idea` with no arguments:

```
# Quick Idea Capture

What's the idea? (one line title)
> [wait for input]

Any additional details? (optional, press enter to skip)
> [wait for input]

Captured as idea-XXX!
```

## Tags (Optional)

If description contains hashtags, extract as tags:

```
/idea Audio player #audio #ux #feature
```

Becomes:
```yaml
tags: [audio, ux, feature]
```
