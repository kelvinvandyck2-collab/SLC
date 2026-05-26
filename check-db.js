const { Client } = require('pg');
require('dotenv').config();
const c = new Client({ connectionString: process.env.POSTGRES_URL_NON_POOLING.split('?')[0], ssl:{rejectUnauthorized:false} });
c.connect().then(async () => {
  const keys = ['hero_description', 'about_para_1', 'about_heading', 'hero_title', 'hero_tagline'];
  for (const key of keys) {
    const r = await c.query("SELECT section_key, content FROM site_content WHERE section_key=$1", [key]);
    if (r.rows[0]) {
      console.log(`\n[${key}]:\n  "${r.rows[0].content.substring(0, 120)}..."`);
    } else {
      console.log(`\n[${key}]: NOT IN DATABASE`);
    }
  }
  await c.end();
}).catch(e => { console.error(e.message); c.end(); });
