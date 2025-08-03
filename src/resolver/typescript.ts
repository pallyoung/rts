import swc, { type Options } from "@swc/core";
import type { TransformerHook } from ".";

/**
 * Default SWC configuration for TypeScript transformation
 * Targets ES2016 with CommonJS module format
 */
const DEFAULT_SWC_CONFIG: Options = {
  jsc: {
    parser: {
      syntax: "typescript",
    },
    transform: {
      legacyDecorator: true,
      decoratorMetadata: true,
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
 * TypeScript transformer hook that can transform .ts and .tsx files
 * Uses SWC for fast TypeScript compilation
 */
export const transformTypescript: TransformerHook = {
  exts: [".ts", ".tsx"],
  hook: (code: string) => {
    const { code: transformedCode } = swc.transformSync(
      code,
      DEFAULT_SWC_CONFIG,
    );
    return transformedCode;
  },
};
