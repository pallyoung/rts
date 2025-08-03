import test from "ava";
import { type RTSOptions, registerRTS } from "../src/index";
import type { TransformerHook } from "../src/resolver";

test("registerRTS should return a cleanup function", (t) => {
  const cleanup = registerRTS();
  t.is(typeof cleanup, "function");
  cleanup();
});

test("registerRTS should accept options with aliases", (t) => {
  const options: RTSOptions = {
    alias: {
      "@components": "./src/components",
      "@utils": ["./src/utils", "./src/helpers"],
    },
  };

  const cleanup = registerRTS(options);
  t.is(typeof cleanup, "function");
  cleanup();
});

test("registerRTS should accept custom transformers", (t) => {
  const customTransformer: TransformerHook = {
    exts: [".json"],
    hook: (code: string) => {
      const data = JSON.parse(code);
      return `module.exports = ${JSON.stringify(data)};`;
    },
  };

  const options: RTSOptions = {
    transformers: [customTransformer],
  };

  const cleanup = registerRTS(options);
  t.is(typeof cleanup, "function");
  cleanup();
});

test("registerRTS should accept both aliases and transformers", (t) => {
  const customTransformer: TransformerHook = {
    exts: [".css"],
    hook: (code: string) => {
      return `export default ${JSON.stringify(code)};`;
    },
  };

  const options: RTSOptions = {
    alias: {
      "@styles": "./src/styles",
    },
    transformers: [customTransformer],
  };

  const cleanup = registerRTS(options);
  t.is(typeof cleanup, "function");
  cleanup();
});

test("cleanup function should be callable multiple times", (t) => {
  const cleanup = registerRTS();

  // Should not throw on first call
  t.notThrows(() => cleanup());

  // Should not throw on subsequent calls
  t.notThrows(() => cleanup());
  t.notThrows(() => cleanup());
});

test("registerRTS should work with empty options", (t) => {
  const cleanup = registerRTS({});
  t.is(typeof cleanup, "function");
  cleanup();
});

test("registerRTS should work with undefined options", (t) => {
  const cleanup = registerRTS(undefined);
  t.is(typeof cleanup, "function");
  cleanup();
});
