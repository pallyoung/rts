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
 * The function uses a centralized ModuleResolver instance that handles both
 * module resolution and code transformation in a unified way.
 *
 * Features:
 * - Runtime TypeScript compilation using SWC
 * - Module alias resolution with flexible path mapping
 * - Extensible transformer system for custom file types
 * - Node.js version compatibility (supports both <24 and >=24)
 * - Automatic cleanup and resource management
 *
 * @param options - Optional configuration for RTS system
 * @returns A cleanup function that can be called to deregister all hooks
 *
 * @example
 * ```typescript
 * // Basic usage with default TypeScript transformer
 * const cleanup = registerRTS();
 *
 * // With custom aliases for cleaner imports
 * const cleanup = registerRTS({
 *   alias: {
 *     '@components': './src/components',
 *     '@utils': ['./src/utils', './src/helpers']
 *   }
 * });
 *
 * // With custom transformers for additional file types
 * const customCSSHook: TransformerHook = {
 *   exts: ['.css'],
 *   hook: (code: string) => `export default ${JSON.stringify(code)};`
 * };
 * 
 * const cleanup = registerRTS({
 *   transformers: [customCSSHook]
 * });
 *
 * // With both aliases and custom transformers
 * const cleanup = registerRTS({
 *   alias: { '@styles': './src/styles' },
 *   transformers: [customCSSHook]
 * });
 *
 * // Cleanup when done (idempotent - safe to call multiple times)
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

  // Return cleanup function that reverts all registered hooks
  return () => {
    resolver.revert();
  };
};
