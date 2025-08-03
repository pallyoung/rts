# RTS Project Quick Reference

## Essential Rules

### Package Management
- ✅ Use `pnpm` (not npm or yarn)
- ✅ `pnpm install` for dependencies
- ✅ `pnpm add <package>` for adding packages
- ✅ `pnpm add -D <package>` for dev dependencies

### Comments & Documentation
- ✅ **All comments in English**
- ✅ **All commit messages in English**
- ✅ **Documentation in docs/ folder (bilingual)**
- ✅ Use JSDoc style comments

### File Organization
- ✅ Source code: `src/`
- ✅ Tests: `test/`
- ✅ Documentation: `docs/` (bilingual)
- ✅ Temporary test files: `test/temp/`
- ✅ Scripts: `scripts/`

### Testing
- ✅ Use AVA framework
- ✅ Test files: `*.test.ts`
- ✅ Run: `pnpm test`
- ✅ Coverage: `pnpm run test:coverage`

### Code Style
- ✅ TypeScript with strict mode
- ✅ Named exports preferred
- ✅ PascalCase for classes
- ✅ camelCase for functions/variables
- ✅ kebab-case for file names

## Common Commands

```bash
# Package management
pnpm install
pnpm add <package>
pnpm add -D <package>
pnpm remove <package>

# Testing
pnpm test
pnpm run test:watch
pnpm run test:coverage

# Code quality
pnpm run lint
pnpm run lint:fix
pnpm run format

# Release
pnpm run release:patch
pnpm run release:minor
pnpm run release:major
```

## File Structure

```
rts/
├── src/                    # Source code
│   ├── index.ts           # Main entry
│   ├── resolver/          # Module resolver
│   ├── transformer/       # Transformers
│   ├── config/           # Configuration
│   ├── register/         # Register system
│   └── bin/              # Binary entry
├── test/                  # Tests
│   ├── temp/             # Temporary test files
│   ├── index.test.ts     # Main tests
│   ├── resolver.test.ts  # Resolver tests
│   └── ...
├── docs/                  # Documentation (bilingual)
│   ├── en/               # English docs
│   └── zh/               # Chinese docs
├── scripts/               # Build scripts
└── .cursor/              # Cursor rules
```

## Commit Message Format

```
type(scope): description

Examples:
feat(resolver): add module alias support
fix(transformer): handle JSX syntax correctly
docs(readme): update installation instructions
test(integration): add end-to-end test cases
```

## Documentation Structure

```
docs/
├── en/                    # English documentation
│   ├── api.md
│   ├── getting-started.md
│   └── examples.md
└── zh/                    # Chinese documentation
    ├── api.md
    ├── getting-started.md
    └── examples.md
```

## Test File Naming

- ✅ `index.test.ts` for main functionality
- ✅ `resolver.test.ts` for resolver tests
- ✅ `transformer.test.ts` for transformer tests
- ✅ `config.test.ts` for configuration tests
- ✅ `integration.test.ts` for integration tests

## Temporary Files

- ✅ Place temporary test files in `test/temp/`
- ✅ Clean up temporary files after tests
- ✅ Use descriptive names for temp files
- ✅ Avoid committing temp files to git 