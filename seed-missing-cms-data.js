const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.POSTGRES_URL_NON_POOLING.split('?')[0],
  ssl: { rejectUnauthorized: false }
});

const practiceDir = 'c:\\Users\\DELL\\Desktop\\LAW\\practice';
const files = [
  'aviation-law.html',
  'corporate-commercial.html',
  'dispute-resolution.html',
  'real-estate-property.html',
  'private-client-family.html',
  'banking-finance.html',
  'civil-construction.html',
  'insurance-claims.html',
  'natural-resources-law.html'
];

async function seed() {
  await client.connect();
  console.log('Connected to Supabase database.');

  const seeds = [];

  // 1. Static Pages Seeds
  const staticSeeds = [
    ['about_banner_title', 'About Spring Legal Consultancy'],
    ['about_banner_sub', 'A full-service law firm built on integrity, professionalism, and results since 2012.'],
    ['about_heading', 'A firm built on integrity and exceptional client service.'],
    ['about_para_1', 'Spring Legal Consultancy (SLC) has evolved from a sole practitioner practice established in 2012 into a reputable partnership serving a broad and diverse clientele. We are guided by the highest standards of integrity, fairness, and professionalism, which define our approach to client service and legal practice.'],
    ['about_para_2', 'Our multidisciplinary team of legal consultants and paralegals delivers bespoke legal solutions aligned with our clients\' strategic and commercial objectives. We adopt a proactive, solutions-oriented approach, combining technical expertise with practical insight to achieve optimal outcomes.'],
    ['about_para_3', 'Whether advising corporations on complex transactions or guiding individuals through sensitive personal matters, SLC brings the same commitment to excellence and the same dedication to protecting our clients\' interests.'],
    ['about_stat_1_num', '2012'],
    ['about_stat_1_label', 'Established'],
    ['about_stat_2_num', '9+'],
    ['about_stat_2_label', 'Practice Areas'],
    ['about_stat_3_num', '3'],
    ['about_stat_3_label', 'Partner Lawyers'],
    ['about_stat_4_num', 'GBA'],
    ['about_stat_4_label', 'Certified Counsel'],
    ['about_values_title', 'Our Core Values'],
    ['about_value_1_title', 'Integrity'],
    ['about_value_1_desc', 'highest ethical standards in every engagement'],
    ['about_value_2_title', 'Professional Excellence'],
    ['about_value_2_desc', 'continuous learning and technical mastery'],
    ['about_value_3_title', 'Client-Centered'],
    ['about_value_3_desc', 'tailored solutions aligned with client objectives'],
    ['about_value_4_title', 'Respect & Fairness'],
    ['about_value_4_desc', 'dignity and impartiality in all matters'],
    ['about_value_5_title', 'Results-Driven'],
    ['about_value_5_desc', 'practical, efficient outcomes for every client'],
    
    ['team_banner_title', 'Our Team'],
    ['team_banner_sub', 'Senior counsel with decades of combined practice across corporate, regulatory and litigation work.'],
    ['team_heading', 'Experienced lawyers for complex legal matters.'],
    ['team_subheading', 'SLC\'s partners bring together expertise across corporate law, aviation, banking, litigation, real estate, and family law — combining deep technical knowledge with practical insight and a commitment to results.'],
    
    ['contact_banner_title', 'Contact Us'],
    ['contact_banner_sub', 'Bring your matter to a team that moves with purpose.'],
    ['contact_heading', 'Let\'s discuss your legal matter.'],
    ['contact_subheading', 'Share a few details and the SLC team will follow up promptly with next steps. You can also reach us directly by phone or email.'],
    ['contact_address_title', 'Office Location'],
    ['contact_phone_title', 'Telephone'],
    ['contact_email_title', 'Email Address'],
    ['contact_hours_title', 'Office Hours'],
    ['contact_form_title', 'Request a Consultation'],
    ['contact_select_default', 'Select a Practice Area'],
    ['contact_form_btn', 'Send Consultation Request']
  ];

  seeds.push(...staticSeeds);

  // 2. Parse and seed practice files
  files.forEach((file, index) => {
    const filePath = path.join(practiceDir, file);
    if (!fs.existsSync(filePath)) return;
    const html = fs.readFileSync(filePath, 'utf8');
    const idx = index + 1;

    // Extract content
    const bannerTitleMatch = html.match(/<h1 class="serif banner-title">([\s\S]*?)<\/h1>/);
    const bannerSubMatch = html.match(/<p class="banner-sub">([\s\S]*?)<\/p>/);
    const headingMatch = html.match(/<h2 class="serif section-h2">([\s\S]*?)<\/h2>/);
    
    let p1 = '';
    let p2 = '';
    if (headingMatch) {
      const headingIndex = html.indexOf(headingMatch[0]);
      const rest = html.substring(headingIndex + headingMatch[0].length);
      const pMatches = [...rest.matchAll(/<p>([\s\S]*?)<\/p>/g)];
      if (pMatches[0]) p1 = pMatches[0][1].trim();
      if (pMatches[1]) p2 = pMatches[1][1].trim();
    }

    let why = '';
    const whyMatch = html.match(/<h3 class="serif">Why.*?<\/h3>\s*<p>([\s\S]*?)<\/p>/);
    if (whyMatch) {
      why = whyMatch[1].trim();
    }

    let ctaTitle = '';
    let ctaText = '';
    const ctaBoxMatch = html.match(/<div class="cta-box">([\s\S]*?)<\/div>/);
    if (ctaBoxMatch) {
      const ctaContent = ctaBoxMatch[1];
      const ctaTitleM = ctaContent.match(/<h4 class="serif">([\s\S]*?)<\/h4>/);
      const ctaTextM = ctaContent.match(/<p>([\s\S]*?)<\/p>/);
      if (ctaTitleM) ctaTitle = ctaTitleM[1].trim();
      if (ctaTextM) ctaText = ctaTextM[1].trim();
    }

    let bulletsText = '';
    const listMatch = html.match(/<ul class="service-list">([\s\S]*?)<\/ul>/);
    if (listMatch) {
      const liMatches = [...listMatch[1].matchAll(/<li>([\s\S]*?)<\/li>/g)];
      const bullets = liMatches.map(m => m[1].replace(/<i[\s\S]*?><\/i>/, '').trim());
      bulletsText = bullets.join('\n');
    }

    // Push standard seeds
    seeds.push([`practice_${idx}_banner_title`, bannerTitleMatch ? bannerTitleMatch[1].trim() : '']);
    seeds.push([`practice_${idx}_banner_sub`, bannerSubMatch ? bannerSubMatch[1].trim() : '']);
    seeds.push([`practice_${idx}_heading`, headingMatch ? headingMatch[1].trim() : '']);
    seeds.push([`practice_${idx}_p1`, p1]);
    seeds.push([`practice_${idx}_p2`, p2]);
    seeds.push([`practice_${idx}_bullets`, bulletsText]);
    seeds.push([`practice_${idx}_why`, why]);
    seeds.push([`practice_${idx}_cta_title`, ctaTitle]);
    seeds.push([`practice_${idx}_cta_text`, ctaText]);
  });

  console.log(`Prepared ${seeds.length} seeds to insert/update.`);

  for (const [key, val] of seeds) {
    try {
      await client.query(
        `INSERT INTO site_content (section_key, content) VALUES ($1, $2)
         ON CONFLICT (section_key) DO UPDATE SET content = EXCLUDED.content`,
        [key, val]
      );
    } catch (err) {
      console.error(`Failed to seed ${key}:`, err.message);
    }
  }

  console.log('Seeding completed successfully!');
  await client.end();
}

seed().catch(err => {
  console.error('Seeding process failed:', err);
  client.end();
});
