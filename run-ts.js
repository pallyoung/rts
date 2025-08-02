const { transformSync } = require("@swc/core");
const Module = require("node:module");

// Store the original .js loader
const oldLoader = Module._extensions[".js"];

/**
 * Register a custom loader for .ts files
 * This allows Node.js to directly execute TypeScript files without pre-compilation
 */
Module._extensions[".ts"] = (mod, filename) => {
  const compile = mod._compile;

  // Override the compile function to transform TypeScript to JavaScript
  mod._compile = (code) => {
    mod._compile = compile;

    // Transform TypeScript code using SWC
    const { code: transformedCode } = transformSync(code, {
      filename,
      jsc: {
        parser: {
          syntax: "typescript",
        },
      },
      module: {
        type: "commonjs",
      },
    });

    return mod._compile(transformedCode, filename);
  };

  return oldLoader(mod, filename);
};
