# RTS API 文档

## 概述

RTS (Runtime Transformer System) 是一个 Node.js 运行时转换器，支持直接执行 TypeScript、JSX、TSX 和 CSS 文件，无需预编译。

## 核心 API

### `registerRTS(options?)`

向 Node.js 模块系统注册 RTS 钩子。

**参数：**
- `options` (可选): 配置对象
  - `alias`: 模块别名映射
  - `transformers`: 自定义转换器数组

**返回：** 用于注销钩子的清理函数

**示例：**
```typescript
import { registerRTS } from 'rts';

const cleanup = registerRTS({
  alias: {
    '@components': './src/components',
    '@utils': ['./src/utils', './src/helpers']
  }
});

// 使用 RTS 功能...

// 完成后清理
cleanup();
```

## 配置

### `RTSOptions`

```typescript
interface RTSOptions {
  alias?: Record<string, string[] | string>;
  transformers?: TransformerHook[];
}
```

### `TransformerHook`

```typescript
interface TransformerHook {
  exts: string[];
  hook: (code: string, src: string) => string;
}
```

## 模块解析器

### `ModuleResolver`

核心模块解析类，处理：
- 支持别名的模块路径解析
- 性能缓存
- 源代码转换
- Node.js 版本兼容性

**方法：**
- `setAlias(alias)`: 注册模块别名
- `addTransformer(transformer)`: 注册转换器
- `removeTransformer(transformer)`: 移除转换器
- `register()`: 向 Node.js 注册钩子
- `revert()`: 清理已注册的钩子

## 转换器

### 内置转换器

#### TypeScript 转换器 (`TSHook`)
- 处理 `.ts` 和 `.tsx` 文件
- 使用 SWC 进行快速编译
- 支持 TypeScript 特性，包括装饰器、JSX 等

**配置：**
```typescript
const TSHook: TransformerHook = {
  exts: ['.ts', '.tsx'],
  hook: (code: string) => {
    // 将 TypeScript 转换为 JavaScript
    return transformedCode;
  }
};
```

### 自定义转换器

您可以为其他文件类型创建自定义转换器：

```typescript
const CSSHook: TransformerHook = {
  exts: ['.css'],
  hook: (code: string) => {
    return `export default ${JSON.stringify(code)};`;
  }
};

const cleanup = registerRTS({
  transformers: [CSSHook]
});
```

## 使用示例

### 基本用法

```typescript
import { registerRTS } from 'rts';

const cleanup = registerRTS();

// 现在可以直接导入 TypeScript 文件
import { MyComponent } from './components/MyComponent.tsx';

cleanup();
```

### 使用别名

```typescript
const cleanup = registerRTS({
  alias: {
    '@components': './src/components',
    '@utils': ['./src/utils', './src/helpers']
  }
});

// 在导入中使用别名
import { Button } from '@components/Button';
import { formatDate } from '@utils/date';
```

### 使用自定义转换器

```typescript
const JSONHook: TransformerHook = {
  exts: ['.json'],
  hook: (code: string) => {
    const data = JSON.parse(code);
    return `module.exports = ${JSON.stringify(data)};`;
  }
};

const cleanup = registerRTS({
  transformers: [JSONHook]
});
```

## 错误处理

RTS 提供全面的错误处理：

- 无效模块路径会被优雅处理
- 转换错误会被记录和处理
- 清理函数是幂等的
- 保持 Node.js 版本兼容性

## 性能考虑

- 模块解析会被缓存以提高性能
- SWC 提供快速的 TypeScript 编译
- 转换器仅在需要时应用
- 针对大文件优化内存使用

## Node.js 兼容性

RTS 支持新旧 Node.js 版本：

- **Node.js >=24**: 使用原生 `Module.registerHooks` API
- **Node.js <24**: 使用 polyfill 实现

## 最佳实践

1. **始终清理**: 完成后调用清理函数
2. **使用别名**: 配置别名以获得更清晰的导入
3. **充分测试**: 确保所有转换器正常工作
4. **处理错误**: 实现适当的错误处理
5. **监控性能**: 注意内存和性能问题 