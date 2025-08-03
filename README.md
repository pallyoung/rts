# RTS (Runtime Transformer System)

A powerful Node.js runtime transformer that enables direct execution of TypeScript, JSX, TSX, and CSS files without requiring pre-compilation. Built with SWC for fast compilation and designed for seamless integration with Node.js module system.

## Features

- **Runtime TypeScript Compilation**: Execute `.ts` and `.tsx` files directly with SWC
- **Module Alias Support**: Configure path aliases for cleaner imports
- **Extensible Transformer System**: Add custom transformers for additional file types
- **Node.js Version Compatibility**: Works with both Node.js <24 (polyfill) and >=24 (native hooks)
- **Zero Build Step**: No pre-compilation required, everything happens at runtime
- **Fast Performance**: Leverages SWC for speedy compilation
- **TypeScript Support**: Full TypeScript support with decorators and metadata

## Installation

```bash
npm install rts
```

## Quick Start

### Basic Usage

```typescript
import { registerRTS } from 'rts';

// Register RTS hooks
const cleanup = registerRTS();

// Now you can import TypeScript files directly
import { MyComponent } from './components/MyComponent.tsx';

// Cleanup when done
cleanup();
```

### With Module Aliases

```typescript
import { registerRTS } from 'rts';

const cleanup = registerRTS({
  alias: {
    '@components': './src/components',
    '@utils': ['./src/utils', './src/helpers'],
    '@types': './src/types'
  }
});

// Use aliases in your imports
import { Button } from '@components/Button';
import { formatDate } from '@utils/date';
```

### Custom Transformers

```typescript
import { registerRTS } from 'rts';
import type { TransformerHook } from 'rts';

// Create a custom CSS transformer
const CSSHook: TransformerHook = {
  exts: ['.css'],
  hook: (code: string) => {
    // Transform CSS to JS module
    return `export default ${JSON.stringify(code)};`;
  }
};

const cleanup = registerRTS({
  transformers: [CSSHook]
});
```

## API Reference

### `registerRTS(options?)`

Registers RTS hooks with Node.js module system.

**Parameters:**
- `options` (optional): Configuration object
  - `alias`: Module alias mapping
  - `transformers`: Array of custom transformers

**Returns:** Cleanup function to deregister hooks

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

## Configuration

### Module Aliases

Aliases allow you to use shorter import paths that resolve to actual file paths:

```typescript
const cleanup = registerRTS({
  alias: {
    '@components': './src/components',
    '@utils': ['./src/utils', './src/helpers'],
    '@types': './src/types'
  }
});
```

### Custom Transformers

Create custom transformers for additional file types:

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

## Node.js Compatibility

RTS supports both older and newer Node.js versions:

- **Node.js >=24**: Uses native `Module.registerHooks` API
- **Node.js <24**: Uses polyfill implementation with same functionality

## Usage Examples

### Express.js Application

```typescript
// app.ts
import express from 'express';
import { registerRTS } from 'rts';

const cleanup = registerRTS({
  alias: {
    '@routes': './src/routes',
    '@middleware': './src/middleware'
  }
});

import { userRoutes } from '@routes/users';
import { authMiddleware } from '@middleware/auth';

const app = express();
app.use('/api/users', authMiddleware, userRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

// Cleanup on process exit
process.on('SIGINT', () => {
  cleanup();
  process.exit(0);
});
```

### React Component

```typescript
// components/Button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### CSS Module

```css
/* styles/button.css */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}
```

## Development

### Prerequisites

- Node.js >=16
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/rts.git
cd rts

# Install dependencies
npm install

# Start development
npm start
```

### Scripts

- `pnpm start`: Run the development server
- `pnpm test`: Run tests
- `pnpm test:watch`: Run tests in watch mode
- `pnpm test:coverage`: Run tests with coverage
- `pnpm run lint`: Run linting
- `pnpm run lint:fix`: Fix linting issues
- `pnpm run check`: Run type checking
- `pnpm run check:fix`: Fix type checking issues
- `pnpm run format`: Format code
- `pnpm run build`: Build the project (implement as needed)

### Release Process

This project uses [Changesets](https://github.com/changesets/changesets) for version management and releases.

**Creating a release:**
```bash
# 1. Create a changeset
pnpm changeset

# 2. Build and test
pnpm run build
pnpm test

# 3. Release
pnpm run release
```

**Available release commands:**
- `pnpm changeset`: Create a new changeset
- `pnpm run release`: Full release process
- `pnpm run release:dry-run`: Test release without making changes
- `pnpm run release:build`: Build and validate
- `pnpm run release:test`: Run tests only

For detailed information, see the [Release Guide](docs/en/release-guide.md).

## Architecture

RTS consists of several key components:

### Module Resolver (`src/resolver/index.ts`)
Handles module path resolution, caching, and alias mapping. Integrates with Node.js module system through hooks.

### Transformers (`src/transformer/`)
Transform source code from one format to another. Currently includes TypeScript transformer using SWC.

### Register System (`src/register/index.ts`)
Provides Node.js version compatibility by using native APIs when available and polyfills for older versions.

### Configuration (`src/config/index.ts`)
Handles configuration loading, parsing, and merging.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [SWC](https://swc.rs/) for fast TypeScript compilation
- Node.js team for the module hooks API
- The TypeScript community for inspiration and feedback

