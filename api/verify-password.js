export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Missing password' });
  }

  try {
    const pwRes = await fetch(`${SUPABASE_URL}/rest/v1/site_content?section_key=eq.admin_password&select=content`, {
      headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` }
    });
    const pwRows = await pwRes.json();
    if (pwRows.length && pwRows[0].content === password) {
      return res.status(200).json({ success: true });
    }
    return res.status(401).json({ success: false, error: 'Invalid password' });
  } catch (e) {
    return res.status(500).json({ error: 'Verification failed' });
  }
}
