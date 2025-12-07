---
description: Generate a composable Makefile with Lego-piece targets
allowed-tools: Read, Glob, Bash, Write, Edit
argument-hint: [project-type]
---

# Generate Makefile

Create a Makefile following the "Lego pieces" pattern where targets are atomic, composable, and dependencies auto-run.

## First: Invoke the Skill

Use the `makefile` skill for best practices and patterns.

## Detect Project Type

If no argument provided, detect from files:

| Files Found | Project Type |
|-------------|--------------|
| `package.json` | node |
| `requirements.txt`, `pyproject.toml` | python |
| `go.mod` | go |
| `Cargo.toml` | rust |
| `Gemfile` | ruby |
| `composer.json` | php |
| Other | generic |

## Project Templates

### Node.js (`node`)

```makefile
# ============================================
# Makefile
# ============================================

.PHONY: all help deps build test lint format clean dev ci deploy

.DEFAULT_GOAL := help

SHELL := /bin/bash
.SHELLFLAGS := -eu -o pipefail -c

# --------------------------------------------
# Help
# --------------------------------------------
help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

# --------------------------------------------
# Core Targets
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
	rm -rf node_modules dist coverage .cache

# --------------------------------------------
# Composite Targets
# --------------------------------------------
dev: deps ## Start dev server
	npm run dev

check: lint test ## Run all checks

ci: deps lint test build ## Full CI pipeline

deploy: ci ## Deploy (runs full pipeline)
	@echo "Deploying..."
```

### Python (`python`)

```makefile
# ============================================
# Makefile
# ============================================

.PHONY: all help venv deps test lint format clean ci

.DEFAULT_GOAL := help

SHELL := /bin/bash
.SHELLFLAGS := -eu -o pipefail -c

VENV := .venv
PYTHON := $(VENV)/bin/python
PIP := $(VENV)/bin/pip

# --------------------------------------------
# Help
# --------------------------------------------
help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

# --------------------------------------------
# Core Targets
# --------------------------------------------
venv: $(VENV)/bin/activate ## Create virtual environment

$(VENV)/bin/activate:
	python3 -m venv $(VENV)
	$(PIP) install --upgrade pip

deps: venv ## Install dependencies
	$(PIP) install -r requirements.txt

test: deps ## Run tests
	$(PYTHON) -m pytest

lint: deps ## Lint code
	$(PYTHON) -m ruff check .

format: deps ## Format code
	$(PYTHON) -m ruff format .

clean: ## Clean artifacts
	rm -rf $(VENV) __pycache__ .pytest_cache .ruff_cache *.egg-info

# --------------------------------------------
# Composite Targets
# --------------------------------------------
check: lint test ## Run all checks

ci: deps lint test ## Full CI pipeline
```

### Go (`go`)

```makefile
# ============================================
# Makefile
# ============================================

.PHONY: all help build test lint clean ci

.DEFAULT_GOAL := help

SHELL := /bin/bash
.SHELLFLAGS := -eu -o pipefail -c

BINARY := app
GO := go

# --------------------------------------------
# Help
# --------------------------------------------
help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

# --------------------------------------------
# Core Targets
# --------------------------------------------
build: ## Build binary
	$(GO) build -o $(BINARY) .

test: ## Run tests
	$(GO) test -v ./...

lint: ## Lint code
	golangci-lint run

clean: ## Clean artifacts
	rm -f $(BINARY)
	$(GO) clean

# --------------------------------------------
# Composite Targets
# --------------------------------------------
check: lint test ## Run all checks

ci: lint test build ## Full CI pipeline
```

### Rust (`rust`)

```makefile
# ============================================
# Makefile
# ============================================

.PHONY: all help build test lint clean ci release

.DEFAULT_GOAL := help

SHELL := /bin/bash
.SHELLFLAGS := -eu -o pipefail -c

# --------------------------------------------
# Help
# --------------------------------------------
help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

# --------------------------------------------
# Core Targets
# --------------------------------------------
build: ## Build debug binary
	cargo build

test: ## Run tests
	cargo test

lint: ## Lint code
	cargo clippy -- -D warnings

format: ## Format code
	cargo fmt

clean: ## Clean artifacts
	cargo clean

# --------------------------------------------
# Composite Targets
# --------------------------------------------
check: lint test ## Run all checks

ci: lint test build ## Full CI pipeline

release: ci ## Build release binary
	cargo build --release
```

### Generic (`generic`)

```makefile
# ============================================
# Makefile
# ============================================

.PHONY: all help build test lint clean ci

.DEFAULT_GOAL := help

SHELL := /bin/bash
.SHELLFLAGS := -eu -o pipefail -c

# --------------------------------------------
# Help
# --------------------------------------------
help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

# --------------------------------------------
# Core Targets
# --------------------------------------------
build: ## Build project
	@echo "Add build command"

test: ## Run tests
	@echo "Add test command"

lint: ## Lint code
	@echo "Add lint command"

clean: ## Clean artifacts
	@echo "Add clean command"

# --------------------------------------------
# Composite Targets
# --------------------------------------------
check: lint test ## Run all checks

ci: lint test build ## Full CI pipeline
```

## Customization

After generating, ask user if they want to:

1. **Add more targets** — Based on their package.json scripts, pyproject.toml, etc.
2. **Customize commands** — Replace placeholder commands with actual ones
3. **Add deployment** — Add deploy target with their deployment process

## Output

1. Create `Makefile` in project root
2. Show the generated Makefile
3. Explain the Lego pattern:
   - "Run `make help` to see all commands"
   - "Run `make deploy` and it auto-runs deps → lint → test → build → deploy"
   - "Each target is atomic — add new ones and wire them via dependencies"

## Key Principle

Remind user: **Dependencies are the glue.** When they add a new target:
1. Make it do ONE thing
2. Declare what it needs as prerequisites
3. Make handles the rest

```makefile
# New target example
typecheck: deps ## Run TypeScript check
	npm run typecheck

# Update composite to include it
ci: deps lint typecheck test build
```
