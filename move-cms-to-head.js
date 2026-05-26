const fs = require('fs');
const path = require('path');

const base = 'c:\\Users\\DELL\\Desktop\\LAW';
const files = [];

['index.html', 'about.html', 'team.html', 'contact.html'].forEach(f => {
    files.push(path.join(base, f));
});

const practiceDir = path.join(base, 'practice');
fs.readdirSync(practiceDir).forEach(f => {
    if (f.endsWith('.html')) files.push(path.join(practiceDir, f));
});

let updated = 0;

files.forEach(filePath => {
    let html = fs.readFileSync(filePath, 'utf8');
    const isSubpage = filePath.includes('\\practice\\');
    const src = isSubpage ? '../cms-loader.js' : 'cms-loader.js';

    const scriptTag = `<script src="${src}"></script>`;
    const deferTag  = `<script src="${src}" defer></script>`;

    if (!html.includes(scriptTag) && !html.includes(deferTag)) {
        console.log(`  SKIP ${path.basename(filePath)}`);
        return;
    }

    // Remove old tag
    html = html.replace(scriptTag, '');
    html = html.replace(deferTag, '');
    // Clean up extra blank lines
    html = html.replace(/(\r?\n){3,}/g, '\n\n');

    // Inject defer tag before </head>
    html = html.replace('</head>', `    <script src="${src}" defer></script>\n</head>`);

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`  ✓ ${path.basename(filePath)}`);
    updated++;
});

console.log(`\nDone. Updated ${updated} files.`);
