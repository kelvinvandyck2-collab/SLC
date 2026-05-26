/**
 * Updates the CTA box HTML structure in all 9 practice pages
 * to use the new premium dark CTA design with cta-box-text + cta-actions layout.
 */
const fs = require('fs');
const path = require('path');

const practiceDir = 'c:\\Users\\DELL\\Desktop\\LAW\\practice';
const files = fs.readdirSync(practiceDir).filter(f => f.endsWith('.html'));

let updated = 0;

files.forEach(file => {
    const filePath = path.join(practiceDir, file);
    let html = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

    // Match the cta-box div and restructure it
    // Old pattern:
    // <div class="cta-box">
    //     <h4 class="serif" data-cms="...">...</h4>
    //     <p data-cms="...">...</p>
    //     <a href="../contact.html" class="btn btn-primary">...</a>
    //     <a href="tel:..." class="btn btn-outline" style="...">...</a>
    // </div>

    html = html.replace(
        /<div class="cta-box">\n([\s\S]*?)<\/div>/,
        (match, inner) => {
            // Extract parts
            const h4Match = inner.match(/<h4[^>]*>[\s\S]*?<\/h4>/);
            const pMatch  = inner.match(/<p[^>]*>[\s\S]*?<\/p>/);
            const btnPrimaryMatch = inner.match(/<a href="\.\.\/contact\.html" class="btn btn-primary"[^>]*>[\s\S]*?<\/a>/);
            const btnCallMatch    = inner.match(/<a href="tel:[^"]*" class="btn btn-outline"[^>]*>[\s\S]*?<\/a>/);

            const h4 = h4Match ? h4Match[0].trim() : '';
            const p  = pMatch  ? pMatch[0].trim()  : '';
            const btnPrimary = btnPrimaryMatch ? btnPrimaryMatch[0].trim() : '';
            // Rebuild call button with btn-call class
            let btnCall = btnCallMatch ? btnCallMatch[0]
                .replace(/class="btn btn-outline"/, 'class="btn-call"')
                .replace(/style="[^"]*"/, '')
                .trim() : '';

            return `<div class="cta-box">
                            <div class="cta-box-text">
                                ${h4}
                                ${p}
                            </div>
                            <div class="cta-actions">
                                ${btnPrimary}
                                ${btnCall}
                            </div>
                        </div>`;
        }
    );

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`  ✓ ${file}`);
    updated++;
});

console.log(`\nDone. Updated ${updated} files.`);
