#!/usr/bin/env node
/**
 * After `npm run dist` build, copy selected distributable artifacts
 * into a flat `dist/` directory root for direct consumption.
 *
 * Copies:
 *  - lib/index.js
 *  - lib/theme-chalk/index.css
 *  - lib/theme-chalk/fonts/ (font files)
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
// mapping: source -> destination filename (placed in dist root)
const fileMappings = [
  { src: 'lib/index.js', dest: 'index.min.js' },
  { src: 'lib/theme-chalk/index.css', dest: 'index.min.css' }
];
const fromFontsDir = 'lib/theme-chalk/fonts';
const targetRoot = path.join(root, 'dist');

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  console.log('[post-dist-copy] copied', path.relative(root, src), '->', path.relative(root, dest));
}

function run() {
  ensureDir(targetRoot);
  // clean legacy names if they exist (old script outputs)
  ['index.js', 'index.css'].forEach(name => {
    const fp = path.join(targetRoot, name);
    if (fs.existsSync(fp)) {
      try { fs.unlinkSync(fp); console.log('[post-dist-copy] removed old', name); } catch (e) { /* ignore */ }
    }
  });

  fileMappings.forEach(m => {
    const abs = path.join(root, m.src);
    if (!fs.existsSync(abs)) {
      console.warn('[post-dist-copy] missing', m.src);
      return;
    }
    const dest = path.join(targetRoot, m.dest);
    copyFile(abs, dest);
  });

  // fonts keep in subfolder dist/fonts
  const fontsAbs = path.join(root, fromFontsDir);
  if (fs.existsSync(fontsAbs)) {
    const distFonts = path.join(targetRoot, 'fonts');
    ensureDir(distFonts);
    fs.readdirSync(fontsAbs).forEach(f => {
      const src = path.join(fontsAbs, f);
      if (fs.statSync(src).isFile()) {
        copyFile(src, path.join(distFonts, f));
      }
    });
  } else {
    console.warn('[post-dist-copy] fonts directory missing:', fromFontsDir);
  }
}

run();
