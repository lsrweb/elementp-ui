# 🚀 GitHub Actions Release Automation - Complete Setup Summary

Element UI 项目已完整配置 GitHub Actions 自动化发布工作流。

---

## 📦 已创建的工作流文件

### 1. **release.yml** - 手动任务发布
```yaml
位置: .github/workflows/release.yml
触发: 手动 (GitHub Actions UI)
功能:
  ✅ 计算新版本号 (patch/minor/major)
  ✅ 更新 package.json 版本
  ✅ 生成 CHANGELOG
  ✅ 创建 Git 标签
  ✅ 发布 GitHub Release
  ✅ 发布到 NPM
```

### 2. **auto-release.yml** - 自动任务发布
```yaml
位置: .github/workflows/auto-release.yml
触发: 推送到 main 分支 (版本文件变更)
功能:
  ✅ 监控 package.json 版本更新
  ✅ 自动创建 GitHub Release
  ✅ 自动发布 NPM 包
  ✅ 触发 README 更新
```

### 3. **update-preview-urls.yml** - 预览链接更新
```yaml
位置: .github/workflows/update-preview-urls.yml
触发: Release 发布时
功能:
  ✅ 获取最新版本信息
  ✅ 更新 README.md 预览 URL
  ✅ 提交变更到 main
```

### 4. **deploy-docs.yml** - 文档自动部署
```yaml
位置: .github/workflows/deploy-docs.yml (已修改)
触发: 推送到 main/dev 分支
功能:
  ✅ 自动构建文档
  ✅ 部署到 GitHub Pages
  ✅ 支持多个版本同时存在
更新: 添加了 dev 分支支持
```

---

## 📄 已创建的文档文件

### 1. **RELEASE_GUIDE.md** - 完整发布指南
```
内容:
  • 4个工作流详细说明
  • 完整发布流程 (方案 A/B)
  • GitHub Secrets 配置
  • Changelog 生成规则
  • 常见问题排查
  • 快速参考表
```

### 2. **DEPLOYMENT.md** - 部署架构文档
```
内容:
  • 部署架构图 (ASCII)
  • 工作流交互图
  • 每个工作流的详细流程
  • GitHub Pages 结构说明
  • 工作流文件概览表
  • 诊断和故障排除
```

### 3. **RELEASE_QUICK_REFERENCE.md** - 快速参考卡片
```
内容:
  • 3 种发布方式 (手动/自动/dev预览)
  • Workflows 概览表
  • 1 分钟诊断检查清单
  • 完整发布示例 (情景演练)
  • 高级配置说明
  • 常见命令速查
```

### 4. **GITHUB_ACTIONS_SETUP.md** - 配置指南
```
内容:
  • 前置要求检查清单
  • NPM Token 生成步骤
  • GitHub Pages 启用方法
  • 工作流验证与测试
  • 故障排除与错误解决
  • Secrets & Permissions 配置
  • 安全最佳实践
```

### 5. **build/bin/update-version.js** - 版本管理脚本
```
功能:
  • 自动检测 commit 类型 (feat/fix/BREAKING)
  • 计算语义版本号
  • 支持 major/minor/patch 升级
  • 根据 conventional commits 规范
```

---

## 🎯 使用指南快速导航

### 我想...

