export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://uwhujavrrdzzwxunrlzu.supabase.co';
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3aHVqYXZycmR6end4dW5ybHp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDkzMTUwMCwiZXhwIjoyMDg2NTA3NTAwfQ.kX3y7OUPDeOa20tlR_aWQSLPZqycm10QCsBcMDu-AtY';
  const { password, updates } = req.body;

  if (!password || !updates || !Array.isArray(updates)) {
    return res.status(400).json({ error: 'Missing password or updates' });
  }

  // Verify admin password
  const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'SpringLegal2026!';
  let authenticated = (password === DEFAULT_PASSWORD);

  if (!authenticated) {
    try {
      const pwRes = await fetch(`${SUPABASE_URL}/rest/v1/site_content?section_key=eq.admin_password&select=content`, {
        headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` }
      });
      if (pwRes.ok) {
        const pwRows = await pwRes.json();
        if (pwRows.length && pwRows[0].content === password) {
          authenticated = true;
        }
      }
    } catch (e) {}
  }

  if (!authenticated) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  // Apply updates
  let saved = 0, errors = 0;
  for (const { key, value } of updates) {
    if (key === 'admin_password') {
      errors++;
      continue;
    }
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/site_content?on_conflict=section_key`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({ section_key: key, content: String(value), updated_at: new Date().toISOString() })
      });
      if (r.ok) {
        saved++;
      } else {
        const errText = await r.text();
        console.error(`Supabase update failed for key ${key}:`, r.status, errText);
        errors++;
      }
    } catch (e) {
      console.error(`Fetch exception for key ${key}:`, e);
      errors++;
    }
  }

  if (errors > 0 && saved === 0) {
    return res.status(500).json({ error: 'Failed to write to cloud database', saved: 0, errors });
  }

  return res.status(200).json({ saved, errors });
}
