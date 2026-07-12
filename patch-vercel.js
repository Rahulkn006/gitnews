const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, 'node_modules', '@astrojs/vercel', 'dist', 'serverless', 'adapter.js'),
  path.join(__dirname, 'apps', 'astro-web', 'node_modules', '@astrojs/vercel', 'dist', 'serverless', 'adapter.js')
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('if (support === void 0) {') && !content.includes('return "nodejs20.x";')) {
      content = content.replace(
        'if (support === void 0) {', 
        'if (support === void 0) { return "nodejs20.x"; '
      );
      fs.writeFileSync(file, content);
      console.log('[patch-vercel] Successfully patched @astrojs/vercel adapter.js at ' + file);
    } else {
      console.log('[patch-vercel] Already patched or pattern not found at ' + file);
    }
  }
}
