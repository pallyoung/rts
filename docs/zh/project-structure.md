# RTS 项目结构

## 概述

本文档描述了 RTS (Runtime Transformer System) 项目的组织和结构。

## 目录结构

```
rts/
├── .cursor/                    # Cursor IDE 规则和设置
│   ├── rules                  # 综合项目规则
│   ├── settings.json          # 项目配置
│   └── quick-reference.md     # 快速参考指南
├── .vscode/                   # VS Code 设置
├── docs/                      # 文档（双语）
│   ├── en/                    # 英文文档
│   │   ├── api.md            # API 文档
│   │   ├── project-structure.md
│   │   └── getting-started.md
│   └── zh/                    # 中文文档
│       ├── api.md            # API 文档
│       ├── project-structure.md
│       └── getting-started.md
├── scripts/                   # 构建和工具脚本
│   └── release.ts            # 发布自动化
├── src/                       # 源代码
│   ├── bin/                  # 二进制入口点
│   │   └── index.ts
│   ├── config/               # 配置工具
│   │   └── index.ts
│   ├── register/             # 注册系统
│   │   └── index.ts
│   ├── resolver/             # 模块解析器
│   │   └── index.ts
│   ├── transformer/          # 转换器
│   │   └── ts.ts
│   └── index.ts              # 主入口点
├── test/                      # 测试
│   ├── temp/                 # 临时测试文件
│   ├── index.test.ts         # 主要功能测试
│   ├── resolver.test.ts      # 模块解析器测试
│   ├── transformer.test.ts   # 转换器测试
│   ├── config.test.ts        # 配置测试
│   ├── register.test.ts      # 注册系统测试
│   ├── integration.test.ts   # 集成测试
│   └── README.md             # 测试文档
├── .gitignore                # Git 忽略规则
├── ava.config.js             # AVA 测试配置
├── biome.json                # Biome 代码检查配置
├── package.json              # 包配置
├── pnpm-lock.yaml           # pnpm 锁定文件
├── README.md                 # 项目 README
└── run-ts.js                # TypeScript 运行时加载器
```

## 源代码组织

### 核心模块 (`src/`)

#### `src/index.ts`
- RTS 库的主入口点
- 导出 `registerRTS` 函数
- 定义 `RTSOptions` 接口
- 处理配置和初始化

#### `src/resolver/index.ts`
- 核心模块解析系统
- 处理别名映射和缓存
- 管理转换器注册
- 提供 Node.js 版本兼容性

#### `src/transformer/ts.ts`
- TypeScript 和 TSX 文件转换器
- 使用 SWC 进行快速编译
- 支持 TypeScript 特性，包括装饰器和 JSX
- 可配置的转换选项

#### `src/config/index.ts`
- 配置加载和解析工具
- JSON 文件处理与错误管理
- 配置合并功能
- 支持复杂的嵌套结构

#### `src/register/index.ts`
- Node.js 模块钩子注册系统
- 为旧版 Node.js 提供 polyfill
- 处理 LIFO（后进先出）钩子链
- 管理钩子注销

#### `src/bin/index.ts`
- CLI 使用的二进制入口点
- 加载时注册 RTS 钩子
- 提供命令行界面

## 测试组织 (`test/`)

### 测试文件
- **`index.test.ts`**: RTS 主要功能测试
- **`resolver.test.ts`**: 模块解析器测试
- **`transformer.test.ts`**: TypeScript 转换器测试
- **`config.test.ts`**: 配置工具测试
- **`register.test.ts`**: 注册系统测试
- **`integration.test.ts`**: 端到端集成测试

### 测试配置
- 使用 AVA 测试框架
- 启用 TypeScript 支持
- 复杂转换的 2 分钟超时
- 调试的详细输出
- 使用 c8 进行覆盖率报告

### 临时文件 (`test/temp/`)
- 所有临时测试文件都放在此目录中
- 测试后自动清理
- 从 git 跟踪中排除
- 用于文件系统测试和固定装置

## 文档 (`docs/`)

### 双语结构
- **`docs/en/`**: 英文文档
- **`docs/zh/`**: 中文文档
- 并行结构，便于维护
- 跨语言的一致命名

### 文档文件
- **`api.md`**: 完整的 API 文档
- **`project-structure.md`**: 本文档
- **`getting-started.md`**: 快速开始指南
- 其他指南和示例

## 配置文件

### `package.json`
- 项目元数据和依赖项
- 开发工作流的脚本定义
- 使用 pnpm 作为包管理器
- TypeScript 配置

### `ava.config.js`
- AVA 测试框架配置
- TypeScript 支持设置
- 超时和环境配置

### `biome.json`
- 代码检查和格式化规则
- TypeScript 和 JavaScript 支持
- 一致的代码风格执行

### `.cursor/`
- Cursor IDE 特定规则和设置
- 项目特定指南
- 开发人员快速参考

## 开发工作流

### 包管理
- 对所有包操作使用 `pnpm`
- 锁定文件：`pnpm-lock.yaml`
- 存储：`.pnpm-store/`

### 测试
- 运行测试：`pnpm test`
- 监视模式：`pnpm run test:watch`
- 覆盖率：`pnpm run test:coverage`

### 代码质量
- 代码检查：`pnpm run lint`
- 格式化：`pnpm run format`
- 修复问题：`pnpm run lint:fix`

### 发布流程
- 补丁发布：`pnpm run release:patch`
- 次要发布：`pnpm run release:minor`
- 主要发布：`pnpm run release:major`

## 文件命名约定

### 源文件
- 使用 kebab-case 命名文件
- TypeScript 文件：`.ts` 扩展名
- TypeScript JSX 文件：`.tsx` 扩展名
- JavaScript 文件：`.js` 扩展名

### 测试文件
- 使用 `.test.ts` 后缀匹配源文件名
- 使用描述性测试文件名
- 在同一文件中分组相关测试

### 文档文件
- 使用 `.md` 扩展名作为 markdown
- 使用描述性文件名
- 双语文档包含语言后缀

## 导入/导出约定

### ES 模块
- 默认使用命名导出
- 除非特别要求，否则避免 `export default`
- 使用显式导入路径
- 在索引文件中分组相关导出

### 模块组织
- 保持模块专注和内聚
- 使用索引文件进行模块导出
- 保持清晰的关注点分离

## 最佳实践

### 代码组织
- 将相关功能分组在一起
- 使用清晰、描述性的名称
- 保持一致的结构
- 记录复杂逻辑

### 测试
- 编写全面的测试
- 测试边缘情况和错误条件
- 测试后清理资源
- 使用描述性测试名称

### 文档
- 保持文档最新
- 包含使用示例
- 维护双语文档
- 使用清晰、结构化的格式

### 性能
- 优化运行时性能
- 在适当的地方使用缓存
- 最小化文件系统操作
- 监控内存使用情况 