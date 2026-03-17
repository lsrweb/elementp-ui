#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * 根据 conventional commits 自动确定版本升级类型
 * feat: minor, fix: patch, BREAKING CHANGE: major
 */

function getCommitType() {
  try {
    // 获取上一个版本标签
    const lastTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();

    // 获取从上一个标签到 HEAD 的所有 commits
    const commits = execSync(`git log ${lastTag}..HEAD --oneline`, { encoding: 'utf8' });

    let hasMajor = false;
    let hasMinor = false;

    commits.split('\n').forEach(line => {
      if (line.includes('BREAKING CHANGE') || line.includes('BREAKING')) {
        hasMajor = true;
      }
      if (line.includes('feat:') || line.includes('feature:')) {
        hasMinor = true;
      }
    });

    if (hasMajor) return 'major';
    if (hasMinor) return 'minor';
    return 'patch';
  } catch (e) {
    return 'patch';
  }
}

function updateVersion() {
  const packageJsonPath = path.join(__dirname, '../../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const currentVersion = packageJson.version;
  const versionParts = currentVersion.split('.');
  const major = parseInt(versionParts[0], 10);
  const minor = parseInt(versionParts[1], 10);
  const patch = parseInt(versionParts[2], 10);

  const commitType = getCommitType();
  let newVersion;

  switch (commitType) {
    case 'major':
      newVersion = `${major + 1}.0.0`;
      break;
    case 'minor':
      newVersion = `${major}.${minor + 1}.0`;
      break;
    case 'patch':
    default:
      newVersion = `${major}.${minor}.${patch + 1}`;
  }

  packageJson.version = newVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

  console.log(`✓ Version updated: ${currentVersion} → ${newVersion} (${commitType})`);

  return newVersion;
}

if (require.main === module) {
  const newVersion = updateVersion();
  console.log(newVersion);
}

module.exports = { updateVersion, getCommitType };
