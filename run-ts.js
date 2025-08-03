const { transformSync } = require("@swc/core");
const Module = require("node:module");

// Store the original .js loader for fallback
const oldLoader = Module._extensions[".js"];

/**
 * Register a custom loader for .ts files
 *
 * This module sets up Node.js to directly execute TypeScript files without
 * requiring pre-compilation. It works by overriding the module system's
 * .ts file loader to transform TypeScript code to JavaScript at runtime
 * using SWC (Speedy Web Compiler).
 *
 * Key features:
 * - Runtime TypeScript compilation
 * - No build step required
 * - Fast compilation with SWC
 * - Seamless integration with Node.js module system
 *
 * Usage:
 * ```bash
 * # Run TypeScript files directly
 * node -r ./run-ts.js src/app.ts
 *
 * # Or use in package.json scripts
 * "start": "node -r ./run-ts.js src/index.ts"
 * ```
 */
Module._extensions[".ts"] = (mod, filename) => {
  const compile = mod._compile;

  // Override the compile function to transform TypeScript to JavaScript
  mod._compile = (code) => {
    // Restore the original compile function
    mod._compile = compile;

    // Transform TypeScript code using SWC with minimal configuration
    const { code: transformedCode } = transformSync(code, {
      filename,
      jsc: {
        parser: {
          syntax: "typescript",
        },
        // Target ES2016 for broad Node.js compatibility
        target: "es2016",
      },
      module: {
        type: "commonjs",
      },
    });

    // Compile the transformed JavaScript code
    return mod._compile(transformedCode, filename);
  };

  // Use the original loader to handle the module loading process
  return oldLoader(mod, filename);
};
