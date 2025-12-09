---
name: javascript
description: Use when writing vanilla JavaScript. Applies ES6+ syntax, async patterns, state management, module lifecycle, and architectural patterns for building applications.
version: "2.0.0"
---

# JavaScript Best Practices

Apply when writing JavaScript code. Covers both syntax patterns and application architecture.

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

## Architecture Patterns

### State Management (Observer Pattern)

Centralized state with subscriptions for reactive updates:

```javascript
// Simple store with observer pattern
function createStore(initialState) {
  let state = initialState;
  const listeners = new Set();

  return {
    getState: () => state,
    setState: (updates) => {
      state = { ...state, ...updates };
      listeners.forEach(fn => fn(state));
    },
    subscribe: (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);  // Unsubscribe function
    }
  };
}

// Usage
const store = createStore({ count: 0, user: null });

const unsubscribe = store.subscribe((state) => {
  console.log('State changed:', state);
});

store.setState({ count: 1 });
unsubscribe();  // Cleanup
```

For high-frequency updates (e.g., currentTime), use key-specific subscriptions:

```javascript
// Key-specific subscription for performance
function createStore(initialState) {
  let state = initialState;
  const globalListeners = new Set();
  const keyListeners = new Map();  // key -> Set of listeners

  return {
    getState: () => state,
    setState: (updates) => {
      const changedKeys = Object.keys(updates);
      state = { ...state, ...updates };

      // Notify global listeners
      globalListeners.forEach(fn => fn(state));

      // Notify key-specific listeners
      changedKeys.forEach(key => {
        keyListeners.get(key)?.forEach(fn => fn(state[key], key, state));
      });
    },
    subscribe: (fn) => { /* ... */ },
    subscribeToKeys: (keys, fn) => {
      const keyArray = Array.isArray(keys) ? keys : [keys];
      keyArray.forEach(key => {
        if (!keyListeners.has(key)) keyListeners.set(key, new Set());
        keyListeners.get(key).add(fn);
      });
      return () => keyArray.forEach(key => keyListeners.get(key)?.delete(fn));
    }
  };
}

// Usage: Only fires when currentTime changes
store.subscribeToKeys('currentTime', (time) => updateDisplay(time));
```

### Dependency Injection

Pass dependencies via constructor for testability:

```javascript
// BAD: Hard-coded dependency
class Player {
  constructor(audioElement) {
    this.audio = audioElement;
  }

  async loadTrack(id) {
    const url = await fetch(`/api/tracks/${id}`);  // Hard to test
    this.audio.src = url;
  }
}

// GOOD: Inject dependencies
class Player {
  constructor(audioElement, options = {}) {
    this.audio = audioElement;
    this._getStreamUrl = options.getStreamUrl || this._defaultGetStreamUrl;
  }

  async loadTrack(id) {
    const url = await this._getStreamUrl(id);
    this.audio.src = url;
  }

  _defaultGetStreamUrl(id) {
    return fetch(`/api/tracks/${id}`).then(r => r.json());
  }
}

// Easy to test with mock
const player = new Player(audioEl, {
  getStreamUrl: async (id) => `mock://track/${id}`
});
```

### Module Lifecycle Pattern

Init/destroy pattern for SPA navigation and cleanup:

```javascript
// effect.js - Module with lifecycle
let state = null;

export function init(container) {
  if (state) return;  // Guard: already initialized

  const canvas = container.querySelector('canvas');
  const ctx = canvas.getContext('2d');

  state = {
    canvas,
    ctx,
    animationId: null
  };

  startAnimation();
}

export function destroy() {
  if (!state) return;  // Guard: not initialized

  if (state.animationId) {
    cancelAnimationFrame(state.animationId);
  }

  state = null;
}

function startAnimation() {
  function loop() {
    // ... render
    state.animationId = requestAnimationFrame(loop);
  }
  loop();
}
```

Usage with Astro view transitions:

```javascript
// In layout or page
import { init, destroy } from './effect.js';

document.addEventListener('astro:page-load', () => {
  const container = document.querySelector('.effect-container');
  if (container) init(container);
});

document.addEventListener('astro:before-swap', () => {
  destroy();
});
```

### Event-Driven Communication

Use callbacks for component-specific events:

```javascript
// Component with event callbacks
class Scrubber {
  constructor(element, options = {}) {
    this.el = element;
    this.onSeek = options.onSeek || (() => {});
    this.onScrubStart = options.onScrubStart || (() => {});
    this.onScrubEnd = options.onScrubEnd || (() => {});

    this._bindEvents();
  }

  _bindEvents() {
    this.el.addEventListener('mousedown', (e) => {
      this.onScrubStart();
      this._startScrub(e);
    });
  }

  _startScrub(e) {
    const position = this._calculatePosition(e);
    this.onSeek(position);
  }
}

// Usage
const scrubber = new Scrubber(element, {
  onSeek: (pos) => audio.currentTime = pos * audio.duration,
  onScrubStart: () => state.setState({ isScrubbing: true }),
  onScrubEnd: () => state.setState({ isScrubbing: false })
});
```

## Advanced: Web Workers

Offload CPU-intensive work to background threads:

```javascript
// main.js - Create and communicate with worker
const worker = new Worker('encoder-worker.js');

// Send data to worker
worker.postMessage({
  command: 'encode',
  data: audioBuffer,
  bitrate: 192
});

// Receive results
worker.onmessage = (e) => {
  if (e.data.type === 'complete') {
    const blob = new Blob([e.data.buffer], { type: 'audio/mp3' });
    downloadBlob(blob, 'recording.mp3');
  } else if (e.data.type === 'progress') {
    updateProgress(e.data.percent);
  }
};

// Handle errors
worker.onerror = (e) => {
  console.error('Worker error:', e.message);
};

// Cleanup when done
worker.terminate();
```

```javascript
// encoder-worker.js - Worker script
self.onmessage = (e) => {
  const { command, data, bitrate } = e.data;

  if (command === 'encode') {
    const result = encode(data, bitrate, (percent) => {
      self.postMessage({ type: 'progress', percent });
    });

    self.postMessage({ type: 'complete', buffer: result }, [result]);
  }
};
```

### Worker Best Practices
- **Lazy initialization**: Create workers only when needed
- **Transferable objects**: Use second argument to `postMessage` for zero-copy transfer
- **Single responsibility**: One worker per task type
- **Cleanup**: Always call `terminate()` when done

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
