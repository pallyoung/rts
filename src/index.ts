import { register } from "./register";
import { ModuleResolver } from "./resolver/resolver";

// Create a module resolver instance for handling module resolution
const resolver = new ModuleResolver();

/**
 * Register RTS (Runtime Transformer System) hooks for Node.js module loading
 * This function sets up custom resolve and load hooks to transform TypeScript, JSX, TSX, and CSS files
 * @returns The registration result from the register function
 */
export const registerRTS = () => {
  return register({
    // Custom resolve hook to handle module path resolution
    resolve: (url, context, nextResolve) => {
      console.log(url, context, nextResolve);
      console.log(resolver.resolve);
      const { url: resolvedUrl } = resolver.resolve(url, context);
      if (resolvedUrl) {
        return {
          url: resolvedUrl,
        };
      }
      return nextResolve(url, context);
    },
    // Custom load hook to handle module loading and transformation
    load: (url, parent, isMain) => {
      console.log(url, parent, isMain);
      return url;
    },
  });
};
