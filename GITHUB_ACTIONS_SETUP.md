# GitHub Actions Setup & Configuration

完整设置 GitHub Actions 自动发布工作流的步骤指南。

## 📋 前置要求

- [ ] GitHub 仓库访问权限 (Owner 或 Maintainer)
- [ ] NPM 账户 (发布到 npm.js.com)
- [ ] GitHub Personal Access Token (可选, 高级用途)
- [ ] 仓库已启用 GitHub Pages (Settings → Pages)

---

## 🔐 Step 1: 配置 NPM Token

### 从 NPM 生成 Token

1. 访问 **npm.js.com**
2. 登录你的 NPM 账户
3. 进入 **Account → Tokens**
4. 点击 **"Generate New Token"**
5. 选择 **"Automation"** (用于 CI/CD)
   ```
   Token Type: Automation
   - 有权限发布
   - 支持 CI/CD 自动发布
   ```
6. 复制生成的 Token

> ⚠️ **安全提示**: Token 只显示一次，务必立即复制保存到安全位置

### 添加 NPM_TOKEN 到 GitHub Secrets

1. 打开你的 **GitHub 仓库**
2. 进入 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **"New repository secret"**
4. 名称: `NPM_TOKEN`
5. 值: 粘贴从 NPM 复制的 token
6. 点击 **"Add secret"**

**验证 Token 有效性**:
```bash
npm whoami --registry https://registry.npmjs.com --auth-type=legacy
# 应该输出你的 NPM 用户名
```

### 🔄 Token 生成流程图

```
npm.js.com (Account → Tokens)
          │
          ▼
    [Generate New Token]
          │
          ▼
    Select "Automation"
          │
          ▼
    Copy Token (仅显示一次!)
          │
          ▼
GitHub Secrets (Settings → Secrets)
          │
          ▼
    [New Repository Secret]
          │
          ▼
    Name: NPM_TOKEN
    Value: paste-token-here
          │
          ▼
    ✅ Saved
```

---

## 📦 Step 2: 启用 GitHub Pages

### Configure Pages Repository

1. 打开 **仓库 Settings**
2. 进入 **Pages** (左侧菜单找不到? 确保仓库不是 private)
3. **Source** 设置为:
   ```
   Deploy from a branch
   Branch: gh-pages
   Folder: / (root)
   ```
4. 等待页面出现 **green checkmark**

### 验证 GitHub Pages 已启用

访问预览地址:
```
https://{github-username}.github.io/{repo-name}/
```

例如:
```
https://element-ui-ui.github.io/element/
```

---

## ⚙️ Step 3: 验证工作流文件

确保以下工作流文件存在于 `.github/workflows/`:

### 文件清单

```bash
.github/workflows/
├── deploy-docs.yml          ✅ 部署文档
├── release.yml              ✅ 手动发布
├── auto-release.yml         ✅ 自动发布
├── update-preview-urls.yml  ✅ 更新 README
├── preview-build.yml        ✅ PR 预览构建
└── preview-deploy.yml       ✅ PR 预览部署
```

**检查工作流是否正确**:

在仓库中运行:
```bash
# 验证 YAML 语法 (可选, 需要 yamllint)
yamllint .github/workflows/*.yml

# 或手动检查缩进和语法
cat .github/workflows/release.yml | head -20
```

---

## 🧪 Step 4: 测试工作流

### A. 测试 Deploy Docs Workflow

1. 创建新分支
   ```bash
   git checkout -b test/workflow
   git push origin test/workflow
   ```

2. 进行小改动
   ```bash
   echo "# Test" >> CHANGELOG.md
   git commit -am "chore: test workflow"
   git push origin test/workflow
   ```

3. 等待工作流运行
   - 打开仓库 → **Actions**
   - 查看 **deploy-docs** workflow 是否运行

4. 检查日志
   - 如果有红色 ❌: 查看失败原因
   - 如果有绿色 ✅: 工作流运行成功

### B. 测试 Release Workflow

1. 打开仓库 → **Actions**
2. 选择 **Release** workflow
3. 点击 **"Run workflow"** 按钮
4. 选择版本类型 (e.g., **patch**)
5. 点击 **"Run workflow"** 确认

> ⚠️ **警告**: 这会创建真实的 Release 和 NPM 版本!
> 建议先在测试仓库中验证

**预期输出**:
- ✅ GitHub Release 已创建
- ✅ NPM 包已发布
- ✅ 版本标签已推送

---

## 🔍 Step 5: 监控和故障排除

### 查看工作流执行状态

1. 仓库主页 → **Actions** 标签
2. 选择要查看的 workflow
3. 查看执行历史和日志

### 常见错误和解决方案

#### ❌ Error: "npm publish: 403 Forbidden"

**原因**: NPM_TOKEN 无效或权限不足
**解决**:
```bash
# 重新生成 NPM token
npm token list  # 检查现有 tokens
npm token revoke {OLD_TOKEN_ID}  # 删除旧 token
npm token create  # 生成新 token

# 更新 GitHub Secret
# GitHub Settings → Secrets → Edit NPM_TOKEN
```

