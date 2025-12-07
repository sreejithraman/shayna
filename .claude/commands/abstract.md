---
description: Analyze if something should become a skill, command, or agent
allowed-tools: Read, Write, Glob, Grep
argument-hint: [description of the pattern/workflow]
---

# Analyze Abstraction

Evaluate whether a pattern, workflow, or behavior should be abstracted into a skill, command, or agent.

## Usage

```
/abstract "explaining TypeScript best practices repeatedly"
/abstract "running build, test, then commit workflow"
/abstract "reviewing PRs for security issues"
```

## Instructions

### 1. Gather Context

Ask clarifying questions if needed:
- How often does this happen?
- Who/what triggers it?
- How many steps are involved?
- Is it project-specific or universal?

### 2. Pattern Recognition

Analyze against these signals:

**Skill Signals:**
- [ ] Reusable knowledge/best practices
- [ ] "Always do X" or "never do Y" rules
- [ ] Technology or domain-specific
- [ ] Applies across multiple features
- [ ] Influences HOW code is written

**Command Signals:**
- [ ] User-invoked action
- [ ] Discrete workflow with clear end
- [ ] Takes arguments
- [ ] Repeatable process
- [ ] Consistent steps each time

**Agent Signals:**
- [ ] Multi-step autonomous work
- [ ] Could run without intervention
- [ ] Complex decision-making
- [ ] Benefits from focused context
- [ ] Delegation is valuable

### 3. Recommendation

Score each type and recommend:

```
# Abstraction Analysis

## Input
"[user's description]"

## Pattern Analysis

| Signal | Skill | Command | Agent |
|--------|-------|---------|-------|
| Reusable knowledge | ✅ | — | — |
| User-invoked | — | ✅ | — |
| Multi-step autonomous | — | — | ✅ |
| ... | ... | ... | ... |

## Scores

- Skill: 3/5 signals
- Command: 1/5 signals
- Agent: 2/5 signals

## Recommendation: SKILL

**Reasoning:**
This is primarily about sharing best practices that should
influence code writing. It's not a discrete action (command)
and doesn't require autonomous execution (agent).

## Suggested Implementation

**Name:** `typescript-patterns`
**Location:** `.claude/skills/typescript-patterns/SKILL.md`

**Outline:**
1. Core type safety principles
2. Common patterns (generics, utilities)
3. Anti-patterns to avoid
4. Project-specific conventions

## Draft Structure

\`\`\`markdown
---
name: typescript-patterns
description: ...
---

# TypeScript Patterns

...
\`\`\`

---

Create this skill? [y/n]
```

### 4. If Confirmed, Create

- Generate the abstraction file
- Use appropriate template
- Add to correct location
- Update any indexes

## Edge Cases

### Multiple Types Needed

Sometimes a pattern needs multiple abstractions:

```
## Recommendation: SKILL + COMMAND

Create a skill for the knowledge and a command to apply it.

- Skill: `security` — Security best practices
- Command: `/security-check` — Run security analysis
```

### Existing Abstraction

Check if something similar exists:

```
## Existing Abstraction Found

`.claude/skills/typescript/SKILL.md` already covers similar ground.

Options:
1. Extend existing skill
2. Create specialized sub-skill
3. No action needed
```

### Not Worth Abstracting

```
## Recommendation: None

This pattern is:
- Too project-specific
- Only used once
- Too simple to warrant abstraction

Just document it in CLAUDE.md or inline comments.
```

## Quick Reference

| If you find yourself... | Create a... |
|------------------------|-------------|
| Explaining same rules repeatedly | Skill |
| Doing same multi-step workflow | Command |
| Wishing you could delegate complex work | Agent |
| Wanting to enforce patterns | Skill |
| Needing a shortcut for an action | Command |
| Doing thorough autonomous analysis | Agent |
