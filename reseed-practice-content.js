/**
 * Re-seeds all practice area content from the actual HTML files into the database.
 * Parses the current HTML (which already has data-cms attributes) and extracts
 * the actual visible text content to populate the empty DB rows.
 */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const practiceDir = 'c:\\Users\\DELL\\Desktop\\LAW\\practice';
const files = [
  { file: 'aviation-law.html',         i: 1 },
  { file: 'corporate-commercial.html', i: 2 },
  { file: 'dispute-resolution.html',   i: 3 },
  { file: 'real-estate-property.html', i: 4 },
  { file: 'private-client-family.html',i: 5 },
  { file: 'banking-finance.html',       i: 6 },
  { file: 'civil-construction.html',    i: 7 },
  { file: 'insurance-claims.html',      i: 8 },
  { file: 'natural-resources-law.html', i: 9 },
];

function stripTags(html) {
  return html.replace(/<[^>]+>/g, '').trim();
}

function extractCmsValues(html, idx) {
  const seeds = [];

  // Helper: extract content of a tag with data-cms attribute
  function getCms(key) {
    const re = new RegExp(`data-cms="${key}"[^>]*>([\\s\\S]*?)<\\/`, '');
    const m = html.match(re);
    return m ? stripTags(m[1]) : '';
  }

  // Banner
  seeds.push([`practice_${idx}_banner_title`, getCms(`practice_${idx}_banner_title`)]);
  seeds.push([`practice_${idx}_banner_sub`,   getCms(`practice_${idx}_banner_sub`)]);

  // Heading
  seeds.push([`practice_${idx}_heading`, getCms(`practice_${idx}_heading`)]);

  // P1 & P2
  seeds.push([`practice_${idx}_p1`, getCms(`practice_${idx}_p1`)]);
  seeds.push([`practice_${idx}_p2`, getCms(`practice_${idx}_p2`)]);

  // Bullets — extract all <li> items from the service-list
  const listMatch = html.match(/<ul class="service-list"[^>]*>([\s\S]*?)<\/ul>/);
  if (listMatch) {
    const liMatches = [...listMatch[1].matchAll(/<li>([\s\S]*?)<\/li>/g)];
    const bullets = liMatches.map(m => stripTags(m[1]));
    seeds.push([`practice_${idx}_bullets`, bullets.join('\n')]);
  } else {
    seeds.push([`practice_${idx}_bullets`, '']);
  }

  // Why text
  seeds.push([`practice_${idx}_why`, getCms(`practice_${idx}_why`)]);

  // CTA
  seeds.push([`practice_${idx}_cta_title`, getCms(`practice_${idx}_cta_title`)]);
  seeds.push([`practice_${idx}_cta_text`,  getCms(`practice_${idx}_cta_text`)]);

  return seeds;
}

const c = new Client({
  connectionString: process.env.POSTGRES_URL_NON_POOLING.split('?')[0],
  ssl: { rejectUnauthorized: false }
});

c.connect().then(async () => {
  console.log('Connected. Re-seeding practice content from HTML files...\n');
  let total = 0;

  for (const { file, i } of files) {
    const filePath = path.join(practiceDir, file);
    const html = fs.readFileSync(filePath, 'utf8');
    const seeds = extractCmsValues(html, i);

    for (const [key, val] of seeds) {
      await c.query(
        'INSERT INTO site_content (section_key, content) VALUES ($1, $2) ON CONFLICT (section_key) DO UPDATE SET content = EXCLUDED.content',
        [key, val]
      );
      console.log(`  ${key}: "${val.substring(0, 60)}${val.length > 60 ? '...' : ''}"`);
      total++;
    }
    console.log(`✓ ${file} done\n`);
  }

  console.log(`\nDone! Updated ${total} records.`);
  await c.end();
}).catch(e => {
  console.error('Failed:', e.message);
  c.end();
});
