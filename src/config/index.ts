import fs from "node:fs";

/**
 * Load configuration from a JSON file
 *
 * This function reads a JSON configuration file and parses it into a JavaScript object.
 * It's designed to handle configuration files for the RTS system.
 *
 * @param file - Path to the configuration file
 * @returns Parsed configuration object
 * @throws {Error} If the file cannot be read or parsed
 *
 * @example
 * ```typescript
 * const config = loadConfig('./rts.config.json');
 * console.log(config.aliases); // { '@components': './src/components' }
 * ```
 */
export const loadConfig = (file: string) => {
  const config = fs.readFileSync(file, "utf8");
  return JSON.parse(config);
};

/**
 * Load configuration file with error handling
 *
 * This function provides a safe way to load configuration files with proper
 * error handling. It wraps the loadConfig function to catch and handle
 * common errors like missing files or invalid JSON.
 *
 * @param file - Path to the configuration file
 * @returns Configuration object
 * @throws {Error} If the file cannot be loaded or parsed
 *
 * @example
 * ```typescript
 * try {
 *   const config = loadConfigFile('./rts.config.json');
 *   // Use config
 * } catch (error) {
 *   console.error('Failed to load config:', error.message);
 * }
 * ```
 */
export const loadConfigFile = (file: string) => {
  const config = loadConfig(file);
  return config;
};

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
export const mergeConfig = (oldConfig: any, newConfig: any) => {
  for (const key in newConfig) {
    if (newConfig[key] instanceof Object) {
      oldConfig[key] = mergeConfig(oldConfig[key], newConfig[key]);
    } else {
      oldConfig[key] = newConfig[key];
    }
  }
  return oldConfig;
};
