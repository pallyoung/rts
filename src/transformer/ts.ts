import { type Options, transformSync } from "@swc/core";
import type { TransformerHook } from "../resolver";

/**
 * Default SWC configuration for TypeScript transformation
 *
 * This configuration targets ES2016 with CommonJS module format and includes
 * support for TypeScript decorators and metadata. The settings are optimized
 * for Node.js runtime compatibility.
 *
 * Key features:
 * - TypeScript syntax parsing
 * - Legacy decorator support
 * - Decorator metadata preservation
 * - ES2016 target for broad compatibility
 * - CommonJS module format for Node.js
 * - JSX support for TSX files
 */
const DEFAULT_SWC_CONFIG: Options = {
  jsc: {
    parser: {
      syntax: "typescript",
      tsx: true,
      decorators: true,
    },
    transform: {
      legacyDecorator: true,
      decoratorMetadata: true,
      react: {
        runtime: "automatic",
      },
    },
    target: "es2016",
    loose: false,
    externalHelpers: false,
    keepClassNames: false,
  },
  module: {
    type: "commonjs",
  },
  isModule: true,
};

/**
 * TypeScript transformer hook for .ts and .tsx files
 *
 * This transformer uses SWC (Speedy Web Compiler) to convert TypeScript code
 * to JavaScript at runtime. It supports both .ts and .tsx file extensions,
 * handling JSX syntax in TypeScript files.
 *
 * The transformer is designed to work seamlessly with Node.js module system
 * and provides fast compilation without requiring pre-build steps.
 *
 * @example
 * ```typescript
 * // This will be transformed at runtime
 * import { Component } from './Component';
 *
 * interface Props {
 *   name: string;
 * }
 *
 * const MyComponent: React.FC<Props> = ({ name }) => {
 *   return <div>Hello {name}</div>;
 * };
 * ```
 */
export const TSHook: TransformerHook = {
  /** File extensions this transformer handles */
  exts: [".ts", ".tsx"],
  /**
   * Transform TypeScript/TSX code to JavaScript
   *
   * @param code - The TypeScript source code to transform
   * @returns Transformed JavaScript code
   */
  hook: (code: string) => {
    try {
      const result = transformSync(code, DEFAULT_SWC_CONFIG);
      return result.code;
    } catch (error) {
      // If transformation fails, return the original code
      console.warn("SWC transformation failed:", error);
      return code;
    }
  },
};
