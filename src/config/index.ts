import fs from "node:fs";

/**
 * Load configuration from a JSON file
 * @param file - Path to the configuration file
 * @returns Parsed configuration object
 */
export const loadConfig = (file: string) => {
  const config = fs.readFileSync(file, "utf8");
  return JSON.parse(config);
};

/**
 * Load configuration file with error handling
 * @param file - Path to the configuration file
 * @returns Configuration object
 */
export const loadConfigFile = (file: string) => {
  const config = loadConfig(file);
  return config;
};

/**
 * Deep merge two configuration objects
 * @param oldConfig - The base configuration object
 * @param newConfig - The configuration object to merge
 * @returns Merged configuration object
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
