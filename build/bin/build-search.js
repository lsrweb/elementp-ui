const fs = require('fs');
const path = require('path');
const langs = ['zh-CN', 'en-US', 'es', 'fr-FR'];

let searchData = {};

langs.forEach(lang => {
  searchData[lang] = [];
  const dir = path.resolve(__dirname, '../../examples/docs/' + lang);
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  files.forEach(file => {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const compName = file.replace('.md', '');

    const titleMatch = content.match(/^##\s+(.+)/m);
    const title = titleMatch ? titleMatch[1].trim() : compName;

    searchData[lang].push({
      title: title,
      path: '/' + lang + '/component/' + compName,
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
