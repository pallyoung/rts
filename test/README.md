# RTS Test Suite

## Overview

This directory contains comprehensive unit and integration tests for the RTS (Runtime Transformer System) project. The test suite uses AVA as the testing framework and provides extensive coverage of all core functionality.

## Test Structure

```
test/
├── temp/                    # Temporary test files (auto-cleaned)
├── index.test.ts           # Main functionality tests
├── resolver.test.ts        # Module resolver tests
├── transformer.test.ts     # Transformer tests
├── config.test.ts          # Configuration tests
├── integration.test.ts     # Integration tests
└── README.md              # This file
```

## Test Files

### `index.test.ts`
Tests for the main RTS functionality including:
- `registerRTS` function behavior with unified ModuleResolver approach
- Configuration handling (aliases and transformers)
- Cleanup function functionality and idempotency
- Edge cases and error handling

### `resolver.test.ts`
Tests for the ModuleResolver class including:
- **Alias Management**: String and array target handling
- **Transformer Registration**: Adding and removing transformers
- **Hook Management**: Registration and cleanup of Node.js hooks
- **Module Resolution**: Actual file loading and transformation
- **Edge Cases**: Empty configurations and error conditions

### `transformer.test.ts`
Tests for the TypeScript transformer including:
- TypeScript to JavaScript compilation
- TSX file handling with JSX syntax
- Decorator support
- Error handling for invalid code
- Performance with large files

### `config.test.ts`
Tests for configuration utilities including:
- JSON file loading and parsing
- Configuration merging
- Error handling for invalid files
- Default value handling

### `integration.test.ts`
End-to-end integration tests including:
- Complete RTS workflow with unified architecture
- Real file system operations
- Module loading scenarios
- Performance benchmarks

## Running Tests

### Basic Test Commands

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:coverage

# Run specific test file
pnpm test test/resolver.test.ts

# Run tests matching pattern
pnpm test --match="*resolver*"
```

### Test Configuration

The test suite is configured in `ava.config.js`:
- TypeScript support enabled
- 2-minute timeout for complex transformations
- Verbose output for debugging
- Coverage reporting with c8

## Test Coverage

### Core Functionality Coverage

- ✅ **Main RTS API**: `registerRTS` function with unified ModuleResolver
- ✅ **Module Resolution**: Alias handling, path resolution
- ✅ **Transformer System**: Code transformation, file type handling
- ✅ **Hook Management**: Registration, cleanup, error handling
- ✅ **Configuration**: Loading, merging, validation
- ✅ **Integration**: End-to-end workflows

### Test Quality Standards

- **Comprehensive**: Tests cover all public APIs
- **Realistic**: Tests use actual file system operations
- **Robust**: Tests handle edge cases and error conditions
- **Fast**: Tests complete within reasonable time limits
- **Clean**: Tests clean up resources properly

## Architecture Overview

The RTS system uses a unified architecture where:
- `registerRTS` function provides the main API
- `ModuleResolver` handles both module resolution and code transformation
- Built-in `TSHook` transformer handles TypeScript/TSX files
- Custom transformers can be added for additional file types
- All functionality is centralized for better maintainability

## Temporary Files

### `test/temp/` Directory

All temporary test files are created in the `test/temp/` directory:
- Automatically cleaned up after tests
- Excluded from git tracking
- Used for file system tests and fixtures
- Supports nested directory structures

### File Management

Tests follow these guidelines for temporary files:
- Create files in `test/temp/` subdirectories
- Use descriptive file names
- Clean up files in `finally` blocks
- Handle file system errors gracefully

## Best Practices

### Writing Tests

1. **Use Descriptive Names**: Test names should clearly describe what is being tested
2. **Test One Thing**: Each test should focus on a single functionality
3. **Clean Up Resources**: Always clean up temporary files and registered hooks
4. **Handle Errors**: Test both success and failure scenarios
5. **Use Comments**: Add JSDoc comments to explain complex test logic

### Test Organization

1. **Group Related Tests**: Keep related functionality in the same test file
2. **Use Setup/Teardown**: Use `beforeEach` and `afterEach` for common setup
3. **Test Edge Cases**: Include tests for boundary conditions and error cases
4. **Maintain Independence**: Tests should not depend on each other

### Performance Considerations

1. **Minimize File I/O**: Use in-memory operations when possible
2. **Cache Results**: Avoid repeated expensive operations
3. **Clean Up Promptly**: Remove temporary files immediately after use
4. **Use Timeouts**: Set appropriate timeouts for long-running operations

## Debugging Tests

### Common Issues

1. **File Path Issues**: Ensure paths work on all operating systems
2. **Module Loading**: Handle Node.js module system quirks
3. **Async Operations**: Use proper async/await patterns
4. **Resource Cleanup**: Ensure all resources are properly cleaned up

### Debugging Commands

```bash
# Run tests with verbose output
pnpm test --verbose

# Run single test with debug info
pnpm test test/resolver.test.ts --verbose

# Run tests with Node.js debug flags
NODE_OPTIONS="--inspect-brk" pnpm test
```

## Continuous Integration

The test suite is designed to run in CI environments:
- No external dependencies required
- Fast execution times
- Reliable cleanup procedures
- Cross-platform compatibility

## Coverage Reports

When running with coverage (`pnpm run test:coverage`):
- HTML reports generated in `coverage/` directory
- LCOV format for CI integration
- Threshold enforcement for quality gates
- Detailed line and branch coverage

## Contributing

When adding new tests:
1. Follow the existing naming conventions
2. Add appropriate JSDoc comments
3. Include both success and failure cases
4. Clean up all temporary resources
5. Update this README if adding new test categories 