#### 📌 **发布新版本?**
→ 阅读: [RELEASE_QUICK_REFERENCE.md](./RELEASE_QUICK_REFERENCE.md#-3-ways-to-release-new-version)

#### 🔧 **设置 NPM 发布?**
→ 阅读: [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md#-step-1-配置-npm-token)

#### 📊 **了解工作流架构?**
→ 阅读: [DEPLOYMENT.md](./DEPLOYMENT.md#-architecture-overview)

#### 🚨 **排除工作流问题?**
→ 阅读: [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md#-step-5-监控和故障排除) 或 
[RELEASE_QUICK_REFERENCE.md](./RELEASE_QUICK_REFERENCE.md#-一分钟诊断)

#### 🚀 **首次设置完整?**
→ 按照: [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md) 从头到尾

---

## ⚡ 最快上手 (5分钟)

### 1. 生成 NPM Token
```bash
访问: npm.js.com → Account → Tokens
选择: "Automation" 类型
复制: 新生成的 token
```

### 2. 添加到 GitHub Secrets
```
仓库 Settings → Secrets and variables → Actions
创建: NPM_TOKEN
粘贴: 从 npm.js.com 复制的 token
```

### 3. 验证 GitHub Pages 启用
```
仓库 Settings → Pages
选择: gh-pages 分支
```

### 4. 测试发布
```
GitHub Actions → Release workflow
选择: Run workflow → patch
点击: Run
```

### 5. 验证成功
```
✅ GitHub Release 已创建
✅ NPM 包已发布
✅ README 预览链接已更新
```

---

## 📋 Workflow 快速查找表

| 场景 | 使用工作流 | 触发条件 | 文档 |
|------|----------|--------|------|
| 推送到 dev 分支 | deploy-docs.yml | 自动 | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| 手动发布 release | release.yml | 手动 (Actions UI) | [RELEASE_GUIDE.md](./RELEASE_GUIDE.md) |
| 推送到 main 带 chore: | auto-release.yml | 自动 | [RELEASE_QUICK_REFERENCE.md](./RELEASE_QUICK_REFERENCE.md) |
| Release 发布后 | update-preview-urls.yml | 自动 | [DEPLOYMENT.md](./DEPLOYMENT.md) |

---

## 🔐 必需的 GitHub Secrets

在 **Settings → Secrets and variables → Actions** 中配置:

| Secret 名称 | 必需? | 说明 |
|-----------|-------|------|
| `NPM_TOKEN` | ✅ | NPM 包发布令牌 |

**设置步骤**: 见 [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md#-step-1-配置-npm-token)

---

## 📈 预期的部署地址

部署成功后，文档可从以下地址访问:

```
主分支 (最新)     https://element-ui-ui.github.io/element/
开发预览          https://element-ui-ui.github.io/element/dev/
特定版本 v2.15.15 https://element-ui-ui.github.io/element/v2.15.15/

NPM 包            https://www.npmjs.com/package/element-ui
GitHub Releases   https://github.com/your-org/element/releases
```

---

## 🔗 完整文档导航

```
顶级指南
├── RELEASE_GUIDE.md              ← 完整发布工作流说明
├── RELEASE_QUICK_REFERENCE.md    ← 快速参考 (推荐新手)
├── DEPLOYMENT.md                 ← 部署架构详解
├── GITHUB_ACTIONS_SETUP.md       ← 配置步骤 (首次设置必读)
└── README.md                      ← 项目主页 (已更新预览链接)

工作流文件
├── .github/workflows/
│   ├── release.yml               ← 手动发布 workflow
│   ├── auto-release.yml          ← 自动发布 workflow
│   ├── update-preview-urls.yml   ← 更新预览链接 workflow
│   └── deploy-docs.yml           ← 文档部署 (已配置 dev 分支)

构建脚本
├── build/bin/
│   ├── update-version.js         ← 版本号自动管理脚本
│   └── build-search.js           ← 搜索索引生成脚本
```

---

## ✅ 完整配置检查清单

使用此清单确保所有配置正确:

- [ ] `.github/workflows/` 中所有 `.yml` 文件存在
- [ ] NPM_TOKEN secret 已在 GitHub 仓库中配置
- [ ] GitHub Pages 已启用 (Settings → Pages)
- [ ] gh-pages 分支存在且为 Pages 源分支
- [ ] npm run dist 可以成功构建
- [ ] npm run lint 通过所有检查
- [ ] 至少有一个成功的 deploy-docs 工作流运行记录
- [ ] README.md 已包含预览链接部分
- [ ] 可以在 Actions 标签中看到所有工作流

---

## 🎓 推荐阅读顺序 (按场景)

### 场景 A: 首次配置
1. [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md) - 完整配置指南
2. [RELEASE_QUICK_REFERENCE.md](./RELEASE_QUICK_REFERENCE.md) - 快速了解用法
3. [RELEASE_GUIDE.md](./RELEASE_GUIDE.md) - 深入理解工作流

### 场景 B: 日常发布
1. [RELEASE_QUICK_REFERENCE.md](./RELEASE_QUICK_REFERENCE.md) - 快速参考
2. [RELEASE_GUIDE.md](./RELEASE_GUIDE.md) - 详细步骤 (需要时参考)

### 场景 C: 故障排除
1. [RELEASE_QUICK_REFERENCE.md](./RELEASE_QUICK_REFERENCE.md#-一分钟诊断) - 快速诊断
2. [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md#-step-5-监控和故障排除) - 详细排除

### 场景 D: 架构理解
1. [DEPLOYMENT.md](./DEPLOYMENT.md) - 架构概览
2. [RELEASE_GUIDE.md](./RELEASE_GUIDE.md) - 工作流详解

---

## 🚀 下一步

1. **立即使用**:
   ```bash
   # 按照 GITHUB_ACTIONS_SETUP.md 步骤 1-3 完成配置
   # 需要 5-10 分钟
   ```

2. **测试工作流**:
   ```bash
   # 按照 RELEASE_QUICK_REFERENCE.md "3 Ways to Release" 选择一个方式测试
   ```

3. **验证部署**:
   ```bash
   # 检查 https://element-ui-ui.github.io/element/
   # 检查 https://www.npmjs.com/package/element-ui
   ```

4. **分享给团队**:
   ```bash
   # 分享 RELEASE_QUICK_REFERENCE.md 给开发团队
   # 他们只需要知道 3 种发布方式即可
   ```

---

## 📞 获取帮助

**问题**? 按优先级查看:

1. [RELEASE_QUICK_REFERENCE.md - 一分钟诊断](./RELEASE_QUICK_REFERENCE.md#-一分钟诊断)
2. [GITHUB_ACTIONS_SETUP.md - 故障排除](./GITHUB_ACTIONS_SETUP.md#-step-5-监控和故障排除)
3. [GitHub Actions 官方文档](https://docs.github.com/en/actions)

---

**版本**: 1.0  
**最后更新**: 2024年 (now)  
**状态**: ✅ 生产就绪
