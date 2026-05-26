const { Client } = require('pg');
require('dotenv').config();
const c = new Client({ connectionString: process.env.POSTGRES_URL_NON_POOLING.split('?')[0], ssl:{rejectUnauthorized:false} });
c.connect().then(async () => {
  const r = await c.query("SELECT section_key, SUBSTRING(content,1,50) as preview FROM site_content WHERE section_key LIKE 'practice_%' ORDER BY section_key");
  console.log('Practice keys in DB:');
  r.rows.forEach(row => console.log(row.section_key + ' = ' + row.preview));
  await c.end();
}).catch(e => { console.error(e.message); c.end(); });
