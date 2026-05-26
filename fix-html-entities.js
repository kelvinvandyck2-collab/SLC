/**
 * Fixes HTML entity encoding (&amp; → &, &apos; → ', etc.) in all DB records
 * that were incorrectly stored with HTML entities.
 */
const { Client } = require('pg');
require('dotenv').config();

function decodeEntities(str) {
    return str
        .replace(/&amp;/g, '&')
        .replace(/&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}

const c = new Client({
    connectionString: process.env.POSTGRES_URL_NON_POOLING.split('?')[0],
    ssl: { rejectUnauthorized: false }
});

c.connect().then(async () => {
    // Get all rows that contain &amp;
    const r = await c.query(
        "SELECT section_key, content FROM site_content WHERE content LIKE '%&amp;%' AND section_key != 'admin_password'"
    );

    console.log(`Found ${r.rows.length} rows with HTML entities to fix:\n`);

    for (const row of r.rows) {
        const fixed = decodeEntities(row.content);
        await c.query(
            'UPDATE site_content SET content = $1 WHERE section_key = $2',
            [fixed, row.section_key]
        );
        console.log(`  ✓ ${row.section_key}`);
        console.log(`    Before: "${row.content.substring(0, 80)}"`);
        console.log(`    After:  "${fixed.substring(0, 80)}"\n`);
    }

    console.log(`Done. Fixed ${r.rows.length} records.`);
    await c.end();
}).catch(e => {
    console.error('Failed:', e.message);
    c.end();
});
