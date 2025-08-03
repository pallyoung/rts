# RTS API Documentation

## Overview

RTS (Runtime Transformer System) is a Node.js runtime transformer that enables direct execution of TypeScript, JSX, TSX, and CSS files without requiring pre-compilation.

## Core API

### `registerRTS(options?)`

Registers RTS hooks with Node.js module system.

**Parameters:**
- `options` (optional): Configuration object
  - `alias`: Module alias mapping
  - `transformers`: Array of custom transformers

**Returns:** Cleanup function to deregister hooks

**Example:**
```typescript
import { registerRTS } from 'rts';

const cleanup = registerRTS({
  alias: {
    '@components': './src/components',
    '@utils': ['./src/utils', './src/helpers']
  }
});

// Use RTS functionality...

// Cleanup when done
cleanup();
```

## Configuration

### `RTSOptions`

```typescript
interface RTSOptions {
  alias?: Record<string, string[] | string>;
  transformers?: TransformerHook[];
}
```

### `TransformerHook`

```typescript
interface TransformerHook {
  exts: string[];
  hook: (code: string, src: string) => string;
}
```

## Module Resolver

### `ModuleResolver`

The core module resolution class that handles:
- Module path resolution with alias support
- Caching for performance
- Source code transformation
- Node.js version compatibility

**Methods:**
- `setAlias(alias)`: Register module aliases
- `addTransformer(transformer)`: Register a transformer
- `removeTransformer(transformer)`: Remove a transformer
- `register()`: Register hooks with Node.js
- `revert()`: Clean up registered hooks

## Transformers

### Built-in Transformers

#### TypeScript Transformer (`TSHook`)
- Handles `.ts` and `.tsx` files
- Uses SWC for fast compilation
- Supports TypeScript features including decorators, JSX, and more

**Configuration:**
```typescript
const TSHook: TransformerHook = {
  exts: ['.ts', '.tsx'],
  hook: (code: string) => {
    // Transform TypeScript to JavaScript
    return transformedCode;
  }
};
```

### Custom Transformers

You can create custom transformers for additional file types:

```typescript
const CSSHook: TransformerHook = {
  exts: ['.css'],
  hook: (code: string) => {
    return `export default ${JSON.stringify(code)};`;
  }
};

const cleanup = registerRTS({
  transformers: [CSSHook]
});
```

## Usage Examples

### Basic Usage

```typescript
import { registerRTS } from 'rts';

const cleanup = registerRTS();

// Now you can import TypeScript files directly
import { MyComponent } from './components/MyComponent.tsx';

cleanup();
```

### With Aliases

```typescript
const cleanup = registerRTS({
  alias: {
    '@components': './src/components',
    '@utils': ['./src/utils', './src/helpers']
  }
});

// Use aliases in imports
import { Button } from '@components/Button';
import { formatDate } from '@utils/date';
```

### With Custom Transformers

```typescript
const JSONHook: TransformerHook = {
  exts: ['.json'],
  hook: (code: string) => {
    const data = JSON.parse(code);
    return `module.exports = ${JSON.stringify(data)};`;
  }
};

const cleanup = registerRTS({
  transformers: [JSONHook]
});
```

## Error Handling

RTS provides comprehensive error handling:

- Invalid module paths are handled gracefully
- Transformation errors are logged and handled
- Cleanup functions are idempotent
- Node.js version compatibility is maintained

## Performance Considerations

- Module resolution is cached for performance
- SWC provides fast TypeScript compilation
- Transformers are applied only when needed
- Memory usage is optimized for large files

## Node.js Compatibility

RTS supports both older and newer Node.js versions:

- **Node.js >=24**: Uses native `Module.registerHooks` API
- **Node.js <24**: Uses polyfill implementation

## Best Practices

1. **Always cleanup**: Call the cleanup function when done
2. **Use aliases**: Configure aliases for cleaner imports
3. **Test thoroughly**: Ensure all transformers work correctly
4. **Handle errors**: Implement proper error handling
5. **Monitor performance**: Watch for memory and performance issues 