---
description: Analyze if something should become a skill, command, or agent (alias for /codify)
allowed-tools: Read, Write, Glob, Grep
argument-hint: [description of the pattern/workflow]
---

# Formalize Pattern

This is an alias for `/codify`. Both commands do the same thing.

## Usage

```
/formalize "explaining TypeScript best practices repeatedly"
```

## Instructions

Run the same analysis as `/codify`:

1. Gather context about the pattern
2. Match against skill/command/agent signals
3. Recommend the appropriate abstraction type
4. Offer to create if confirmed

See `/codify` for full documentation.
