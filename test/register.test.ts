import fs from "node:fs";
import path from "node:path";
import test from "ava";
import { register } from "../src/register";

/**
 * Test suite for the register module
 *
 * This test suite verifies the functionality of the Node.js module hook registration system.
 * It tests both resolve and load hooks, ensuring they work correctly with the module system.
 */

test("register should be a function", (t) => {
  t.is(typeof register, "function");
});

test("register should return a deregister function", (t) => {
  const hooks = {
    resolve: (specifier: string, context: any, nextResolve: any) => {
      return nextResolve(specifier, context);
    },
  };

  const result = register(hooks);
  t.is(typeof result.deregister, "function");

  // Cleanup
  result.deregister();
});

/**
 * Test resolve hook with custom module resolution
 *
 * This test verifies that the resolve hook can intercept module resolution
 * and redirect to custom file paths. It creates a temporary module file
 * and uses the resolve hook to map a module specifier to that file.
 */
test("register should handle resolve hook with custom resolution", (t) => {
  // Create a test module file
  const testModulePath = path.join(__dirname, "temp", "test-module.js");
  const testModuleDir = path.dirname(testModulePath);

  if (!fs.existsSync(testModuleDir)) {
    fs.mkdirSync(testModuleDir, { recursive: true });
  }

  fs.writeFileSync(testModulePath, "module.exports = 'test-module-content';");

  const hooks = {
    resolve: (specifier: string, context: any, nextResolve: any) => {
      if (specifier === "test-module") {
        return { url: testModulePath };
      }
      return nextResolve(specifier, context);
    },
  };

  const result = register(hooks);

  try {
    // Test that the resolve hook actually works
    const tempModule = require("test-module");
    t.is(tempModule, "test-module-content");
  } finally {
    // Cleanup
    result.deregister();
    if (fs.existsSync(testModulePath)) {
      fs.unlinkSync(testModulePath);
    }
  }
});

/**
 * Test deregister function can be called multiple times
 *
 * This test ensures that the deregister function is idempotent and
 * can be safely called multiple times without throwing errors.
 */
test("deregister should be callable multiple times", (t) => {
  const hooks = {
    resolve: (specifier: string, context: any, nextResolve: any) => {
      return nextResolve(specifier, context);
    },
  };

  const result = register(hooks);

  // Should not throw on first call
  t.notThrows(() => result.deregister());

  // Should not throw on subsequent calls
  t.notThrows(() => result.deregister());
  t.notThrows(() => result.deregister());
});

/**
 * Test register function with empty hooks object
 *
 * This test verifies that the register function can handle empty
 * hooks objects gracefully and still return a valid deregister function.
 */
test("register should work with empty hooks object", (t) => {
  const hooks = {};

  const result = register(hooks);
  t.is(typeof result.deregister, "function");

  // Cleanup
  result.deregister();
});

/**
 * Test register function with only resolve hook
 *
 * This test verifies that the register function works correctly
 * when only a resolve hook is provided.
 */
test("register should work with hooks that have only resolve", (t) => {
  const hooks = {
    resolve: (specifier: string, context: any, nextResolve: any) => {
      return nextResolve(specifier, context);
    },
  };

  const result = register(hooks);
  t.is(typeof result.deregister, "function");

  // Cleanup
  result.deregister();
});

/**
 * Test register function with only load hook
 *
 * This test verifies that the register function works correctly
 * when only a load hook is provided.
 */
test("register should work with hooks that have only load", (t) => {
  const hooks = {
    load: (url: string, parent: any, nextLoad: any) => {
      return nextLoad(url, parent);
    },
  };

  const result = register(hooks);
  t.is(typeof result.deregister, "function");

  // Cleanup
  result.deregister();
});

/**
 * Test multiple registrations
 *
 * This test verifies that multiple register calls work correctly
 * and each returns a valid deregister function.
 */
test("register should handle multiple registrations", (t) => {
  const hooks1 = {
    resolve: (specifier: string, context: any, nextResolve: any) => {
      return nextResolve(specifier, context);
    },
  };

  const hooks2 = {
    load: (url: string, parent: any, nextLoad: any) => {
      return nextLoad(url, parent);
    },
  };

  const result1 = register(hooks1);
  const result2 = register(hooks2);

  t.is(typeof result1.deregister, "function");
  t.is(typeof result2.deregister, "function");

  // Cleanup
  result1.deregister();
  result2.deregister();
});
