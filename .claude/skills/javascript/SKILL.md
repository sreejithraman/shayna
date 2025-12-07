---
name: javascript
description: Use when writing JavaScript code. Applies modern ES6+ patterns, async handling, functional methods, and common anti-patterns to avoid.
version: "1.1.0"
---

# JavaScript Best Practices

Apply when writing JavaScript code. Complements TypeScript skill with runtime patterns.

**Documentation:** https://developer.mozilla.org/en-US/docs/Web/JavaScript

## Modern Syntax

### Use `const` by Default
```javascript
// GOOD: Immutable binding
const config = { api: '/v1' };
const users = [];

// Only use let when reassignment is needed
let count = 0;
count += 1;

// NEVER use var
```

### Destructuring
```javascript
// Objects
const { name, email, role = 'user' } = user;

// Arrays
const [first, second, ...rest] = items;

// Function parameters
function createUser({ name, email, role = 'user' }) {
  return { id: generateId(), name, email, role };
}

// Renaming
const { name: userName } = user;
```

### Spread Operator
```javascript
// Shallow copy objects
const updated = { ...user, name: 'New Name' };

// Merge objects (later wins)
const merged = { ...defaults, ...options };

// Copy arrays
const copy = [...items];

// Combine arrays
const all = [...arr1, ...arr2];
```

### Template Literals
```javascript
// Interpolation
const message = `Hello, ${user.name}!`;

// Multiline
const html = `
  <div class="card">
    <h2>${title}</h2>
  </div>
`;

// Tagged templates for escaping
const query = sql`SELECT * FROM users WHERE id = ${id}`;
```

## Async Patterns

### Prefer async/await Over .then()
```javascript
// BAD: Callback chain
fetchUser(id)
  .then(user => fetchPosts(user.id))
  .then(posts => renderPosts(posts))
  .catch(err => handleError(err));

// GOOD: Linear flow
async function loadUserPosts(id) {
  const user = await fetchUser(id);
  const posts = await fetchPosts(user.id);
  return renderPosts(posts);
}
```

### Error Handling in Async
```javascript
// Try/catch for async
async function fetchData() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error; // Re-throw or handle appropriately
  }
}
```

### Parallel Execution
```javascript
// BAD: Sequential when parallel is possible
const user = await fetchUser(id);
const posts = await fetchPosts(id);

// GOOD: Parallel execution
const [user, posts] = await Promise.all([
  fetchUser(id),
  fetchPosts(id),
]);

// Handle partial failures
const results = await Promise.allSettled([
  fetchUser(id),
  fetchPosts(id),
]);
// results[0].status === 'fulfilled' | 'rejected'
```

## Array Methods

### Prefer Functional Methods
```javascript
// Transform: map
const names = users.map(user => user.name);

// Filter: filter
const active = users.filter(user => user.isActive);

// Find single: find (returns undefined if not found)
const admin = users.find(user => user.role === 'admin');

// Check existence: some/every
const hasAdmin = users.some(user => user.role === 'admin');
const allActive = users.every(user => user.isActive);

// Accumulate: reduce
const total = items.reduce((sum, item) => sum + item.price, 0);
```

### Chain Methods
```javascript
const result = users
  .filter(user => user.isActive)
  .map(user => user.name)
  .sort();
```

### When to Use forEach vs for...of
```javascript
// forEach: Side effects, no early exit
users.forEach(user => console.log(user.name));

// for...of: Need break/continue or async
for (const user of users) {
  if (user.isAdmin) break;
  await processUser(user);
}
```

## Object Patterns

### Object Methods
```javascript
// Get keys, values, entries
const keys = Object.keys(user);      // ['id', 'name']
const values = Object.values(user);  // [1, 'Alice']
const entries = Object.entries(user); // [['id', 1], ['name', 'Alice']]

// Build object from entries
const obj = Object.fromEntries(entries);
```

### Optional Chaining
```javascript
// Safe property access
const city = user?.address?.city;

// Safe method calls
const result = obj.method?.();

// Safe array access
const first = arr?.[0];
```

### Nullish Coalescing
```javascript
// Only null/undefined trigger fallback
const name = user.name ?? 'Anonymous';

// Different from || which catches 0, '', false
const count = value ?? 0;  // 0 stays 0
const count = value || 0;  // 0 becomes 0 (misleading)
```

## Modules

### Named Exports (Preferred)
```javascript
// utils.js
export function formatDate(date) { /* ... */ }
export function formatCurrency(amount) { /* ... */ }

// consumer.js
import { formatDate, formatCurrency } from './utils.js';
```

### Default Exports for Main Item
```javascript
// UserService.js
export default class UserService { /* ... */ }

// consumer.js
import UserService from './UserService.js';
```

### Re-exports for Barrel Files
```javascript
// components/index.js
export { Button } from './Button.js';
export { Card } from './Card.js';
export { Modal } from './Modal.js';
```

## Error Handling

### Custom Error Classes
```javascript
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

throw new ValidationError('email', 'Invalid email format');
```

### Guard Clauses
```javascript
function processUser(user) {
  if (!user) {
    throw new Error('User is required');
  }
  if (!user.email) {
    throw new Error('Email is required');
  }

  // Happy path continues...
  return doSomething(user);
}
```

## Common Anti-patterns

### Avoid Mutation
```javascript
// BAD: Mutating input
function addItem(array, item) {
  array.push(item);  // Mutates original!
  return array;
}

// GOOD: Return new array
function addItem(array, item) {
  return [...array, item];
}
```

### Avoid Nested Ternaries
```javascript
// BAD
const label = status === 'active' ? 'Active' : status === 'pending' ? 'Pending' : 'Unknown';

// GOOD: Object lookup or if/else
const labels = { active: 'Active', pending: 'Pending' };
const label = labels[status] ?? 'Unknown';
```

### Avoid Magic Numbers/Strings
```javascript
// BAD
if (user.role === 'admin') { /* ... */ }
setTimeout(fn, 86400000);

// GOOD
const ROLES = { ADMIN: 'admin', USER: 'user' };
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

if (user.role === ROLES.ADMIN) { /* ... */ }
setTimeout(fn, ONE_DAY_MS);
```

## Avoid
- `var` (use `const`/`let`)
- Callback pyramids (use async/await)
- `==` loose equality (use `===`)
- Mutating function parameters
- Nested ternaries
- Magic numbers and strings
- `for` loops when array methods work
- `arguments` object (use rest parameters)
