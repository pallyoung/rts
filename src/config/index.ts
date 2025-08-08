import type { TransformerHook } from "../resolver";

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
 * Deep merge two configuration objects
 *
 * This function performs a deep merge of configuration objects, allowing
 * for partial configuration updates. It recursively merges nested objects
 * and overwrites primitive values.
 *
 * The merge is performed in-place on the oldConfig object.
 *
 * @param oldConfig - The base configuration object (will be modified)
 * @param newConfig - The configuration object to merge
 * @returns Merged configuration object (same reference as oldConfig)
 *
 * @example
 * ```typescript
 * const baseConfig = {
 *   aliases: { '@components': './src/components' },
 *   transformers: ['ts', 'jsx']
 * };
 *
 * const newConfig = {
 *   aliases: { '@utils': './src/utils' },
 *   debug: true
 * };
 *
 * const merged = mergeConfig(baseConfig, newConfig);
 * // Result: {
 * //   aliases: { '@components': './src/components', '@utils': './src/utils' },
 * //   transformers: ['ts', 'jsx'],
 * //   debug: true
 * // }
 * ```
 */
export function mergeConfig(
  oldConfig: Partial<RTSOptions>,
  newConfig: Partial<RTSOptions>,
): RTSOptions {
  if (!newConfig || typeof newConfig !== "object")
    return oldConfig as RTSOptions;
  const target: RTSOptions = { ...oldConfig };
  for (const key in newConfig) {
    switch (key) {
      case "alias":
        target.alias = { ...(target.alias ?? {}), ...(newConfig.alias ?? {}) };
        break;
      case "transformers":
        target.transformers = [
          ...(target.transformers ?? []),
          ...(newConfig.transformers ?? []),
        ];
        break;
      default:
        target[key] = newConfig[key];
    }
  }
  return target;
}

export { loadConfigFromCwd } from "./loader";
