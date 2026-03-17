# Deployment Architecture

Element UI documentation and releases are managed through GitHub Actions CI/CD pipelines.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Git Repository                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  dev branch  →  dev/ (preview)                         │ │
│  │  main branch →  v{version}/ + latest/ (production)    │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────────┘
                       │ push event
                       ▼
┌─────────────────────────────────────────────────────────────┐
│          GitHub Actions CI/CD Pipelines                      │
│                                                               │
│  ┌─ Work on dev branch ─────────────────────────────────┐   │
│  │ deploy-docs.yml                                       │   │
│  │ - Install dependencies                                │   │
│  │ - Build documentation                                 │   │
│  │ - Deploy to gh-pages/dev                              │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─ Manual Release to main ──────────────────────────────┐   │
│  │ release.yml (Manual Trigger)                          │   │
│  │ - Calculate new version (patch/minor/major)           │   │
│  │ - Update package.json + CHANGELOG.md                  │   │
│  │ - Create git tag + GitHub Release                     │   │
│  │ - Publish to NPM registry                             │   │
│  │ - Deploy docs + create preview URL                    │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─ Auto Release from main ──────────────────────────────┐   │
│  │ auto-release.yml (Auto Trigger)                       │   │
│  │ - Monitor main branch for version changes             │   │
│  │ - Create GitHub Release automatically                 │   │
│  │ - Publish to NPM if not already published             │   │
│  │ - Trigger update-preview-urls workflow                │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─ Update README ───────────────────────────────────────┐   │
│  │ update-preview-urls.yml                               │   │
│  │ - Get latest release info                             │   │
│  │ - Update preview URLs in README.md                    │   │
│  │ - Commit changes back to main                         │   │
│  └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              GitHub Pages Hosting                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ element/                     (gh-pages branch)         │ │
│  │  ├─ dev/                     (dev branch preview)      │ │
│  │  ├─ v2.15.15/               (specific version)        │ │
│  │  ├─ v2.15.14/               (previous versions)       │ │
│  │  ├─ v2.15.13/               ...                       │ │
│  │  └─ index.html              (latest)                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│         NPM Registry (@latest / @dev tags)                   │
│  element-ui@2.15.16 (latest)                                │
│  element-ui@2.15.15 (previous)                              │
│  element-ui@dev (development builds)                        │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Deployment Workflow

### Development Flow: Commits → dev branch preview

```
Your Code → git push origin dev
    ↓
deploy-docs.yml triggered
    ↓
npm run bootstrap
npm run dist
    ↓
Build outputs uploaded to gh-pages
    ↓
Preview deployed: https://element-ui-ui.github.io/element/dev/
```

**Speed**: ~2-3 minutes
**Audience**: Internal testing, early feedback
**Automatic**: On every dev branch push

### Release Flow: Manual trigger → production release

```
GitHub Actions UI → Select Release workflow
    ↓
Choose version type (patch/minor/major)
    ↓
release.yml executes:
  1. Read current version (e.g., 2.15.15)
  2. Bump to new version (e.g., 2.15.16 for patch)
  3. Generate CHANGELOG entries
  4. Git commit + tag
  5. Create GitHub Release (with changelog body)
  6. npm publish (requires NPM_TOKEN secret)
  7. Deploy production docs
    ↓
GitHub Release created: https://github.com/your-org/element/releases/tag/v2.15.16
NPM package published: https://www.npmjs.com/package/element-ui?activeTab=versions
Preview URL: https://element-ui-ui.github.io/element/v2.15.16/
```

**Speed**: ~3-5 minutes
**Audience**: Public npm registry users
**Manual**: Requires GitHub Actions UI trigger

### Auto Release Flow: Version commit → automatic publication

```
Commit to main with 'version' in message
    ↓
auto-release.yml triggered
    ↓
Check if version release already exists
    ↓
If new → auto-create GitHub Release + publish NPM
    ↓
update-preview-urls.yml auto-triggered
    ↓
README.md updated with latest preview URL
```

**Speed**: ~3-5 minutes
**Audience**: Automated, no manual intervention needed
**Automatic**: Monitors main branch

## 🔐 Required GitHub Repository Secrets

For NPM publishing to work, configure these secrets:

### Settings → Secrets and variables → Actions

| Secret | Value | How to Get |
|--------|-------|-----------|
| `NPM_TOKEN` | NPM authentication token | npm.js.com → Account Settings → Tokens → Create Token (Automation) |
| `GH_PAGES_DEPLOY_KEY` | GitHub Pages deploy key (optional) | Generated by GitHub Actions (if using default) |

### Configuration Steps

1. Go to repository Settings
2. Navigate to "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Name: `NPM_TOKEN` → Value: [paste your NPM token]
5. Click "Add secret"

**Testing NPM Token**:
```bash
npm whoami --registry https://registry.npmjs.com --auth-type=legacy
# Should output your npm username
```

## 📁 Deployment Directories

### GitHub Pages Structure

```
gh-pages branch:
/
├── dev/                    # Latest dev branch build
├── v2.15.16/              # Latest version (symlink or copy)
├── v2.15.15/              # Tagged release
├── v2.15.14/              # Previous tagged releases
├── v2.15.13/
└── index.html             # Points to latest or v{X.Y.Z}
```

### How versions are deployed:

- **dev branch**: Deployed to `/dev/` on every push
- **main branch**: Deployed to `/v{version}/` when release is created
- **Latest**: Either symlink or index.html redirect to newest version

## 🔄 Workflow Files

Located in `.github/workflows/`:

| File | Trigger | Purpose |
|------|---------|---------|
| `deploy-docs.yml` | Push to main/dev | Build & deploy docs |
| `release.yml` | Manual dispatch | Create release + publish |
| `auto-release.yml` | Push to main (version update) | Auto-publish release |
| `update-preview-urls.yml` | Release published | Update README URLs |
| `preview-build.yml` | Pull request | Build PR preview |
| `preview-deploy.yml` | PR review ready | Deploy PR preview |

## 🚨 Troubleshooting

### Q: Release workflow failed with "npm publish not found"

**A**: Your `NPM_TOKEN` secret is missing or invalid:
```bash
# Verify in repository Settings → Secrets
# Regenerate token at npm.js.com if needed
```

### Q: Deploy to gh-pages fails

**A**: Check that GitHub Pages is enabled:
```
Settings → Pages → Source: gh-pages branch
```

### Q: Version was bumped but no Release created

**A**: The auto-release workflow only triggers if commit message contains:
- `version` OR
- `chore:`

Make sure your commit message includes one of these keywords.

### Q: Dev branch not deploying

**A**: Ensure deploy-docs.yml includes dev:
```yaml
push:
  branches: [main, dev]
```

## 📈 Monitoring Deployments

### Check build status:
1. GitHub repository → "Actions" tab
2. Select workflow to view execution history
3. Click run to see detailed logs

### View deployed sites:
- Main docs: https://element-ui-ui.github.io/element/
- Dev preview: https://element-ui-ui.github.io/element/dev/
- Specific version: https://element-ui-ui.github.io/element/v{version}/

### Verify NPM publication:
```bash
# Check if latest version is published
npm view element-ui version
# Check dist tags
npm view element-ui dist-tags
```

## 📚 Related Documentation

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Deployment](https://docs.github.com/en/pages)
- [NPM Publishing](https://docs.npmjs.com/cli/v8/commands/npm-publish)
- [Creating Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
- [RELEASE_GUIDE.md](./RELEASE_GUIDE.md) - Workflow usage guide
