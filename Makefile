# ============================================
# Makefile — Shayna Portfolio
# ============================================

.PHONY: all help deps build test check clean dev preview ci

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

build: deps ## Build for production
	npm run build

check: deps ## Run TypeScript type check
	npx astro check

clean: ## Clean build artifacts
	rm -rf node_modules dist .astro

# --------------------------------------------
# Development
# --------------------------------------------
dev: deps ## Start dev server
	npm run dev

preview: build ## Preview production build
	npm run preview

# --------------------------------------------
# Composite Targets
# --------------------------------------------
ci: deps check build ## Full CI pipeline
