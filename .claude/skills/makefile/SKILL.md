---
name: makefile
description: Use when generating or editing Makefiles. Applies composable "Lego piece" target patterns, automatic variables, and dependency best practices.
version: "1.0.0"
---

# Makefile Best Practices

Apply when creating or editing Makefiles. Focus on composable, atomic targets that chain via dependencies.

**Documentation:** https://www.gnu.org/software/make/manual/make.html

## Core Philosophy: Lego Pieces

Each target is a single, reusable piece. Composition happens through dependencies, not scripts.

```makefile
# GOOD: Atomic targets, Make handles ordering
deps:           ## Install dependencies
	npm install

build: deps     ## Build (auto-runs deps)
	npm run build

test: deps      ## Test (auto-runs deps)
	npm test

deploy: build test  ## Deploy (auto-runs build, test, deps)
	./deploy.sh

# User runs: make deploy
# Make runs: deps → build → test → deploy
```

```makefile
# BAD: Monolithic target that does everything
deploy:
	npm install
	npm run build
	npm test
	./deploy.sh
```

## Required Structure

Every Makefile MUST have this structure:

```makefile
# ============================================
# Project Makefile
# ============================================

.PHONY: all help deps build test lint format clean dev ci deploy

.DEFAULT_GOAL := help

# --------------------------------------------
# Variables
# --------------------------------------------
SHELL := /bin/bash
.SHELLFLAGS := -eu -o pipefail -c

# Project-specific variables
NODE_BIN := ./node_modules/.bin
SRC_DIR := src
BUILD_DIR := dist

# --------------------------------------------
# Help (self-documenting)
# --------------------------------------------
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

# --------------------------------------------
# Core Targets (Lego Pieces)
# --------------------------------------------
deps: node_modules ## Install dependencies

node_modules: package.json package-lock.json
	npm ci
	@touch node_modules

build: deps ## Build project
	npm run build

test: deps ## Run tests
	npm test

lint: deps ## Lint code
	npm run lint

format: deps ## Format code
	npm run format

clean: ## Clean build artifacts
	rm -rf $(BUILD_DIR) node_modules

# --------------------------------------------
# Composite Targets
# --------------------------------------------
dev: deps ## Start dev server
	npm run dev

check: lint test ## Run all checks

ci: deps lint test build ## Full CI pipeline

deploy: ci ## Deploy (runs full pipeline first)
	./scripts/deploy.sh
```

## Automatic Variables

Use these in recipes to reference targets/prerequisites:

| Variable | Meaning | Example Use |
|----------|---------|-------------|
| `$@` | Target name | `echo "Building $@"` |
| `$<` | First prerequisite | `gcc -c $< -o $@` |
| `$^` | All prerequisites | `gcc $^ -o $@` |
| `$?` | Prerequisites newer than target | `echo "Changed: $?"` |
| `$*` | Stem (matched by %) | `%.o: %.c` → `$*` is filename |

```makefile
# Pattern rule with automatic variables
%.o: %.c
	$(CC) -c $< -o $@

# $< = the .c file, $@ = the .o file
```

## Pattern Rules

Define rules for classes of files:

```makefile
# Compile all .ts files to .js
%.js: %.ts
	tsc $< --outFile $@

# Compile all .scss to .css
%.css: %.scss
	sass $< $@

# Process all .md to .html
%.html: %.md
	pandoc $< -o $@
```

## Phony Targets

Always declare non-file targets as `.PHONY`:

```makefile
.PHONY: all build test clean help

# These targets don't create files, they're commands
all: build
build: ...
test: ...
clean: ...
help: ...
```

## Variables

```makefile
# Simple assignment (evaluated when used)
CC = gcc

# Immediate assignment (evaluated when defined)
SOURCES := $(wildcard src/*.c)

# Conditional assignment (only if not set)
DEBUG ?= 0

# Append
CFLAGS += -Wall

# Using variables
build:
	$(CC) $(CFLAGS) $(SOURCES) -o $(TARGET)
```

## Functions

```makefile
# Wildcard - find files
SOURCES := $(wildcard src/*.js)

# Substitution - transform names
OBJECTS := $(SOURCES:.js=.min.js)

# Shell - run command
GIT_SHA := $(shell git rev-parse --short HEAD)

# Patsubst - pattern substitution
OBJECTS := $(patsubst %.c,%.o,$(SOURCES))

# Filter - select matching items
JS_FILES := $(filter %.js,$(FILES))

# Foreach - iterate
DIRS := src lib test
CLEAN_DIRS := $(foreach dir,$(DIRS),$(dir)/build)
```

## Dependency Tracking

Make skips up-to-date targets automatically:

```makefile
# This only rebuilds if source files changed
build/app.js: $(wildcard src/*.js) package.json
	npm run build
	@touch $@  # Update timestamp
```

## Self-Documenting Help

Use `## comment` pattern for auto-generated help:

```makefile
help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Build the project
test: ## Run test suite
deploy: ## Deploy to production
```

Output:
```
  build           Build the project
  test            Run test suite
  deploy          Deploy to production
```

## Common Project Templates

### Node.js
```makefile
.PHONY: all deps build test lint format clean dev ci

deps: node_modules
node_modules: package.json
	npm ci && touch node_modules

build: deps
test: deps
lint: deps
format: deps
clean:
	rm -rf node_modules dist coverage

dev: deps
ci: deps lint test build
```

### Python
```makefile
.PHONY: all venv deps test lint format clean ci

VENV := .venv
PYTHON := $(VENV)/bin/python
PIP := $(VENV)/bin/pip

venv: $(VENV)/bin/activate
$(VENV)/bin/activate:
	python3 -m venv $(VENV)
	$(PIP) install --upgrade pip

deps: venv
	$(PIP) install -r requirements.txt

test: deps
lint: deps
format: deps
clean:
	rm -rf $(VENV) __pycache__ .pytest_cache

ci: deps lint test
```

### Go
```makefile
.PHONY: all build test lint clean ci

BINARY := app
GO := go

build:
	$(GO) build -o $(BINARY) .

test:
	$(GO) test ./...

lint:
	golangci-lint run

clean:
	rm -f $(BINARY)

ci: lint test build
```

## Anti-patterns to Avoid

### Don't Repeat Yourself
```makefile
# BAD: Duplicated install step
build:
	npm install
	npm run build

test:
	npm install
	npm test

# GOOD: Shared dependency
deps: node_modules
build: deps
test: deps
```

### Don't Hide Dependencies
```makefile
# BAD: Implicit dependency on build
deploy:
	./deploy.sh  # Assumes build exists!

# GOOD: Explicit dependency chain
deploy: build
	./deploy.sh
```

### Don't Use Shell Scripts in Recipes
```makefile
# BAD: Multi-line shell script
deploy:
	if [ -z "$$ENV" ]; then \
		echo "ENV not set"; \
		exit 1; \
	fi; \
	npm run build; \
	./deploy.sh

# GOOD: Atomic targets
check-env:
	@test -n "$$ENV" || (echo "ENV not set" && exit 1)

deploy: check-env build
	./deploy.sh
```

## Error Handling

```makefile
# Strict shell mode
SHELL := /bin/bash
.SHELLFLAGS := -eu -o pipefail -c

# Ignore errors for specific commands
clean:
	-rm -rf dist  # Dash ignores errors

# Continue on error
.IGNORE: clean
```

## Summary: The Lego Principle

1. **Atomic targets** — Each does one thing
2. **Declare dependencies** — Make handles ordering
3. **Composite targets** — Combine pieces for workflows
4. **No duplication** — Share via dependencies
5. **Self-documenting** — Use `## comments` for help
