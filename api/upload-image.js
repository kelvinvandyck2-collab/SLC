export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://uwhujavrrdzzwxunrlzu.supabase.co';
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3aHVqYXZycmR6end4dW5ybHp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDkzMTUwMCwiZXhwIjoyMDg2NTA3NTAwfQ.kX3y7OUPDeOa20tlR_aWQSLPZqycm10QCsBcMDu-AtY';
  const BUCKET = 'team-photos';

  const { password, imageData, filename } = req.body || {};

  const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'SpringLegal2026!';
  if (!password || password !== DEFAULT_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  if (!imageData || !filename) {
    return res.status(400).json({ error: 'Missing imageData or filename' });
  }

  try {
    // Strip the data URL prefix, e.g. "data:image/jpeg;base64,"
    const base64Match = imageData.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9+.]+);base64,(.+)$/);
    if (!base64Match) {
      return res.status(400).json({ error: 'Invalid image data format' });
    }
    const mimeType = base64Match[1];
    const base64String = base64Match[2];
    const imageBuffer = Buffer.from(base64String, 'base64');

    // Generate a unique filename with timestamp
    const ext = mimeType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
    const safeName = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_').toLowerCase();
    const uniqueFilename = `${Date.now()}_${safeName.replace(/\.[^.]+$/, '')}.${ext}`;

    // Upload to Supabase Storage
    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${uniqueFilename}`;
    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': mimeType,
        'x-upsert': 'true'
      },
      body: imageBuffer
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      // If bucket doesn't exist yet, try to create it then retry
      if (uploadRes.status === 404 || errText.includes('not found') || errText.includes('Bucket not found')) {
        const createRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true, file_size_limit: 5242880 })
        });

        if (!createRes.ok) {
          const createErr = await createRes.text();
          // Bucket may already exist (409), that's fine — continue
          if (!createErr.includes('already exists')) {
            console.error('Bucket creation failed:', createRes.status, createErr);
            return res.status(500).json({ error: 'Storage bucket unavailable', details: createErr });
          }
        }

        // Retry upload after bucket creation
        const retryRes = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': mimeType,
            'x-upsert': 'true'
          },
          body: imageBuffer
        });

        if (!retryRes.ok) {
          const retryErr = await retryRes.text();
          console.error('Upload retry failed:', retryRes.status, retryErr);
          return res.status(500).json({ error: 'Image upload failed after retry', details: retryErr });
        }
      } else {
        console.error('Upload failed:', uploadRes.status, errText);
        return res.status(500).json({ error: 'Image upload failed', details: errText });
      }
    }

    // Build the public URL
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${uniqueFilename}`;
    return res.status(200).json({ url: publicUrl });

  } catch (e) {
    console.error('Upload exception:', e);
    return res.status(500).json({ error: 'Server error during upload', details: e.message });
  }
}
