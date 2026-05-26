const fs = require('fs');
const file = 'c:\\Users\\DELL\\Desktop\\LAW\\admin.html';
let html = fs.readFileSync(file, 'utf8');

// Find the broken part: after the reduce closes, team section title is orphaned
// We need to insert: Object.assign(sections, { team: {
// before '            title: \'Team Page & Members\','

const marker = "    }, {}));\n            title: 'Team Page & Members',";
const markerRaw = "    }, {}));\r\n            title: 'Team Page & Members',";

// Try with both line endings
let idx = html.indexOf(marker);
let useMarker = marker;
if (idx === -1) {
  idx = html.indexOf(markerRaw);
  useMarker = markerRaw;
}

if (idx === -1) {
  // Try finding just the orphaned title line
  const orphan = "            title: 'Team Page & Members',";
  idx = html.indexOf(orphan);
  if (idx === -1) {
    // Check what's actually at line 686
    const lines = html.split(/\r?\n/);
    console.log('Lines 683-695:');
    for (let i = 682; i < 695; i++) {
      console.log(`${i+1}: ${JSON.stringify(lines[i])}`);
    }
  } else {
    const newHtml = html.substring(0, idx) + 
      '    Object.assign(sections, {\n        team: {\n' + 
      html.substring(idx + orphan.length).trimStart();
    fs.writeFileSync(file, newHtml, 'utf8');
    console.log('Fixed with orphan marker');
  }
} else {
  const replacement = "    }, {}));\n    Object.assign(sections, {\n        team: {\n            title: 'Team Page & Members',";
  html = html.replace(useMarker, replacement);
  fs.writeFileSync(file, html, 'utf8');
  console.log('Fixed with full marker');
}
