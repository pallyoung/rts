# RTS (运行时转换系统)

一个强大的 Node.js 运行时转换器，支持直接执行 TypeScript、JSX、TSX 和 CSS 文件，无需预编译。使用 SWC 进行快速编译，专为与 Node.js 模块系统无缝集成而设计。

## 特性

- **运行时 TypeScript 编译**: 使用 SWC 直接执行 `.ts` 和 `.tsx` 文件
- **模块别名支持**: 配置路径别名，实现更清晰的导入
- **可扩展的转换器系统**: 为其他文件类型添加自定义转换器
- **Node.js 版本兼容性**: 支持 Node.js <24（polyfill）和 >=24（原生钩子）
- **零构建步骤**: 无需预编译，一切都在运行时进行
- **快速性能**: 利用 SWC 进行快速编译
- **TypeScript 支持**: 完整的 TypeScript 支持，包括装饰器和元数据

## 安装

```bash
npm install rts
```

## 快速开始

### 基本用法

```typescript
import { registerRTS } from 'rts';

// 注册 RTS 钩子
const cleanup = registerRTS();

// 现在可以直接导入 TypeScript 文件
import { MyComponent } from './components/MyComponent.tsx';

// 完成后清理
cleanup();
```

### 使用模块别名

```typescript
import { registerRTS } from 'rts';

const cleanup = registerRTS({
  alias: {
    '@components': './src/components',
    '@utils': ['./src/utils', './src/helpers'],
    '@types': './src/types'
  }
});

// 在导入中使用别名
import { Button } from '@components/Button';
import { formatDate } from '@utils/date';
```

### 自定义转换器

```typescript
import { registerRTS } from 'rts';
import type { TransformerHook } from 'rts';

// 创建自定义 CSS 转换器
const CSSHook: TransformerHook = {
  exts: ['.css'],
  hook: (code: string) => {
    // 将 CSS 转换为 JS 模块
    return `export default ${JSON.stringify(code)};`;
  }
};

const cleanup = registerRTS({
  transformers: [CSSHook]
});
```

## API 参考

### `registerRTS(options?)`

向 Node.js 模块系统注册 RTS 钩子。

**参数:**
- `options` (可选): 配置对象
  - `alias`: 模块别名映射
  - `transformers`: 自定义转换器数组

**返回:** 用于注销钩子的清理函数

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

## 配置

### 模块别名

别名允许你使用更短的导入路径，解析到实际的文件路径：

```typescript
const cleanup = registerRTS({
  alias: {
    '@components': './src/components',
    '@utils': ['./src/utils', './src/helpers'],
    '@types': './src/types'
  }
});
```

### 自定义转换器

为其他文件类型创建自定义转换器：

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

## Node.js 兼容性

RTS 支持较旧和较新的 Node.js 版本：

- **Node.js >=24**: 使用原生 `Module.registerHooks` API
- **Node.js <24**: 使用具有相同功能的 polyfill 实现

## 使用示例

### Express.js 应用程序

```typescript
// app.ts
import express from 'express';
import { registerRTS } from 'rts';

const cleanup = registerRTS({
  alias: {
    '@routes': './src/routes',
    '@middleware': './src/middleware'
  }
});

import { userRoutes } from '@routes/users';
import { authMiddleware } from '@middleware/auth';

const app = express();
app.use('/api/users', authMiddleware, userRoutes);

app.listen(3000, () => {
  console.log('服务器运行在端口 3000');
});

// 进程退出时清理
process.on('SIGINT', () => {
  cleanup();
  process.exit(0);
});
```

### React 组件

```typescript
// components/Button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### CSS 模块

```css
/* styles/button.css */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}
```

## 开发

### 前置要求

- Node.js >=16
- npm 或 yarn

### 设置

```bash
# 克隆仓库
git clone https://github.com/your-org/rts.git
cd rts

# 安装依赖
npm install

# 开始开发
npm start
```

### 脚本

- `pnpm start`: 运行开发服务器
- `pnpm test`: 运行测试
- `pnpm test:watch`: 以监视模式运行测试
- `pnpm test:coverage`: 运行测试并生成覆盖率报告
- `pnpm run lint`: 运行代码检查
- `pnpm run lint:fix`: 修复代码检查问题
- `pnpm run check`: 运行类型检查
- `pnpm run check:fix`: 修复类型检查问题
- `pnpm run format`: 格式化代码
- `pnpm run build`: 构建项目（根据需要实现）

### 发布流程

本项目使用 [Changesets](https://github.com/changesets/changesets) 进行版本管理和发布。

**创建发布:**
```bash
# 1. 创建变更集
pnpm changeset

# 2. 构建和测试
pnpm run build
pnpm test

# 3. 发布
pnpm run release
```

**可用的发布命令:**
- `pnpm changeset`: 创建新的变更集
- `pnpm run release`: 完整发布流程
- `pnpm run release:dry-run`: 测试发布而不做更改
- `pnpm run release:build`: 构建和验证
- `pnpm run release:test`: 仅运行测试
- `pnpm run release:tag`: 为当前版本创建 git 标签

详细信息请参阅 [发布指南](release-guide.md)。

## 架构

RTS 由几个关键组件组成：

### 模块解析器 (`src/resolver/index.ts`)
处理模块路径解析、缓存和别名映射。通过钩子与 Node.js 模块系统集成。

### 转换器 (`src/transformer/`)
将源代码从一种格式转换为另一种格式。目前包括使用 SWC 的 TypeScript 转换器。

### 注册系统 (`src/register/index.ts`)
通过在有可用时使用原生 API 和为较旧版本提供 polyfill 来提供 Node.js 版本兼容性。

### 配置 (`src/config/index.ts`)
处理配置加载、解析和合并。

## 贡献

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m '添加令人惊叹的功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 许可证

本项目基于 ISC 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。

## 致谢

- [SWC](https://swc.rs/) 用于快速 TypeScript 编译
- Node.js 团队提供的模块钩子 API
- TypeScript 社区的灵感和反馈 