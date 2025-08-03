# RTS Project Structure

## Overview

This document describes the organization and structure of the RTS (Runtime Transformer System) project.

## Directory Structure

```
rts/
├── .cursor/                    # Cursor IDE rules and settings
│   ├── rules                  # Comprehensive project rules
│   ├── settings.json          # Project configuration
│   └── quick-reference.md     # Quick reference guide
├── .vscode/                   # VS Code settings
├── docs/                      # Documentation (bilingual)
│   ├── en/                    # English documentation
│   │   ├── api.md            # API documentation
│   │   ├── project-structure.md
│   │   └── getting-started.md
│   └── zh/                    # Chinese documentation
│       ├── api.md            # API documentation
│       ├── project-structure.md
│       └── getting-started.md
├── scripts/                   # Build and utility scripts
│   └── release.ts            # Release automation
├── src/                       # Source code
│   ├── bin/                  # Binary entry point
│   │   └── index.ts
│   ├── config/               # Configuration utilities
│   │   └── index.ts
│   ├── register/             # Register system
│   │   └── index.ts
│   ├── resolver/             # Module resolver
│   │   └── index.ts
│   ├── transformer/          # Transformers
│   │   └── ts.ts
│   └── index.ts              # Main entry point
├── test/                      # Tests
│   ├── temp/                 # Temporary test files
│   ├── index.test.ts         # Main functionality tests
│   ├── resolver.test.ts      # Module resolver tests
│   ├── transformer.test.ts   # Transformer tests
│   ├── config.test.ts        # Configuration tests
│   ├── register.test.ts      # Register system tests
│   ├── integration.test.ts   # Integration tests
│   └── README.md             # Test documentation
├── .gitignore                # Git ignore rules
├── ava.config.js             # AVA test configuration
├── biome.json                # Biome linting configuration
├── package.json              # Package configuration
├── pnpm-lock.yaml           # pnpm lock file
├── README.md                 # Project README
└── run-ts.js                # TypeScript runtime loader
```

## Source Code Organization

### Core Modules (`src/`)

#### `src/index.ts`
- Main entry point for the RTS library
- Exports the `registerRTS` function
- Defines the `RTSOptions` interface
- Handles configuration and initialization

#### `src/resolver/index.ts`
- Core module resolution system
- Handles alias mapping and caching
- Manages transformer registration
- Provides Node.js version compatibility

#### `src/transformer/ts.ts`
- TypeScript and TSX file transformer
- Uses SWC for fast compilation
- Supports TypeScript features including decorators and JSX
- Configurable transformation options

#### `src/config/index.ts`
- Configuration loading and parsing utilities
- JSON file handling with error management
- Configuration merging functionality
- Support for complex nested structures

#### `src/register/index.ts`
- Node.js module hook registration system
- Provides polyfill for older Node.js versions
- Handles LIFO (Last In, First Out) hook chaining
- Manages hook deregistration

#### `src/bin/index.ts`
- Binary entry point for CLI usage
- Registers RTS hooks when loaded
- Provides command-line interface

## Test Organization (`test/`)

### Test Files
- **`index.test.ts`**: Tests for main RTS functionality
- **`resolver.test.ts`**: Module resolver tests
- **`transformer.test.ts`**: TypeScript transformer tests
- **`config.test.ts`**: Configuration utility tests
- **`register.test.ts`**: Register system tests
- **`integration.test.ts`**: End-to-end integration tests

### Test Configuration
- Uses AVA testing framework
- TypeScript support enabled
- 2-minute timeout for complex transformations
- Verbose output for debugging
- Coverage reporting with c8

### Temporary Files (`test/temp/`)
- All temporary test files go in this directory
- Automatically cleaned up after tests
- Excluded from git tracking
- Used for file system tests and fixtures

## Documentation (`docs/`)

### Bilingual Structure
- **`docs/en/`**: English documentation
- **`docs/zh/`**: Chinese documentation
- Parallel structure for easy maintenance
- Consistent naming across languages

### Documentation Files
- **`api.md`**: Complete API documentation
- **`project-structure.md`**: This file
- **`getting-started.md`**: Quick start guide
- Additional guides and examples

## Configuration Files

### `package.json`
- Project metadata and dependencies
- Script definitions for development workflow
- pnpm as package manager
- TypeScript configuration

### `ava.config.js`
- AVA test framework configuration
- TypeScript support settings
- Timeout and environment configuration

### `biome.json`
- Code linting and formatting rules
- TypeScript and JavaScript support
- Consistent code style enforcement

### `.cursor/`
- Cursor IDE specific rules and settings
- Project-specific guidelines
- Quick reference for developers

## Development Workflow

### Package Management
- Use `pnpm` for all package operations
- Lock file: `pnpm-lock.yaml`
- Store: `.pnpm-store/`

### Testing
- Run tests: `pnpm test`
- Watch mode: `pnpm run test:watch`
- Coverage: `pnpm run test:coverage`

### Code Quality
- Linting: `pnpm run lint`
- Formatting: `pnpm run format`
- Fix issues: `pnpm run lint:fix`

### Release Process
- Patch releases: `pnpm run release:patch`
- Minor releases: `pnpm run release:minor`
- Major releases: `pnpm run release:major`

## File Naming Conventions

### Source Files
- Use kebab-case for file names
- TypeScript files: `.ts` extension
- TypeScript JSX files: `.tsx` extension
- JavaScript files: `.js` extension

### Test Files
- Match source file names with `.test.ts` suffix
- Use descriptive test file names
- Group related tests in same file

### Documentation Files
- Use `.md` extension for markdown
- Use descriptive file names
- Include language suffix for bilingual docs

## Import/Export Conventions

### ES Modules
- Use named exports by default
- Avoid `export default` unless specifically requested
- Use explicit import paths
- Group related exports in index files

### Module Organization
- Keep modules focused and cohesive
- Use index files for module exports
- Maintain clear separation of concerns

## Best Practices

### Code Organization
- Group related functionality together
- Use clear, descriptive names
- Maintain consistent structure
- Document complex logic

### Testing
- Write comprehensive tests
- Test edge cases and error conditions
- Clean up resources after tests
- Use descriptive test names

### Documentation
- Keep documentation up to date
- Include usage examples
- Maintain bilingual documentation
- Use clear, structured format

### Performance
- Optimize for runtime performance
- Use caching where appropriate
- Minimize file system operations
- Monitor memory usage 