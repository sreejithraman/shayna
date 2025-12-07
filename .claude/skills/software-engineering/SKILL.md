---
name: software-engineering
description: Use when writing, reviewing, or refactoring any code. Applies software engineering best practices including DRY, SOLID, YAGNI, KISS, and clean code principles.
version: "1.1.0"
---

# Software Engineering Best Practices

Apply these principles when writing, reviewing, or refactoring code.

## Core Principles

### DRY (Don't Repeat Yourself)
- Extract repeated logic into functions/components
- Use constants for magic numbers and repeated values
- Create shared utilities for common operations
- If you copy-paste, you're probably doing it wrong

### SOLID
- **Single Responsibility**: Each module/function does one thing well
- **Open-Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes must be substitutable for base types
- **Interface Segregation**: Prefer small, focused interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

### YAGNI (You Ain't Gonna Need It)
- Don't add features until actually needed
- Avoid premature abstraction
- Delete unused code—don't comment it out
- Three similar lines is often better than a premature abstraction

### KISS (Keep It Simple, Stupid)
- Prefer simple solutions over clever ones
- Optimize for readability over brevity
- If it's hard to explain, it's probably too complex
- The best code is no code at all

### Composition Over Inheritance
- Prefer composing objects over deep class hierarchies
- Use interfaces/protocols for polymorphism
- Inheritance creates tight coupling

### Fail Fast
- Surface errors immediately at boundaries
- Validate inputs early
- Don't silently swallow errors
- Use assertions for invariants

### Single Source of Truth
- One authoritative location for each piece of data
- Derive computed values, don't duplicate them
- Configuration in one place

### Boy Scout Rule
- Leave code cleaner than you found it
- Small improvements compound over time
- Don't gold-plate—focused improvements only

### Principle of Least Surprise
- Code should behave as expected
- Follow conventions of the language/framework
- Name things for what they do

## Code Quality Rules

### Naming
- Use intention-revealing names
- Avoid abbreviations (except well-known: `id`, `url`, `api`)
- Functions: verbs (`getUserById`, `calculateTotal`)
- Booleans: `is`, `has`, `should` prefixes
- Constants: SCREAMING_SNAKE_CASE

### Functions
- Keep functions short and focused (< 20 lines ideal)
- Single level of abstraction per function
- Limit parameters (3 or fewer preferred)
- Prefer early returns to reduce nesting
- Max 3 levels of indentation

### Files
- One component/module per file
- Keep files under 300 lines
- Group related functionality

### Comments
- Code should be self-documenting
- Comment the "why", not the "what"
- Delete commented-out code
- Keep comments up to date or delete them

## Error Handling
- Handle errors at appropriate boundaries
- Provide meaningful error messages
- Don't catch errors you can't handle
- Log errors with context
- Use typed errors where available

## Testing Mindset
- Write testable code (pure functions, dependency injection)
- Consider edge cases during implementation
- If it's hard to test, reconsider the design
- Tests are documentation—keep them readable

## Performance Awareness
- Measure before optimizing
- Avoid premature optimization
- Know your data structures and their complexity
- Be mindful of N+1 queries and loops within loops

## Avoid
- Copy-pasting code without extracting shared logic
- Premature abstraction (wait for 3+ occurrences)
- Commented-out code in version control
- Deep inheritance hierarchies (prefer composition)
- Silently swallowing errors
- Functions doing multiple unrelated things
- Clever code over clear code
- Optimizing without measuring first
- God classes/modules that do everything
- Tight coupling between unrelated modules
