import Module, {
  type RegisterHooksOptions,
  type ResolveHookContext,
  type ResolveHookSync,
} from "node:module";
import process from "node:process";

// Get Node.js major version for compatibility check
const version = process.version.split(".")[0];
const major = Number(version.slice(1));

/**
 * Polyfill implementation of registerHooks for Node.js versions < 24
 *
 * This polyfill provides the same functionality as the native registerHooks API
 * that was introduced in Node.js 24. It implements a LIFO (Last In, First Out)
 * hook system that allows multiple hooks to be registered and chained together.
 *
 * The polyfill works by:
 * 1. Storing the original module resolution function
 * 2. Creating a chain of resolve functions that call each hook in sequence
 * 3. Overriding the module system's resolve function with the chained version
 * 4. Providing a deregister function to remove hooks
 *
 * @returns A function that can register hooks with LIFO behavior
 *
 * @example
 * ```typescript
 * const register = registerHooksPolyfill();
 *
 * const hook1 = register({
 *   resolve: (specifier, context, nextResolve) => {
 *     // Custom resolution logic
 *     return nextResolve(specifier, context);
 *   }
 * });
 *
 * // Later, deregister the hook
 * hook1.deregister();
 * ```
 */
const registerHooksPolyfill = () => {
  const hooks: RegisterHooksOptions[] = [];

  // Store the original resolve filename function
  const originalResolveFilename = (Module as any)._resolveFilename;

  /**
   * Recursive resolve function that chains through all registered hooks
   *
   * This function implements the LIFO (Last In, First Out) behavior by
   * calling hooks in reverse order of registration. Each hook can either
   * resolve the specifier itself or pass it to the next hook in the chain.
   *
   * @param specifier - The module specifier to resolve
   * @param context - The resolution context
   * @param index - Current hook index in the chain (0 = most recently registered)
   * @returns The resolved module URL
   */
  const resolve: (
    specifier: string,
    context: ResolveHookContext,
    index?: number,
  ) => ReturnType<ResolveHookSync> = (specifier, context, index = 0) => {
    if (index < hooks.length) {
      return hooks[index].resolve
        ? hooks[index].resolve(specifier, context, (specifier, context) => {
            return resolve(specifier, context as ResolveHookContext, index + 1);
          })
        : resolve(specifier, context, index + 1);
    }
    return {
      url: specifier,
    };
  };

  // Override the original resolve filename function with our chained version
  (Module as any)._resolveFilename = (specifier, context) => {
    const url = resolve(specifier, context).url;
    return originalResolveFilename.apply(this, [url, context]);
  };

  /**
   * Register a new hook with LIFO behavior
   *
   * New hooks are added to the beginning of the chain, so they are
   * called before previously registered hooks.
   *
   * @param hook - The hook options to register
   * @returns An object with a deregister function
   */
  return (hook: RegisterHooksOptions) => {
    // LIFO (Last In, First Out) - add new hooks to the beginning
    hooks.unshift(hook);
    return {
      deregister: () => {
        hooks.splice(hooks.indexOf(hook), 1);
      },
    };
  };
};

/**
 * Register hooks function that works across Node.js versions
 *
 * This function provides a unified API for registering module resolution hooks
 * that works with both Node.js >=24 (native API) and <24 (polyfill).
 *
 * For Node.js >=24, it uses the native Module.registerHooks API.
 * For older versions, it uses the polyfill implementation.
 *
 * @param hooks - The hooks to register
 * @returns An object with a deregister function
 *
 * @example
 * ```typescript
 * const registration = register({
 *   resolve: (specifier, context, nextResolve) => {
 *     // Custom resolution logic
 *     return nextResolve(specifier, context);
 *   },
 *   load: (url, parent, nextLoad) => {
 *     // Custom loading logic
 *     return nextLoad(url, parent);
 *   }
 * });
 *
 * // Later, deregister all hooks
 * registration.deregister();
 * ```
 */
export const register =
  major >= 24 ? Module.registerHooks : registerHooksPolyfill();
