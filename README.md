# RTS - Node.js Runtime Transformer

A runtime transformer that can convert TypeScript, JavaScript, JSX, TSX, and CSS code to Node.js-compatible code.

## Features

- **Runtime Transformation**: Support for real-time conversion of TypeScript, JavaScript, JSX, TSX, and CSS code
- **Module Resolution**: Custom module resolution with alias mapping support
- **Caching System**: Built-in caching system for improved performance
- **SWC Integration**: Fast TypeScript compilation using SWC
- **Node.js Compatibility**: Support for Node.js 16+ with polyfill support for older versions

## Installation

```bash
pnpm install
```

## Usage

### As a Library

```javascript
import { registerRTS } from 'rts';

// Register RTS hooks
registerRTS();

// Now you can directly require/import TypeScript files
const myModule = require('./my-file.ts');
```

### As a CLI Tool

```bash
# Run TypeScript files directly
node -r ./run-ts.js src/bin/index.ts

# Or use npm script
npm start
```

### Direct TypeScript Execution

```bash
# Execute TypeScript files directly
node -r ./run-ts.js your-file.ts
```

## API

### `registerRTS()`

Registers RTS hooks with the Node.js module system. This enables runtime transformation of TypeScript, JSX, TSX, and CSS files.

### `ModuleResolver`

A class for handling module resolution with caching and alias support.

#### Methods

- `registerAlias(alias, target)`: Register a module alias
- `resolve(specifier, context)`: Resolve a module specifier to a URL
- `loadModule(url)`: Load a module (placeholder for future implementation)

## Configuration

### SWC Configuration

The TypeScript transformer uses the following default SWC configuration:

```javascript
{
  jsc: {
    parser: { syntax: "typescript" },
    transform: {
      legacyDecorator: true,
      decoratorMetadata: true,
    },
    target: "es2016",
    loose: false,
    externalHelpers: false,
    keepClassNames: false,
  },
  module: { type: "commonjs" },
  isModule: true,
}
```

## Development

### Scripts

- `npm start`: Run RTS binary
- `npm run lint`: Run Biome linter
- `npm run lint:fix`: Fix linting issues
- `npm run check`: Run Biome format check
- `npm run check:fix`: Fix formatting issues

### Project Structure

```
src/
├── bin/           # CLI entry point
├── config/        # Configuration files
├── register/      # Module registration logic
├── resolver/      # Module resolution and transformation
└── index.ts       # Main library entry point
```

## Architecture

### Module Registration

The system uses Node.js module hooks to intercept module loading:

1. **Resolve Hook**: Custom module resolution with alias support
2. **Load Hook**: File transformation before execution
3. **Polyfill Support**: Backward compatibility for Node.js < 24

### Transformation Pipeline

1. **Module Resolution**: Resolve module paths with alias support
2. **Caching**: Cache resolved paths for performance
3. **Transformation**: Transform code using appropriate transformers (SWC for TypeScript)
4. **Execution**: Execute transformed code

## License

ISC

## Keywords

- nodejs
- runtime
- transformer
- typescript
- javascript
- jsx
- tsx
- css

