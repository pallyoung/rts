/**
 * Interface for transformer hooks that can transform specific file types
 */
export interface TransformerHook {
  /** File extensions this transformer can handle */
  exts: string[];
  /** The transformation function */
  hook: TransformProgram;
}

/** Type definition for the transformation function */
export type TransformProgram = (code: string, src: string) => string;

/**
 * Module resolver class that handles module path resolution and caching
 * Supports alias mapping and module transformation
 */
export class ModuleResolver {
  /** Cache for resolved module paths to improve performance */
  private cache: Map<string, string> = new Map();
  /** Map of module aliases to their target paths */
  private aliases: Map<string, string> = new Map();

  /**
   * Register an alias for module path resolution
   * @param alias - The alias path
   * @param target - The target path to resolve to
   */
  registerAlias(alias, target) {
    this.aliases.set(alias, target);
  }

  /**
   * Load a module (placeholder for future implementation)
   * @param url - The module URL to load
   */
  loadModule(url: string) {}

  /**
   * Resolve a module specifier to a URL
   * @param specifier - The module specifier to resolve
   * @param context - The resolution context
   * @returns Object containing the resolved URL if found
   */
  resolve(specifier, context): { url?: string } {
    const cacheKey = `${specifier}:${context.parentURL}`;
    let url = this.cache.get(cacheKey);

    if (!url) {
      // Check if the specifier matches any registered aliases
      for (const [alias, target] of this.aliases) {
        if (specifier.startsWith(alias)) {
          specifier = specifier.replace(alias, target);
          this.cache.set(cacheKey, specifier);
          url = specifier;
          break;
        }
      }
    }

    return {
      url,
    };
  }
}
