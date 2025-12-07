---
name: typescript
description: Use when writing TypeScript code. Applies TypeScript best practices for type safety, generics, and maintainable typed code.
version: "1.0.0"
---

# TypeScript Best Practices

Apply when writing TypeScript code.

## Type Safety

### Prefer `unknown` over `any`
```typescript
// BAD: Loses all type safety
function parse(input: any) {
  return input.data;  // No error, but unsafe
}

// GOOD: Forces type checking
function parse(input: unknown) {
  if (typeof input === 'object' && input !== null && 'data' in input) {
    return input.data;
  }
  throw new Error('Invalid input');
}
```

### Use Type Guards
```typescript
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}

if (isUser(data)) {
  console.log(data.name);  // TypeScript knows it's User
}
```

### Avoid Type Assertions
```typescript
// BAD: Hiding type errors
const user = data as User;

// GOOD: Validate the data
const user = validateUser(data);  // Throws if invalid
```

## Defining Types

### Prefer Interfaces for Objects
```typescript
// Objects: Use interface (extendable)
interface User {
  id: string;
  name: string;
  email: string;
}

// Unions, primitives, tuples: Use type
type Status = 'pending' | 'active' | 'inactive';
type Coordinates = [number, number];
```

### Use Readonly When Possible
```typescript
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}

// Arrays
function process(items: readonly string[]) {
  // items.push('x');  // Error!
}
```

### Make Properties Optional Intentionally
```typescript
// Required by default
interface User {
  id: string;
  name: string;
  bio?: string;  // Explicitly optional
}
```

## Generics

### Use Descriptive Generic Names
```typescript
// BAD
function get<T, U>(obj: T, key: U): unknown;

// GOOD
function get<TObject, TKey extends keyof TObject>(
  obj: TObject,
  key: TKey
): TObject[TKey];
```

### Constrain Generics
```typescript
// Constrain to what you need
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}
```

### Default Generic Types
```typescript
interface ApiResponse<TData = unknown> {
  data: TData;
  status: number;
}
```

## Functions

### Type Parameters and Return Types
```typescript
// Explicit return types for public APIs
function createUser(name: string, email: string): User {
  return { id: generateId(), name, email };
}

// Inferred return types OK for simple internal functions
const double = (n: number) => n * 2;
```

### Use Function Overloads Sparingly
```typescript
// Prefer union types when possible
function parse(input: string | Buffer): Data;

// Use overloads only when return type depends on input
function createElement(tag: 'div'): HTMLDivElement;
function createElement(tag: 'span'): HTMLSpanElement;
function createElement(tag: string): HTMLElement;
```

## Enums vs Unions

### Prefer Union Types
```typescript
// BAD: Runtime overhead, harder to tree-shake
enum Status {
  Pending = 'pending',
  Active = 'active',
}

// GOOD: No runtime cost
type Status = 'pending' | 'active' | 'inactive';

// GOOD: When you need the values
const STATUS = {
  Pending: 'pending',
  Active: 'active',
} as const;
type Status = typeof STATUS[keyof typeof STATUS];
```

## Utility Types

Use built-in utility types:

```typescript
// Partial: All properties optional
type UpdateUser = Partial<User>;

// Required: All properties required
type CompleteUser = Required<User>;

// Pick: Select properties
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit: Exclude properties
type UserWithoutId = Omit<User, 'id'>;

// Record: Key-value object
type UserMap = Record<string, User>;

// ReturnType: Get function return type
type Result = ReturnType<typeof fetchUser>;
```

## Null Handling

### Use Strict Null Checks
Enable in tsconfig.json:
```json
{
  "compilerOptions": {
    "strictNullChecks": true
  }
}
```

### Nullish Coalescing and Optional Chaining
```typescript
// Optional chaining
const name = user?.profile?.name;

// Nullish coalescing (only null/undefined)
const displayName = name ?? 'Anonymous';

// NOT the same as || (catches 0, '', false)
const count = value || 10;    // 0 becomes 10
const count = value ?? 10;    // 0 stays 0
```

## Configuration

### Recommended tsconfig.json
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  }
}
```

## Avoid
- `any` type (use `unknown` and narrow)
- Type assertions (`as`) without validation
- Non-null assertions (`!`) without certainty
- Enums (use union types or const objects)
- Overly complex type gymnastics (simplify)
