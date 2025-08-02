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
 * This provides the same functionality as the native registerHooks API
 * @returns A function that can register hooks with LIFO (Last In, First Out) behavior
 */
const registerHooksPolyfill = () => {
  const hooks: RegisterHooksOptions[] = [];

  // Store the original resolve filename function
  const originalResolveFilename = (Module as any)._resolveFilename;
  const originalResolve = (specifier: string, context: ResolveHookContext) => {
    return originalResolveFilename(specifier, context);
  };

  /**
   * Recursive resolve function that chains through all registered hooks
   * @param specifier - The module specifier to resolve
   * @param context - The resolution context
   * @param index - Current hook index in the chain
   * @returns The resolved module URL
   */
  const resolve: (
    specifier: string,
    context: ResolveHookContext,
    index?: number,
  ) => ReturnType<ResolveHookSync> = (specifier, context, index = 0) => {
    const currentResolve =
      index >= hooks.length
        ? originalResolve
        : (specifier, context) => {
            if (hooks[index].resolve) {
              return hooks[index].resolve(
                specifier,
                context,
                (specifier, context) => {
                  return resolve(
                    specifier,
                    context as ResolveHookContext,
                    index + 1,
                  );
                },
              );
            }
            return resolve(specifier, context, index + 1);
          };

    return currentResolve(specifier, context);
  };

  // Override the original resolve filename function
  (Module as any)._resolveFilename = (specifier, context) => {
    return resolve(specifier, context);
  };

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

// Use native registerHooks for Node.js >= 24, otherwise use polyfill
export const register =
  major >= 24 ? Module.registerHooks : registerHooksPolyfill();