#### ❌ Error: "permission denied to write to repository"

**原因**: GitHub Actions 没有写入权限
**解决**:
```yaml
# 在 workflow 文件中添加:
permissions:
  contents: write
  packages: write
  pages: write
```

#### ❌ Error: gh-pages deployment failed

**原因**: GitHub Pages 未启用或配置错误
**解决**:
```
Settings → Pages → 
  - Source: Deploy from a branch
  - Branch: gh-pages
  - Folder: / (root)
```

#### ❌ Error: "node_modules not found"

**原因**: npm install 失败
**解决**:
```yaml
- name: Install dependencies
  run: npm ci --legacy-peer-deps  # 使用 ci 代替 install
```

---

## 📊 Secrets & Environment Variables Reference

### Repository Secrets

| Secret Name | Required? | Purpose | Source |
|-------------|-----------|---------|--------|
| `NPM_TOKEN` | ✅ Yes | NPM package publishing | npm.js.com → Tokens |
| `GH_TOKEN` | ❌ Optional | GitHub API calls (advanced) | GitHub Settings → Developer settings |
| `DEPLOY_KEY` | ❌ Optional | SSH deploy (if not using default) | GitHub SSH keys |

### Environment Variables (in workflow)

```yaml
env:
  NODE_VERSION: '16'          # Node.js version
  NPM_REGISTRY: 'https://registry.npmjs.com'
  BUILD_CMD: 'npm run dist'   # Build command
```

---

## 🎯 Workflow Permissions

确保工作流有正确的权限:

```yaml
permissions:
  contents: write          # Git push, create releases
  packages: write          # NPM package publishing  
  pages: write            # GitHub Pages deployment
  pull-requests: write    # Create PRs
  actions: read           # Read workflow status
```

---

## 🚀 Step 6: 首次发布

### 准备首次发布

1. **确保代码已构建**
   ```bash
   npm run dist
   ```

2. **检查版本号**
   ```bash
   cat package.json | grep version
   # "version": "2.15.15"
   ```

3. **验证 Secrets 已配置**
   ```
   Settings → Secrets → 检查 NPM_TOKEN
   ```

4. **执行首次发布**
   ```
   Actions → Release → Run workflow → patch → Run
   ```

5. **验证发布成功**
   ```bash
   npm view element-ui version              # 检查 NPM
   npm view element-ui dist-tags            # 检查 tags
   npm info element-ui@latest               # 检查最新版本
   ```

---

## 📈 监控和维护

### 定期检查

- **每周**: 检查 Actions 日志中是否有失败
- **每月**: 验证 NPM_TOKEN 仍有效
- **每季度**: 更新依赖和工作流 actions 版本

### 保持工作流最新

```bash
# 定期更新 GitHub Actions 版本
# 检查新的 actions 版本，例如:
# actions/checkout@v4 (latest)
# actions/setup-node@v4 (latest)
```

---

## ✅ 完整检查清单

部署前验证所有配置:

- [ ] NPM_TOKEN secret 已添加
- [ ] NPM token 有发布权限
- [ ] GitHub Pages 已启用
- [ ] `.github/workflows/` 中所有 `.yml` 文件无语法错误
- [ ] 所有工作流有 `permissions` 配置
- [ ] package.json 版本号正确
- [ ] CHANGELOG.md 格式正确
- [ ] README.md 中有预览链接占位符
- [ ] 至少一次成功的工作流运行
- [ ] NPM 包可正常安装测试

---

## 🔗 相关文档

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **NPM Token Guide**: https://docs.npmjs.com/creating-and-viewing-access-tokens
- **GitHub Pages Setup**: https://docs.github.com/en/pages
- **Release Guide**: [RELEASE_GUIDE.md](./RELEASE_GUIDE.md)
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Quick Reference**: [RELEASE_QUICK_REFERENCE.md](./RELEASE_QUICK_REFERENCE.md)

---

## 💡 提示与最佳实践

### Security Best Practices

1. **定期轮换 NPM Token**
   ```bash
   npm token revoke {OLD_TOKEN}  # 删除旧 token
   npm token create              # 创建新 token
   # 更新 GitHub Secret
   ```

2. **使用最少权限原则**
   ```yaml
   permissions:
     contents: write    # 仅需要必要权限
     packages: write
   ```

3. **不要在日志中泄露 Secrets**
   ```yaml
   run: npm publish  # 👍 NPM_TOKEN 自动 masked
   run: echo $NPM_TOKEN  # ❌ 不要这样做
   ```

### Performance Optimization

1. **使用 npm ci 代替 npm install**
   ```yaml
   - run: npm ci --legacy-peer-deps
   ```

2. **缓存 node_modules**
   ```yaml
   - uses: actions/cache@v3
     with:
       path: node_modules
       key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
   ```

3. **并行运行独立 jobs**
   ```yaml
   jobs:
     build:
       runs-on: ubuntu-latest
     test:
       runs-on: ubuntu-latest
   ```
