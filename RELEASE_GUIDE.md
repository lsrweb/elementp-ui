# Release Workflow Guide

Element UI 项目已配置完整的 GitHub Actions 自动化发布工作流。

## 📋 工作流说明

### 1. **Release Workflow** (`release.yml`)
手动触发的任务发布工作流，用于创建正式的版本发布。

**触发方式**: 
- GitHub Actions UI 中手动触发（Workflow Dispatch）

**参数**:
- `version`: 选择要升级的版本类型
  - `patch`: 修复版本 (2.15.15 → 2.15.16)
  - `minor`: 功能版本 (2.15.15 → 2.16.0)
  - `major`: 主版本 (2.15.15 → 3.0.0)

**执行步骤**:
1. ✅ 检出代码
2. ✅ 安装依赖 & 构建
3. ✅ 更新 `package.json` 版本号
4. ✅ 生成更新日志 (CHANGELOG.md)
5. ✅ 提交版本变更
6. ✅ 创建 GitHub Release（带完整 Changelog）
7. ✅ 发布到 NPM 包管理器
8. ✅ 推送标签到 GitHub
9. ✅ 创建 PR 合并 dev → main

**使用示例**:
```bash
# 在 GitHub Actions 页面
1. 选择 "Release" workflow
2. 点击 "Run workflow"
3. 选择版本类型 (patch/minor/major)
4. 确认执行
```

### 2. **Auto Release Workflow** (`auto-release.yml`)
自动监控 main 分支版本更新，自动创建 Release。

**触发条件**:
- 代码推送到 `main` 分支
- `package.json` 文件有变更且 commit 包含 'version' 或 'chore:' 关键词

**执行步骤**:
1. ✅ 读取 package.json 中的版本号
2. ✅ 检查该版本的 Release 是否已存在
3. ✅ 如不存在，自动创建 GitHub Release
4. ✅ 自动发布到 NPM（需配置 `NPM_TOKEN` secret）

**特点**:
- 幂等性：不会重复发布同一版本
- 自动化：无需手动干预
- 预览链接：Release body 中自动包含预览 URL

### 3. **Update Preview URLs Workflow** (`update-preview-urls.yml`)
在新版本发布时，自动更新 README.md 中的预览链接。

**触发条件**:
- GitHub Release 发布时自动触发
- 或手动在 GitHub Actions 页面触发

**执行步骤**:
1. ✅ 获取最新版本信息
2. ✅ 更新 README.md 中的预览 URL
3. ✅ 提交变更到 main 分支

**README 中的预览链接**:
```markdown
## Preview Builds
[Preview v2.15.15](https://element-ui-ui.github.io/element/v2.15.15/)

- **Main Branch (Latest)**: https://element-ui-ui.github.io/element/
- **Dev Branch (Prerelease)**: https://element-ui-ui.github.io/element/dev/
```

### 4. **Deploy Docs Workflow** (`deploy-docs.yml`)
在 main 和 dev 分支上推送时，自动构建并部署文档。

**触发条件**:
- 推送到 `main` 或 `dev` 分支

**部署地址**:
- main 分支: `https://element-ui-ui.github.io/element/`
- dev 分支: `https://element-ui-ui.github.io/element/dev/`

---

## 🚀 完整发布流程

### 方案 A: 手动发布（推荐）

```bash
# 1. 在本地 dev 分支完成开发
git checkout dev
git add .
git commit -m "feat: add new feature"

# 2. 推送到远程仓库
git push origin dev

# 3. GitHub Actions 自动构建和部署 doc 预览
# await approval and testing

# 4. 手动触发 Release 工作流
# - 打开 GitHub Actions 页面
# - 选择 "Release" workflow
# - 输入要升级的版本类型 (patch/minor/major)
# - 点击运行

# 5. Release 工作流自动:
#    - 更新版本号
#    - 生成 CHANGELOG
#    - 创建 GitHub Release
#    - 发布到 NPM
#    - 更新 README 预览链接
```

### 方案 B: 自动发布（快速）

```bash
# 1. 直接修改 package.json 版本号
# 示例: 2.15.15 → 2.15.16

# 2. 提交包含 'chore:' 或 'version' 的 commit
git commit -m "chore: bump version to 2.15.16"
git push origin main

# 3. Auto Release 工作流自动:
#    - 创建 GitHub Release
#    - 发布到 NPM
#    - 更新预览链接
```

---

## 🔐 必需的 GitHub Secrets

在 GitHub 仓库设置中配置以下 Secrets，使发布工作流正常运行：

| Secret 名称 | 说明 | 获取方式 |
|-----------|------|--------|
| `NPM_TOKEN` | NPM 包发布令牌 | npm.js.com - Account → Tokens |
| `GITHUB_TOKEN` | *(通常自动提供)* | GitHub 内置，无需配置 |

**配置步骤**:
1. 打开 GitHub 仓库 → Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. 添加 `NPM_TOKEN`，粘贴从 npm 获取的 token
4. Save

---

## 📊 工作流状态监控

在 GitHub 仓库主页查看所有工作流运行状态：

1. **Actions** 标签 → 选择要查看的工作流
2. 查看最近的运行记录
3. 点击进入查看详细日志

**常见问题排查**:

| 问题 | 原因 | 解决方案 |
|------|------|--------|
| Release 发布失败 | 缺少 `NPM_TOKEN` | 在 Secrets 中添加 NPM token |
| 版本号未更新 | commit 未包含 'version' 或 'chore:' | 修改 commit message 包含这些关键词 |
| 部署失败 | gh-pages 分支未启用 | Settings → Pages → 选择 gh-pages 分支 |

---

## 📝 Changelog 生成规则

Release 工作流会自动生成 Changelog，遵循以下规则：

```markdown
## [v2.16.0] - 2024-01-15

### Features
- 新增的功能特性

### Improvements
- 做出的改进

### Breaking Changes
- 不兼容的变更 (仅 major 版本)
```

---

## 🔗 相关文档

- [GitHub Actions 官方文档](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/lang/zh-CN/)
- [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)
- [GitHub Pages 部署](https://pages.github.com/)
- [NPM 发布流程](https://docs.npmjs.com/cli/v8/commands/npm-publish)

---

## ⚡ 快速参考

### 发布新版本（3步）
```bash
# 1. 手动触发 Release workflow
GitHub Actions → Release → Run workflow → 输入版本类型 → 确认

# 2. 工作流自动执行（验证 Actions 运行)
# 预期: 3-5 分钟完成

# 3. 验证发布成功
# - GitHub Releases 页面出现新 Release
# - NPM 仓库有新版本
# - README Preview URLs 已更新
```

### 查看部署状态
```bash
# Dev 分支预览（自动部署）
https://element-ui-ui.github.io/element/dev/

# 最新版本预览
https://element-ui-ui.github.io/element/

# 特定版本预览
https://element-ui-ui.github.io/element/v2.16.0/
```
