const fs = require('fs');
const path = require('path');
const langs = ['zh-CN', 'en-US', 'es', 'fr-FR'];
const navConfig = require('../../examples/nav.config.json');

let searchData = {};

function collectPages(navs, pages = []) {
  navs.forEach(nav => {
    if (nav.href) return;

    if (nav.groups) {
      nav.groups.forEach(group => collectPages(group.list, pages));
      return;
    }

    if (nav.children) {
      collectPages(nav.children, pages);
      return;
    }

    pages.push(nav);
  });

  return pages;
}

langs.forEach(lang => {
  searchData[lang] = [];
  const dir = path.resolve(__dirname, '../../examples/docs/' + lang);
  if (!fs.existsSync(dir)) return;

  const pages = collectPages(navConfig[lang] || []);
  pages.forEach(page => {
    if (!page.path) return;

    const filePath = path.join(dir, page.path.replace(/^\//, '') + '.md');
    if (!fs.existsSync(filePath)) return;

    const content = fs.readFileSync(filePath, 'utf8');
    const compName = page.path.replace(/^\//, '');

    const titleMatch = content.match(/^##\s+(.+)/m);
    const title = titleMatch ? titleMatch[1].trim() : (page.title || page.name || compName);

    searchData[lang].push({
      title: title,
      path: '/' + lang + '/component' + page.path,
      type: 'component',
      body: ''
    });

    const lines = content.split('\n');
    let currentSection = '';
    lines.forEach(line => {
      if (line.match(/^###\s+(.+)/)) {
        currentSection = line.replace(/^###\s+/, '').trim();
      }
      if (line.startsWith('|') && !line.match(/^\|\s*-/)) {
        const parts = line.split('|').map(s => s.trim()).filter(s => s);
        if (parts.length >= 2 && parts[0] !== '参数' && parts[0] !== '方法名' && parts[0] !== 'Attribute' && parts[0] !== 'Method') {
          searchData[lang].push({
            title: title + ' > ' + currentSection,
            path: '/' + lang + '/component/' + compName,
            type: 'param',
            body: parts[0] + ' : ' + parts[1]
          });
        }
      }
    });
  });
});

fs.writeFileSync(path.resolve(__dirname, '../../examples/search-meta.json'), JSON.stringify(searchData));
