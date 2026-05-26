/**
 * Replaces the cta-box on all practice pages with the team-page style CTA:
 * - navy-wash background, centered, bordered
 * - "Call Us Now" button FIRST, then "Request a Consultation"
 */
const fs = require('fs');
const path = require('path');

const practiceDir = 'c:\\Users\\DELL\\Desktop\\LAW\\practice';
const files = fs.readdirSync(practiceDir).filter(f => f.endsWith('.html'));

let updated = 0;

files.forEach(file => {
    const filePath = path.join(practiceDir, file);
    let html = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

    // Match the entire cta-box div and replace with team-style layout
    html = html.replace(
        /<div class="cta-box">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
        (match) => {
            // Extract the CMS keys from h4 and p
            const h4Match = match.match(/data-cms="([^"]+)"[^>]*>([^<]+)<\/h4>/);
            const pMatch  = match.match(/<p data-cms="([^"]+)"[^>]*>([^<]+)<\/p>/);

            const h4Key  = h4Match ? h4Match[1] : '';
            const h4Text = h4Match ? h4Match[2].trim() : '';
            const pKey   = pMatch  ? pMatch[1]  : '';
            const pText  = pMatch  ? pMatch[2].trim()  : '';

            return `<div class="cta-box">
                            <h4 class="serif"${h4Key ? ` data-cms="${h4Key}"` : ''}>${h4Text}</h4>
                            <p${pKey ? ` data-cms="${pKey}"` : ''}>${pText}</p>
                            <div class="cta-box-btns">
                                <a href="tel:+2330302201530" class="btn btn-outline"><i class="fa-solid fa-phone"></i> Call Us Now</a>
                                <a href="../contact.html" class="btn btn-primary"><i class="fa-solid fa-paper-plane"></i> Request a Consultation</a>
                            </div>
                        </div>
                    </div>
                </div>`;
        }
    );

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`  ✓ ${file}`);
    updated++;
});

console.log(`\nDone. Updated ${updated} files.`);
