import test from "ava";
import fs from "fs";
import path from "path";
import { registerRTS } from "../src/index";

// Helper function to create temporary test files
function createTempFile(content: string, filename: string): string {
  const tempDir = path.join(__dirname, "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const filePath = path.join(tempDir, filename);
  fs.writeFileSync(filePath, content);
  return filePath;
}

// Helper function to cleanup temp files
function cleanupTempFiles(): void {
  const tempDir = path.join(__dirname, "temp");
  if (fs.existsSync(tempDir)) {
    try {
      // Try to remove files first
      const files = fs.readdirSync(tempDir);
      for (const file of files) {
        const filePath = path.join(tempDir, file);
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          // Ignore errors for individual files
        }
      }
      // Then try to remove the directory
      fs.rmdirSync(tempDir);
    } catch (error) {
      // Ignore errors for directory removal
    }
  }
}

test.afterEach(() => {
  cleanupTempFiles();
});

test("RTS should register and cleanup properly", (t) => {
  const cleanup = registerRTS();
  t.is(typeof cleanup, "function");

  // Should not throw
  t.notThrows(() => cleanup());
});

test("RTS should work with basic configuration", (t) => {
  const options = {
    alias: {
      "@test": "./test",
    },
  };

  const cleanup = registerRTS(options);
  t.is(typeof cleanup, "function");

  cleanup();
});

test("RTS should work with custom transformers", (t) => {
  const customTransformer = {
    exts: [".txt"],
    hook: (code: string) => {
      return `export default ${JSON.stringify(code)};`;
    },
  };

  const options = {
    transformers: [customTransformer],
  };

  const cleanup = registerRTS(options);
  t.is(typeof cleanup, "function");

  cleanup();
});

test("RTS should handle complex configuration", (t) => {
  const customTransformer = {
    exts: [".css"],
    hook: (code: string) => {
      return `export default ${JSON.stringify(code)};`;
    },
  };

  const options = {
    alias: {
      "@components": "./src/components",
      "@utils": ["./src/utils", "./src/helpers"],
    },
    transformers: [customTransformer],
  };

  const cleanup = registerRTS(options);
  t.is(typeof cleanup, "function");

  cleanup();
});

test("Multiple RTS registrations should work independently", (t) => {
  const cleanup1 = registerRTS({
    alias: { "@test1": "./test1" },
  });

  const cleanup2 = registerRTS({
    alias: { "@test2": "./test2" },
  });

  t.is(typeof cleanup1, "function");
  t.is(typeof cleanup2, "function");

  // Both should cleanup without throwing
  t.notThrows(() => cleanup1());
  t.notThrows(() => cleanup2());
});

test("RTS cleanup should be idempotent", (t) => {
  const cleanup = registerRTS();

  // First cleanup should not throw
  t.notThrows(() => cleanup());

  // Subsequent cleanups should also not throw
  t.notThrows(() => cleanup());
  t.notThrows(() => cleanup());
});

test("RTS should work with empty options", (t) => {
  const cleanup = registerRTS({});
  t.is(typeof cleanup, "function");
  cleanup();
});

test("RTS should work with undefined options", (t) => {
  const cleanup = registerRTS(undefined);
  t.is(typeof cleanup, "function");
  cleanup();
});

test("RTS should handle edge cases", (t) => {
  // Test with null/undefined values in options
  const options = {
    alias: {
      "@null": null,
      "@undefined": undefined,
    } as any,
    transformers: [],
  };

  const cleanup = registerRTS(options);
  t.is(typeof cleanup, "function");
  cleanup();
});

test("RTS should work with large alias configurations", (t) => {
  const largeAlias: Record<string, string> = {};

  // Create a large alias configuration
  for (let i = 0; i < 100; i++) {
    largeAlias[`@alias${i}`] = `./path${i}`;
  }

  const options = {
    alias: largeAlias,
  };

  const cleanup = registerRTS(options);
  t.is(typeof cleanup, "function");
  cleanup();
});

test("RTS should work with multiple transformers", (t) => {
  const transformer1 = {
    exts: [".ts"],
    hook: (code: string) => code,
  };

  const transformer2 = {
    exts: [".tsx"],
    hook: (code: string) => code,
  };

  const transformer3 = {
    exts: [".css"],
    hook: (code: string) => `export default ${JSON.stringify(code)};`,
  };

  const options = {
    transformers: [transformer1, transformer2, transformer3],
  };
  const cleanup = registerRTS(options);

  t.is(typeof cleanup, "function");
  try {
    cleanup();
  } catch (e) {
    console.error(e);
  }
});
