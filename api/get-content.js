export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  try {
    if (SUPABASE_URL && SUPABASE_KEY) {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/site_content?select=section_key,content`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      });
      if (r.ok) {
        let data = await r.json();
        if (Array.isArray(data)) {
          data = data.filter(row => row.section_key !== 'admin_password');
          return res.status(200).json(data);
        }
      }
    }
  } catch (e) {
    console.warn('Supabase fetch failed in get-content:', e);
  }

  // Fallback content if database is unreachable or unavailable
  const FALLBACK_CONTENT = [
    { section_key: 'hero_badge', content: 'Delivering Legal Excellence Since 2012' },
    { section_key: 'hero_title', content: 'Legal clarity for<br><span class="highlight">high-stakes</span><br>decisions.' },
    { section_key: 'hero_tagline', content: 'Precision. Integrity. Results.' },
    { section_key: 'hero_description', content: 'Spring Legal Consultancy is a full-service corporate law firm in Accra, Ghana. We serve companies, institutions and private clients across corporate, aviation, litigation and regulatory matters — with bespoke solutions aligned to your strategic objectives.' },
    { section_key: 'hero_cta_consult', content: 'Schedule Consultation' },
    { section_key: 'hero_cta_explore', content: 'Explore Practice Areas' },
    { section_key: 'about_tag', content: 'About SLC' },
    { section_key: 'about_heading', content: 'A full-service corporate law firm built on integrity and results.' },
    { section_key: 'about_para_1', content: 'Spring Legal Consultancy (SLC) has evolved from a sole practitioner practice established in 2012 into a reputable partnership serving a broad and diverse clientele. We are guided by the highest standards of integrity, fairness, and professionalism, which define our approach to client service and legal practice.' },
    { section_key: 'about_para_2', content: 'Our multidisciplinary team of legal consultants and paralegals delivers bespoke legal solutions aligned with our clients\' strategic and commercial objectives.' },
    { section_key: 'about_para_3', content: 'Whether advising corporations on complex transactions or guiding individuals through sensitive personal matters, SLC brings the same commitment to excellence and the same dedication to protecting our clients\' interests.' },
    { section_key: 'about_banner_title', content: 'About Spring Legal Consultancy' },
    { section_key: 'about_banner_sub', content: 'A full-service law firm built on integrity, professionalism, and results since 2012.' },
    { section_key: 'about_stat_1_num', content: '2012' },
    { section_key: 'about_stat_1_label', content: 'Established' },
    { section_key: 'about_stat_2_num', content: '9+' },
    { section_key: 'about_stat_2_label', content: 'Practice Areas' },
    { section_key: 'about_stat_3_num', content: '3' },
    { section_key: 'about_stat_3_label', content: 'Partner Lawyers' },
    { section_key: 'about_stat_4_num', content: 'GBA' },
    { section_key: 'about_stat_4_label', content: 'Certified Counsel' },
    { section_key: 'team_banner_title', content: 'Our Team' },
    { section_key: 'team_banner_sub', content: 'Senior counsel with decades of combined practice across corporate, regulatory and litigation work.' },
    { section_key: 'team_heading', content: 'Experienced lawyers for complex legal matters.' },
    { section_key: 'team_subheading', content: 'SLC\'s partners bring together expertise across corporate law, aviation, banking, litigation, real estate, and family law.' },
    { section_key: 'contact_banner_title', content: 'Contact Us' },
    { section_key: 'contact_banner_sub', content: 'Bring your matter to a team that moves with purpose.' },
    { section_key: 'contact_heading', content: 'Let\'s discuss your legal matter.' },
    { section_key: 'contact_subheading', content: 'Share a few details and the SLC team will follow up promptly with next steps.' },
    { section_key: 'contact_address', content: '16 Odanta Street, Asylum Down, Accra, Ghana' },
    { section_key: 'contact_phone', content: '(+233) 030 220 1530' },
    { section_key: 'contact_email', content: 'info@springlegal.com.gh' },
    { section_key: 'contact_hours', content: 'Monday – Friday, 8 AM – 5 PM GMT' },
    { section_key: 'footer_description', content: 'Full-service corporate law firm delivering legal excellence since 2012. Headquartered in Accra, Ghana, serving clients locally and internationally.' },
    { section_key: 'header_call_text', content: 'Call (+233) 030 220 1530' },
    { section_key: 'header_consult_text', content: 'Request Consultation' }
  ];

  return res.status(200).json(FALLBACK_CONTENT);
}
