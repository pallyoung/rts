# 发布指南

本文档描述了如何使用新的基于 changeset 的发布流程来发布 RTS 项目。

## 概述

发布流程现在使用 [@changesets/cli](https://github.com/changesets/changesets) 来管理版本、更新日志和发布。这提供了更强大和标准化的发布方法。

## 前置条件

1. 安装 changeset CLI：
   ```bash
   pnpm add -D @changesets/cli
   ```

2. 初始化 changeset（仅首次）：
   ```bash
   pnpm run changeset:init
   ```

## 发布工作流

### 1. 创建 Changeset

当您进行需要发布的更改时，创建一个 changeset：

```bash
pnpm changeset
```

这将：
- 询问您哪些包发生了变化
- 询问您更改的类型（patch、minor、major）
- 要求您编写更改的描述
- 在 `.changeset/` 目录中创建一个 markdown 文件

### 2. 构建项目

发布前，确保项目构建正确：

```bash
# 运行测试
pnpm test

# 构建项目（您需要实现这个）
pnpm run build

# 验证构建输出
pnpm run release:build
```

### 3. 发布

准备发布时：

```bash
# 完整发布流程
pnpm run release

# 试运行（不进行实际更改）
pnpm run release:dry-run
```

发布流程将：
1. ✅ 检查前置条件（changeset 已安装，changeset 文件存在）
2. ✅ 运行测试（除非使用 `--skip-tests`）
3. ✅ 构建项目（除非使用 `--skip-build`）
4. ✅ 验证构建输出
5. ✅ 使用 changeset 更新版本
6. ✅ 发布到 npm
7. ✅ 推送更改到 git
8. ✅ 清理 changeset 文件

## 构建流程

发布脚本期望构建流程产生以下文件：

```
dist/
├── index.js
├── index.d.ts
├── resolver/
│   ├── index.js
│   └── index.d.ts
├── transformer/
│   ├── ts.js
│   └── ts.d.ts
└── config/
    ├── index.js
    └── index.d.ts
```

您需要在 `package.json` 中实现构建脚本：

```json
{
  "scripts": {
    "build": "your-build-command-here"
  }
}
```

## 可用命令

### Changeset 命令

- `pnpm changeset` - 创建新的 changeset
- `pnpm run changeset:init` - 初始化 changeset（首次设置）
- `pnpm run changeset:version` - 更新版本和更新日志
- `pnpm run changeset:publish` - 发布到 npm

### 发布命令

- `pnpm run release` - 完整发布流程
- `pnpm run release:dry-run` - 试运行（不进行实际更改）
- `pnpm run release:build` - 构建和验证
- `pnpm run release:test` - 仅运行测试

### 选项

- `--dry-run` - 运行但不进行实际更改
- `--skip-build` - 跳过构建流程
- `--skip-tests` - 跳过运行测试

## 示例

### 基本发布

```bash
# 1. 创建 changeset
pnpm changeset

# 2. 构建和测试
pnpm run build
pnpm test

# 3. 发布
pnpm run release
```

### 试运行

```bash
# 测试发布流程而不进行更改
pnpm run release:dry-run
```

### 跳过构建

```bash
# 不构建就发布（如果构建已完成）
pnpm run release --skip-build
```

### 跳过测试

```bash
# 不运行测试就发布
pnpm run release --skip-tests
```

## Changeset 文件

Changeset 文件在 `.changeset/` 目录中创建，名称如 `random-name.md`。它们包含：

```markdown
---
"rts": patch
---

更改描述
```

## 更新日志

更新日志由 changeset 自动生成，包括：
- 版本信息
- 发布日期
- 分类的更改（Added、Changed、Fixed、Breaking Changes）
- 相关问题/PR 的链接

## 故障排除

### Changeset 未安装

```bash
pnpm add -D @changesets/cli
```

### 没有 Changeset 文件

```bash
pnpm changeset
```

### 构建验证失败

在 `package.json` 中实现构建脚本，并确保它在 `dist/` 目录中产生预期的文件。

### Git 问题

确保您有适当的 git 配置和推送到存储库的权限。

## 从旧发布流程迁移

旧的发布流程使用手动版本更新。新流程：

1. ✅ 使用 changeset 进行版本管理
2. ✅ 自动生成更新日志
3. ✅ 提供更好的验证
4. ✅ 支持多包（未来）
5. ✅ 具有更好的错误处理

## 最佳实践

1. **及早创建 changeset** - 在进行更改时创建 changeset，而不是仅在发布前
2. **编写清晰的描述** - 良好的更新日志条目帮助用户理解更改
3. **发布前测试** - 始终运行测试和构建验证
4. **使用试运行** - 首先使用 `--dry-run` 测试发布流程
5. **审查更改** - 发布前检查生成的更新日志 