# Release Workflow Quick Reference

## 🎯 3 Ways to Release New Version

### **Way 1: Manual Release** (推荐)
**何时使用**: 想要完全控制发布流程和版本管理

1. **打开 GitHub Actions**
   - 进入仓库 → Actions 标签
   - 选择 "Release" workflow
   - 点击 "Run workflow"

2. **选择版本类型**
   ```
   patch  - 2.15.15 → 2.15.16  (修复)
   minor  - 2.15.15 → 2.16.0   (新功能)
   major  - 2.15.15 → 3.0.0    (重大升级)
   ```

3. **确认执行**
   - 工作流自动执行 (3-5 分钟)
   - GitHub Release 自动创建
   - NPM 自动发布

---

### **Way 2: Auto Release** (最快)
**何时使用**: 想要全自动发布，无需手动干预

1. **修改版本号**
   ```bash
   # 编辑 package.json
   "version": "2.15.16"
   ```

2. **提交代码**
   ```bash
   git commit -m "chore: bump version to 2.15.16"
   git push origin main
   ```

3. **工作流自动执行**
   - auto-release.yml 自动触发
   - GitHub Release 自动创建
   - NPM 自动发布
   - README 自动更新

---

### **Way 3: Dev Branch Preview** (测试)
**何时使用**: 想要发布预览版本供内部测试

1. **推送到 dev 分支**
   ```bash
   git push origin dev
   ```

2. **预览地址自动生成**
   ```
   https://element-ui-ui.github.io/element/dev/
   ```

3. **收集反馈后合并到 main**
   ```bash
   git checkout main
   git pull origin main
   git merge dev
   git push origin main
   ```

---

## 📋 Workflows 概览表

| Workflow | 触发条件 | 用途 | 时长 |
|----------|---------|------|------|
| **deploy-docs.yml** | 推送到 main/dev | 自动构建和部署文档 | 2-3 分钟 |
| **release.yml** | 手动触发 (Actions UI) | 创建 Release + NPM 发布 | 3-5 分钟 |
| **auto-release.yml** | 推送到 main (版本更新) | 自动创建 Release 和发布 | 3-5 分钟 |
| **update-preview-urls.yml** | Release 发布时 | 自动更新 README 预览链接 | 1-2 分钟 |

---

## 🔧 一分钟诊断

### ❓ 我的 Release 工作流为什么没运行？

**检查清单:**
- [ ] GitHub Actions 功能已启用? (Settings → Actions → General)
- [ ] 工作流 `.yml` 文件在 `.github/workflows/` 目录?
- [ ] 工作流 `on.workflow_dispatch` 配置正确?
- [ ] 检查 Actions 标签下是否有该工作流列表?

### ❓ NPM 发布失败

**检查清单:**
- [ ] Settings → Secrets → 已添加 `NPM_TOKEN`?
- [ ] NPM token 有发布权限?
  ```bash
  npm profile list  # 验证权限
  ```
- [ ] 该版本在 NPM 上尚未发布?
  ```bash
  npm view element-ui version  # 查看已发布版本
  ```

### ❓ 部署到预览地址失败

**检查清单:**
- [ ] Settings → Pages → Source 已设置为 `gh-pages` 分支?
- [ ] 工作流有正确的写入权限?
  ```yaml
  permissions:
    contents: write
    pages: write
  ```
- [ ] 预览域名配置正确?

---

## 📦 完整发布流程示例

### 情景: 发布 Element UI v2.16.0 (新功能版本)

```bash
# ====== 开发阶段 (在 dev 分支) ======
git checkout dev
# 编写新功能...
git commit -m "feat: add new component"
git push origin dev

# 验证 dev 分支预览
# https://element-ui-ui.github.io/element/dev/  ✅

# ====== 代码审核 & 合并 ======
# 创建 PR: dev → main
# 收集代码评审意见
# 合并到 main 分支

# ====== 发布版本 ======
# 方式 A: 手动发布 (推荐)
#   1. GitHub → Actions → Release → Run workflow
#   2. 选择版本: minor (2.15.15 → 2.16.0)
#   3. 点击运行 ✅

# 方式 B: 自动发布
#   1. 编辑 package.json → "version": "2.16.0"
#   2. git commit -m "chore: bump version to 2.16.0"
#   3. git push origin main ✅

# ====== 验证发布 ======
npm view element-ui@2.16.0 version      # 检查 NPM 已发布
# https://github.com/org/element/releases/tag/v2.16.0  # 检查 Release
# https://element-ui-ui.github.io/element/v2.16.0/     # 检查预览
# https://www.npmjs.com/package/element-ui              # 检查包 ✅
```

---

## 🚀 高级配置

### A. 自定义 Changelog 模板

编辑 `.github/workflows/release.yml`:
```yaml
- name: Generate Changelog
  run: |
    echo "## Features" >> CHANGELOG.tmp.md
    git log main..dev --oneline --grep="feat" >> CHANGELOG.tmp.md
    # 自定义你的 changelog 格式
```

### B. 自定义版本号格式

编辑 `build/bin/update-version.js`:
```javascript
// 支持 alpha/beta 预发布版本
if (prerelease) {
  newVersion = `${major}.${minor}.${patch}-alpha.${alphaNum}`;
}
```

### C. 条件发布 (仅发布测试通过的版本)

修改 `release.yml`:
```yaml
- name: Run Tests
  run: npm test
  
- name: Publish
  if: success()  # 仅测试通过时发布
  run: npm publish
```

---

## 📞 常见命令速查

```bash
# 查看已发布版本
npm view element-ui versions

# 查看最新版本
npm view element-ui version

# 查看 dist-tags (main/dev/next 等)
npm view element-ui dist-tags

# 模拟发布 (不实际上传)
npm publish --dry-run

# 查看准备发布的文件
npm pack

# 生成本地 tarball
npm pack --dry-run
```

---

## ✅ 发布前检查表

- [ ] 所有分支都已同步
- [ ] 最新的改动已提交
- [ ] npm run lint 通过
- [ ] npm test 通过
- [ ] npm run dist 成功构建
- [ ] CHANGELOG.md 已更新
- [ ] package.json 版本正确
- [ ] NPM_TOKEN secret 已配置
- [ ] GitHub Pages 已启用

---

## 📚 相关文档

- **详细指南**: [RELEASE_GUIDE.md](./RELEASE_GUIDE.md)
- **部署架构**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **GitHub Actions**: https://docs.github.com/en/actions
- **NPM 发布**: https://docs.npmjs.com/cli/v8/commands/npm-publish
