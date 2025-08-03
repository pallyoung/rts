import { ModuleResolver, type TransformerHook } from "./resolver";
import { TSHook } from "./transformer/ts";

// Create a module resolver instance for handling module resolution
// This resolver will handle TypeScript, JSX, TSX, and CSS file transformations
const resolver = new ModuleResolver([TSHook]);

/**
 * Configuration options for the RTS (Runtime Transformer System)
 */
export interface RTSOptions {
  /** Module alias mapping for path resolution */
  alias?: Record<string, string[] | string>;
  /** Custom transformers for additional file type support */
  transformers?: TransformerHook[];
}

/**
 * Register RTS (Runtime Transformer System) hooks for Node.js module loading
 *
 * This function sets up custom resolve and load hooks to transform various file types
 * including TypeScript (.ts), TypeScript JSX (.tsx), JavaScript (.js), JSX (.jsx),
 * and CSS files at runtime without requiring pre-compilation.
 *
 * Features:
 * - Runtime TypeScript compilation using SWC
 * - Module alias resolution
 * - Extensible transformer system
 * - Node.js version compatibility (supports both <24 and >=24)
 *
 * @param options - Optional configuration for RTS system
 * @returns A cleanup function that can be called to deregister all hooks
 *
 * @example
 * ```typescript
 * // Basic usage
 * const cleanup = registerRTS();
 *
 * // With custom aliases
 * const cleanup = registerRTS({
 *   alias: {
 *     '@components': './src/components',
 *     '@utils': ['./src/utils', './src/helpers']
 *   }
 * });
 *
 * // With custom transformers
 * const cleanup = registerRTS({
 *   transformers: [customCSSHook, customJSXHook]
 * });
 *
 * // Cleanup when done
 * cleanup();
 * ```
 */
export const registerRTS = (options?: RTSOptions): (() => void) => {
  // Configure module aliases if provided
  if (options?.alias) {
    resolver.setAlias(options.alias);
  }

  // Add custom transformers if provided
  if (options?.transformers) {
    for (const transformer of options.transformers) {
      resolver.addTransformer(transformer);
    }
  }

  // Register the resolver hooks with Node.js module system
  resolver.register();

  // Return cleanup function
  return () => {
    resolver.revert();
  };
};
