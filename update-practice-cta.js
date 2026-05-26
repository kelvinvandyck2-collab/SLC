/**
 * Updates all 9 practice pages:
 * 1. Remove the entire <aside class="content-sidebar"> (both sidebar cards)
 * 2. Add a "Call Us" button to the cta-box alongside "Request a Consultation"
 * 3. Remove the back-to-top button
 * 4. Make content-main full-width (no sidebar means no grid needed)
 */
const fs = require('fs');
const path = require('path');

const practiceDir = 'c:\\Users\\DELL\\Desktop\\LAW\\practice';
const files = fs.readdirSync(practiceDir).filter(f => f.endsWith('.html'));

let updated = 0;

files.forEach(file => {
    const filePath = path.join(practiceDir, file);
    let html = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

    // 1. Remove the entire <aside class="content-sidebar">...</aside>
    html = html.replace(/<aside class="content-sidebar">[\s\S]*?<\/aside>/g, '');

    // 2. Add "Call Us" button to the cta-box, after "Request a Consultation"
    // Old: <a href="../contact.html" class="btn btn-primary"><i class="fa-solid fa-paper-plane"></i> Request a Consultation</a>
    // New: same + Call Us button
    html = html.replace(
        /<a href="\.\.\/contact\.html" class="btn btn-primary"><i class="fa-solid fa-paper-plane"><\/i> Request a Consultation<\/a>/g,
        '<a href="../contact.html" class="btn btn-primary"><i class="fa-solid fa-paper-plane"></i> Request a Consultation</a>\n                            <a href="tel:+2330302201530" class="btn btn-outline" style="margin-left:12px;"><i class="fa-solid fa-phone"></i> Call Us</a>'
    );

    // 3. Remove back-to-top button
    html = html.replace(/<button class="back-to-top"[\s\S]*?<\/button>/g, '');

    // 4. Remove the back-to-top JS listener (the b= lines)
    html = html.replace(/\s*const b=document\.getElementById\('backToTopBtn'\);[\s\S]*?passive:true\}\);/g, '');

    // 5. Clean up extra blank lines left by removals
    html = html.replace(/\n{3,}/g, '\n\n');

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`  ✓ ${file}`);
    updated++;
});

console.log(`\nDone. Updated ${updated} / ${files.length} files.`);
