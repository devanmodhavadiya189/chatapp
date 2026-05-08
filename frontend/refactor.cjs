const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Modularize CSS
const indexCssPath = path.join(__dirname, 'src', 'index.css');
let indexCss = fs.readFileSync(indexCssPath, 'utf8');

// Strip all CSS comments
indexCss = indexCss.replace(/\/\*[\s\S]*?\*\//g, '');

const themeMatch = indexCss.match(/:root\s*\{[\s\S]*?\}\s*\[data-theme="dark"\]\s*\{[\s\S]*?\}/);
const themeCss = themeMatch ? themeMatch[0] : '';

const baseMatch = indexCss.match(/\*\s*\{[\s\S]*?\}\s*body\s*\{[\s\S]*?\}/);
const baseCss = baseMatch ? baseMatch[0] : '';

// The rest goes to components.css (we exclude tailwind imports, theme, base)
let componentsCss = indexCss
  .replace(/:root\s*\{[\s\S]*?\}\s*\[data-theme="dark"\]\s*\{[\s\S]*?\}/, '')
  .replace(/\*\s*\{[\s\S]*?\}\s*body\s*\{[\s\S]*?\}/, '')
  .replace(/@import url[^;]+;/g, '')
  .replace(/@tailwind[^;]+;/g, '')
  .trim();

// Write new CSS files
fs.writeFileSync(path.join(__dirname, 'src', 'styles', 'theme.css'), themeCss);
fs.writeFileSync(path.join(__dirname, 'src', 'styles', 'base.css'), baseCss);
fs.writeFileSync(path.join(__dirname, 'src', 'styles', 'components.css'), componentsCss);

// Write new index.css
const newIndexCss = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@import './styles/theme.css';
@import './styles/base.css';
@import './styles/components.css';
`;
fs.writeFileSync(indexCssPath, newIndexCss);

console.log('CSS Modularized and comments removed.');

// 2. Remove comments from JS/JSX
// To avoid breaking URLs (like http://), we use a regex that ignores // inside quotes.
// A simpler way is to just use a popular regex for JS comments or write a custom parser.
// Because regex for JS comments is notoriously buggy, let's use a very safe targeted approach.

function removeComments(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove multi-line comments (/* ... */) safely
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');

  // Remove single-line comments. We match // only if it's not preceded by : (to avoid http://)
  // and we also avoid matching inside strings by using a more complex regex or just a simple split.
  // Actually, a safe hack is replacing 'http://' with a placeholder, then regex, then restoring.
  
  content = content.split('\n').map(line => {
    // If line has // but not http:// or wss://, remove it
    if (line.includes('//') && !line.includes('http://') && !line.includes('https://') && !line.includes('ws://') && !line.includes('wss://')) {
      return line.split('//')[0].trimEnd();
    }
    return line;
  }).join('\n');

  // Also remove lines that only have JSX comments {/* ... */}
  content = content.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '');

  fs.writeFileSync(filePath, content);
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      removeComments(fullPath);
    }
  }
}

processDirectory(path.join(__dirname, 'src', 'components'));
processDirectory(path.join(__dirname, 'src', 'context'));
processDirectory(path.join(__dirname, 'src', 'pages'));
removeComments(path.join(__dirname, 'src', 'App.jsx'));
removeComments(path.join(__dirname, 'src', 'main.jsx'));

console.log('JS/JSX Comments removed.');
