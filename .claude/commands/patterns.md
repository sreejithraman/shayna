---
description: List all project skills, commands, and agents
allowed-tools: Glob, Read
---

# List Patterns

Display all Claude Code abstractions in this project.

## Instructions

1. Glob for all pattern files:
   - `.claude/skills/*/SKILL.md`
   - `.claude/commands/*.md`
   - `.claude/agents/*.md`

2. Parse each file's front matter for name/description

3. Display organized summary

## Output Format

```
# Project Patterns

## Skills (8)

| Name | Description |
|------|-------------|
| astro | Astro framework best practices |
| gsap | GSAP animation guidelines |
| lenis | Lenis smooth scroll patterns |
| plans | Structured planning system context |
| software-engineering | General coding principles |
| tailwind | Tailwind CSS utilities |
| typescript | TypeScript type safety |
| claude-code-patterns | Meta: abstraction decision framework |

## Commands (12)

| Command | Description |
|---------|-------------|
| /codify | Analyze if pattern should be codified (alias: /formalize) |
| /cleanup | Review for best practices violations |
| /commit | Create conventional commit |
| /idea | Capture idea to backlog |
| /idea-evaluate | Evaluate captured idea |
| /patterns | List all patterns (this command) |
| /plan-complete | Mark phase complete |
| /plan-next | Get next actionable phase |
| /plan-start | Begin work on a phase |
| /plan-status | View all phase statuses |
| /pr-prep | Prepare branch for PR |
| /project-init | Initialize CLAUDE.md |
| /review | Code review (read-only) |

## Agents (6)

| Name | Description |
|------|-------------|
| accessibility-checker | WCAG compliance audits |
| code-reviewer | Code quality and security review |
| doc-writer | Technical documentation |
| performance-analyzer | Performance bottleneck analysis |
| plan-executor | Autonomous phase implementation |
| test-writer | Test generation |

---

Use `/codify` (or `/formalize`) to analyze new patterns.
Use the `claude-code-patterns` skill for creation guidelines.
```

## Grouping

Optionally group by category:

```
## Commands by Category

### Planning
- /plan-status, /plan-next, /plan-start, /plan-complete

### Ideas
- /idea, /idea-evaluate

### Git
- /commit, /pr-prep

### Quality
- /review, /cleanup

### Meta
- /codify, /formalize, /patterns, /project-init
```
