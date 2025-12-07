---
description: Copy Claude Code config (skills, commands, agents) between project and user-level
allowed-tools: Bash, Read
argument-hint: [to-user|to-project]
---

# Sync Claude Code Configuration

Copy skills, commands, and agents between project-level and user-level.

## Usage

- `/sync-config to-user` — Copy from `.claude/` to `~/.claude/`
- `/sync-config to-project` — Copy from `~/.claude/` to `.claude/`

## Direction: $ARGUMENTS

### If "to-user" (project → user-level)

Make project config available globally:

```bash
# Create directories if needed
mkdir -p ~/.claude/skills ~/.claude/commands ~/.claude/agents

# Copy skills (directories)
cp -r .claude/skills/* ~/.claude/skills/ 2>/dev/null

# Copy commands (files)
cp .claude/commands/*.md ~/.claude/commands/ 2>/dev/null

# Copy agents (files)
cp .claude/agents/*.md ~/.claude/agents/ 2>/dev/null
```

Report what was copied.

### If "to-project" (user-level → project)

Bring user config into this project:

```bash
# Create directories if needed
mkdir -p .claude/skills .claude/commands .claude/agents

# Copy skills (directories)
cp -r ~/.claude/skills/* .claude/skills/ 2>/dev/null

# Copy commands (files)
cp ~/.claude/commands/*.md .claude/commands/ 2>/dev/null

# Copy agents (files)
cp ~/.claude/agents/*.md .claude/agents/ 2>/dev/null
```

Report what was copied and remind to commit.

### If no argument

Show current state:
1. List what exists in `.claude/`
2. List what exists in `~/.claude/`
3. Show differences (what's in one but not the other)
4. Ask which direction to sync

## Notes

- Existing files will be overwritten
- Skills are directories (copy recursively)
- Commands and agents are single .md files
- After syncing to project, remind to `git add .claude/`
