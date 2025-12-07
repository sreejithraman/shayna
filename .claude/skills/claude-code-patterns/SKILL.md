---
name: claude-code-patterns
description: Use when deciding whether to create a skill, command, or agent. Provides decision framework and templates for Claude Code abstractions.
version: "1.0.0"
---

# Claude Code Abstraction Patterns

Guide for deciding when and how to create skills, commands, and agents.

## The Three Abstractions

| Type | Purpose | Trigger | Scope |
|------|---------|---------|-------|
| **Skill** | Domain knowledge & best practices | Working in a domain | Loaded on demand |
| **Command** | Specific action or workflow | User invokes `/command` | Single task |
| **Agent** | Autonomous complex task | Delegation needed | Multi-step work |

## Decision Framework

### When to Create a SKILL

Create a skill when you have **reusable domain knowledge** that should influence how code is written.

**Signals:**
- You're explaining the same best practices repeatedly
- A technology/framework has specific patterns to follow
- There are "always do X" or "never do Y" rules
- Knowledge applies across multiple files/features

**Examples:**
- `astro` — Astro framework best practices
- `tailwind` — Tailwind CSS patterns
- `gsap` — Animation guidelines
- `plans` — Project planning context

**Template:**
```markdown
---
name: skill-name
description: When to use this skill (one line)
version: "1.0.0"
---

# Skill Name

Brief overview of what this skill covers.

## Core Principles

1. First principle
2. Second principle

## Patterns

### Pattern Name
\`\`\`code
example
\`\`\`

## Avoid

- Anti-pattern 1
- Anti-pattern 2
```

### When to Create a COMMAND

Create a command when you have a **specific workflow** that users will invoke explicitly.

**Signals:**
- User will type `/something` to trigger it
- It's a discrete action with clear start/end
- Takes optional arguments
- Repeatable process

**Examples:**
- `/commit` — Create git commit
- `/plan-status` — Show phase statuses
- `/idea` — Capture to backlog
- `/review` — Code review

**Template:**
```markdown
---
description: What this command does (one line)
allowed-tools: Tool1, Tool2
argument-hint: [arg1] [arg2]
---

# Command Name

What this command accomplishes.

## Usage

\`\`\`
/command arg1 arg2
\`\`\`

## Instructions

1. Step one
2. Step two

## Output Format

Expected output structure.
```

### When to Create an AGENT

Create an agent when you need **autonomous execution** of complex, multi-step tasks.

**Signals:**
- Task requires many tool calls
- Could run without human intervention
- Benefits from focused context
- Too complex for a command
- Delegation would be helpful

**Examples:**
- `plan-executor` — Implement entire phases
- `code-reviewer` — Comprehensive review
- `test-writer` — Generate test suites
- `doc-writer` — Create documentation

**Template:**
```markdown
---
name: agent-name
description: What this agent does (one line)
tools: Tool1, Tool2, Tool3
model: sonnet
---

# Agent Name

You are an agent that [purpose].

## Your Role

- What you do
- What you're responsible for

## Process

1. How you approach tasks
2. Steps you follow

## Guidelines

- Important rules
- Quality standards

## Output

What you return when done.
```

## Decision Tree

```
Is it reusable knowledge/best practices?
├── Yes → SKILL
└── No
    ├── Is it a user-invoked action?
    │   ├── Yes → COMMAND
    │   └── No
    │       └── Is it autonomous multi-step work?
    │           ├── Yes → AGENT
    │           └── No → Maybe not needed
```

## Combination Patterns

Often abstractions work together:

### Skill + Command
- Skill provides context
- Command triggers action that uses skill knowledge
- Example: `plans` skill + `/plan-start` command

### Command + Agent
- Command initiates
- Agent executes
- Example: `/plan-start` could invoke `plan-executor`

### Skill + Agent
- Skill loaded into agent context
- Agent applies knowledge autonomously
- Example: `code-reviewer` agent uses `software-engineering` skill

## Naming Conventions

**Skills:**
- Lowercase, hyphenated
- Technology or domain name
- Examples: `astro`, `gsap`, `software-engineering`

**Commands:**
- Lowercase, hyphenated
- Verb or action-oriented
- Examples: `/commit`, `/plan-status`, `/idea`

**Agents:**
- Lowercase, hyphenated
- Role or actor name
- Examples: `code-reviewer`, `plan-executor`, `test-writer`

## Anti-Patterns

### Over-Abstraction
Don't create abstractions for:
- One-time tasks
- Simple operations
- Things that change frequently
- Highly project-specific logic

### Under-Abstraction
Do create abstractions when:
- You've repeated something 3+ times
- Others would benefit from the pattern
- Consistency matters

### Wrong Type
- Don't use a command when you need autonomous work (use agent)
- Don't use an agent for simple actions (use command)
- Don't use a skill for workflows (use command)

## Evaluation Checklist

Before creating an abstraction, ask:

1. [ ] Is this reusable beyond this specific case?
2. [ ] Will this be used more than 2-3 times?
3. [ ] Does it reduce cognitive load?
4. [ ] Is it clear which type it should be?
5. [ ] Does a similar abstraction already exist?
6. [ ] Is it named clearly and consistently?
