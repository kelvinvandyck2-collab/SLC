const { Client } = require('pg');
require('dotenv').config();

const c = new Client({
  connectionString: process.env.POSTGRES_URL_NON_POOLING.split('?')[0],
  ssl: { rejectUnauthorized: false }
});

c.connect().then(async () => {
  const heroTitle = 'Legal clarity for<br><span class="highlight">high-stakes</span><br>decisions.';
  await c.query(
    'INSERT INTO site_content (section_key, content) VALUES ($1, $2) ON CONFLICT (section_key) DO UPDATE SET content = EXCLUDED.content',
    ['hero_title', heroTitle]
  );
  console.log('hero_title seeded successfully!');
  await c.end();
}).catch(e => {
  console.error('Failed:', e.message);
  c.end();
});
