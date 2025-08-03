import test from "ava";
import fs from "fs";
import path from "path";
import { loadConfig, loadConfigFile, mergeConfig } from "../src/config";

// Helper function to create temporary config file
function createTempConfig(content: string): string {
  const tempFile = path.join(__dirname, "temp-config.json");
  fs.writeFileSync(tempFile, content);
  return tempFile;
}

// Helper function to cleanup temp file
function cleanupTempFile(filePath: string): void {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

test("loadConfig should load valid JSON", (t) => {
  const configContent = '{"name": "test", "version": "1.0.0"}';
  const tempFile = createTempConfig(configContent);

  try {
    const result = loadConfig(tempFile);
    t.deepEqual(result, { name: "test", version: "1.0.0" });
  } finally {
    cleanupTempFile(tempFile);
  }
});

test("loadConfig should handle complex JSON", (t) => {
  const configContent = `{
    "aliases": {
      "@components": "./src/components",
      "@utils": ["./src/utils", "./src/helpers"]
    },
    "transformers": ["ts", "jsx"],
    "debug": true
  }`;

  const tempFile = createTempConfig(configContent);

  try {
    const result = loadConfig(tempFile);
    t.is(result.aliases["@components"], "./src/components");
    t.deepEqual(result.aliases["@utils"], ["./src/utils", "./src/helpers"]);
    t.deepEqual(result.transformers, ["ts", "jsx"]);
    t.is(result.debug, true);
  } finally {
    cleanupTempFile(tempFile);
  }
});

test("loadConfigFile should work the same as loadConfig", (t) => {
  const configContent = '{"test": "value"}';
  const tempFile = createTempConfig(configContent);

  try {
    const result = loadConfigFile(tempFile);
    t.deepEqual(result, { test: "value" });
  } finally {
    cleanupTempFile(tempFile);
  }
});

test("loadConfig should throw on invalid JSON", (t) => {
  const configContent = '{"invalid": json}';
  const tempFile = createTempConfig(configContent);

  try {
    t.throws(() => loadConfig(tempFile));
  } finally {
    cleanupTempFile(tempFile);
  }
});

test("loadConfig should throw on non-existent file", (t) => {
  t.throws(() => loadConfig("non-existent-file.json"));
});

test("mergeConfig should merge simple objects", (t) => {
  const oldConfig = { a: 1, b: 2 };
  const newConfig = { b: 3, c: 4 };

  const result = mergeConfig(oldConfig, newConfig);

  t.deepEqual(result, { a: 1, b: 3, c: 4 });
  t.is(result, oldConfig); // Should modify in place
});

test("mergeConfig should merge nested objects", (t) => {
  const oldConfig = {
    aliases: { "@components": "./src/components" },
    settings: { debug: false },
  };

  const newConfig = {
    aliases: { "@utils": "./src/utils" },
    settings: { debug: true },
  };

  const result = mergeConfig(oldConfig, newConfig);

  t.deepEqual(result.aliases, {
    "@components": "./src/components",
    "@utils": "./src/utils",
  });
  t.deepEqual(result.settings, { debug: true });
});

test("mergeConfig should handle arrays", (t) => {
  const oldConfig = {
    transformers: ["ts"],
    aliases: ["@components"],
  };

  const newConfig = {
    transformers: ["jsx"],
    aliases: ["@utils"],
  };

  const result = mergeConfig(oldConfig, newConfig);

  t.deepEqual(result.transformers, ["jsx"]);
  t.deepEqual(result.aliases, ["@utils"]);
});

test("mergeConfig should handle empty objects", (t) => {
  const oldConfig = {};
  const newConfig = { test: "value" };

  const result = mergeConfig(oldConfig, newConfig);

  t.deepEqual(result, { test: "value" });
});

test("mergeConfig should handle null and undefined", (t) => {
  const oldConfig = { a: 1, b: null };
  const newConfig = { b: 2, c: undefined };

  const result = mergeConfig(oldConfig, newConfig);

  t.deepEqual(result, { a: 1, b: 2, c: undefined });
});

test("mergeConfig should handle complex nested structures", (t) => {
  const oldConfig = {
    aliases: {
      "@components": "./src/components",
      "@utils": ["./src/utils", "./src/helpers"],
    },
    settings: {
      debug: false,
      cache: {
        enabled: true,
        maxSize: 100,
      },
    },
  };

  const newConfig = {
    aliases: {
      "@types": "./src/types",
    },
    settings: {
      debug: true,
      cache: {
        maxSize: 200,
      },
    },
  };

  const result = mergeConfig(oldConfig, newConfig);

  t.deepEqual(result.aliases, {
    "@components": "./src/components",
    "@utils": ["./src/utils", "./src/helpers"],
    "@types": "./src/types",
  });

  t.deepEqual(result.settings, {
    debug: true,
    cache: {
      enabled: true,
      maxSize: 200,
    },
  });
});
