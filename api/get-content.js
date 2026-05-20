export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/site_content?select=section_key,content`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    let data = await r.json();
    if (Array.isArray(data)) {
      data = data.filter(row => row.section_key !== 'admin_password');
    }
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Failed to fetch content' });
  }
}
