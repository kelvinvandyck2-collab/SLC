const fs = require('fs');
const path = require('path');

const practiceDir = 'c:\\Users\\DELL\\Desktop\\LAW\\practice';
const files = fs.readdirSync(practiceDir).filter(f => f.endsWith('.html'));

const OLD_CARD = `<div class="sidebar-card sidebar-contact">
                            <h4 class="serif">Speak to a Lawyer</h4>
                            <p>Get expert legal advice tailored to your specific situation.</p>
                            <a href="tel:+2330302201530" class="btn btn-outline btn-block"><i class="fa-solid fa-phone"></i> Call Us</a>
                            <a href="../contact.html" class="btn btn-primary btn-block"><i class="fa-solid fa-envelope"></i> Send a Message</a>
                        </div>`;

const NEW_CARD = `<div class="sidebar-card sidebar-contact">
                            <h4 class="serif">Request a Consultation</h4>
                            <a href="tel:+2330302201530" class="btn btn-outline btn-block" style="margin-bottom:12px;"><i class="fa-solid fa-phone"></i> Call Us</a>
                            <a href="../contact.html" class="btn btn-primary btn-block"><i class="fa-solid fa-envelope"></i> Send a Message</a>
                        </div>`;

let updated = 0;

files.forEach(file => {
    const filePath = path.join(practiceDir, file);
    let html = fs.readFileSync(filePath, 'utf8');

    // Normalize line endings for matching
    const normalized = html.replace(/\r\n/g, '\n');

    const oldNorm = OLD_CARD.replace(/\r\n/g, '\n');
    const newNorm = NEW_CARD.replace(/\r\n/g, '\n');

    if (normalized.includes(oldNorm)) {
        const fixed = normalized.replace(oldNorm, newNorm);
        fs.writeFileSync(filePath, fixed, 'utf8');
        console.log(`  ✓ ${file}`);
        updated++;
    } else {
        // Try a more flexible match using regex
        const pattern = /<div class="sidebar-card sidebar-contact">[\s\S]*?<\/div>/;
        if (pattern.test(normalized)) {
            const fixed = normalized.replace(pattern, newNorm);
            fs.writeFileSync(filePath, fixed, 'utf8');
            console.log(`  ✓ ${file} (regex match)`);
            updated++;
        } else {
            console.log(`  SKIP ${file} — pattern not found`);
        }
    }
});

console.log(`\nDone. Updated ${updated} / ${files.length} files.`);
