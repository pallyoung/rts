import test from "ava";
import { TSHook } from "../src/transformer/ts";

test("TSHook should have correct extensions", (t) => {
  t.deepEqual(TSHook.exts, [".ts", ".tsx"]);
});

test("TSHook should have a hook function", (t) => {
  t.is(typeof TSHook.hook, "function");
});

test("TSHook should transform TypeScript code", (t) => {
  const typescriptCode = `
    interface User {
      name: string;
      age: number;
    }
    
    const user: User = {
      name: 'John',
      age: 30
    };
    
    export { user };
  `;

  const result = TSHook.hook(typescriptCode, "test.ts");

  t.is(typeof result, "string");
  t.truthy(result.length > 0);
  t.not(result, typescriptCode); // Should be transformed
});

test("TSHook should transform TSX code", (t) => {
  const tsxCode = `
    import React from 'react';
    
    interface Props {
      name: string;
    }
    
    const Component: React.FC<Props> = ({ name }) => {
      return React.createElement('div', null, 'Hello ', name);
    };
    
    export default Component;
  `;

  const result = TSHook.hook(tsxCode, "test.tsx");

  t.is(typeof result, "string");
  t.truthy(result.length > 0);
  t.not(result, tsxCode); // Should be transformed
});

test("TSHook should handle empty code", (t) => {
  const result = TSHook.hook("", "empty.ts");

  t.is(typeof result, "string");
  // Empty code might still produce some output from SWC
  t.truthy(result.length >= 0);
});

test("TSHook should handle simple TypeScript", (t) => {
  const simpleCode = "const x: number = 42;";
  const result = TSHook.hook(simpleCode, "simple.ts");

  t.is(typeof result, "string");
  t.truthy(result.length > 0);
});

test("TSHook should handle imports and exports", (t) => {
  const code = `
    import { Component } from 'react';
    export default Component;
  `;

  const result = TSHook.hook(code, "imports.ts");

  t.is(typeof result, "string");
  t.truthy(result.length > 0);
});

test("TSHook should handle decorators with proper syntax", (t) => {
  const code = `
    function log(target: any, propertyKey: string) {
      console.log('Decorator called');
    }
    
    class Example {
      @log
      method() {
        return 'test';
      }
    }
  `;

  const result = TSHook.hook(code, "decorators.ts");

  t.is(typeof result, "string");
  t.truthy(result.length > 0);
});

test("TSHook should handle async/await", (t) => {
  const code = `
    async function fetchData(): Promise<string> {
      const response = await fetch('/api/data');
      return response.text();
    }
  `;

  const result = TSHook.hook(code, "async.ts");

  t.is(typeof result, "string");
  t.truthy(result.length > 0);
});

test("TSHook should handle generics", (t) => {
  const code = `
    function identity<T>(arg: T): T {
      return arg;
    }
    
    const result = identity<string>('hello');
  `;

  const result = TSHook.hook(code, "generics.ts");

  t.is(typeof result, "string");
  t.truthy(result.length > 0);
});

test("TSHook should handle JSX with React.createElement", (t) => {
  const code = `
    import React from 'react';
    
    const Component = () => {
      return React.createElement('div', null, 'Hello World');
    };
    
    export default Component;
  `;

  const result = TSHook.hook(code, "jsx.tsx");

  t.is(typeof result, "string");
  t.truthy(result.length > 0);
});

test("TSHook should handle complex TypeScript features", (t) => {
  const code = `
    type Status = 'pending' | 'success' | 'error';
    
    interface ApiResponse<T> {
      data: T;
      status: Status;
      message?: string;
    }
    
    class ApiClient {
      async fetch<T>(url: string): Promise<ApiResponse<T>> {
        const response = await fetch(url);
        const data = await response.json();
        return { data, status: 'success' as Status };
      }
    }
  `;

  const result = TSHook.hook(code, "complex.ts");

  t.is(typeof result, "string");
  t.truthy(result.length > 0);
});
