const { Client } = require('pg');
require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const client = new Client({
  connectionString: process.env.POSTGRES_URL_NON_POOLING,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();
  console.log('Connected to Postgres');

  const newSeeds = [
    ['header_call_text', 'Call Us'],
    ['header_consult_text', 'Consult'],
    ['hero_cta_consult', 'Request a Consultation'],
    ['hero_cta_explore', 'Explore Practice Areas'],
    ['overlap_card_1_title', 'Corporate & Commercial'],
    ['overlap_card_1_desc', 'Bespoke legal counsel for company transactions, governance, and business operations.'],
    ['overlap_card_2_title', 'Aviation Law'],
    ['overlap_card_2_desc', 'Specialized regulatory advice and litigation support for aviation sector stakeholders.'],
    ['overlap_card_3_title', 'Dispute Resolution'],
    ['overlap_card_3_desc', 'Strategic representation and mediation in high-stakes civil and commercial disputes.'],
    ['about_tag', 'About SLC'],
    ['about_values_title', 'Our Core Values'],
    ['about_value_1_title', 'Integrity'],
    ['about_value_1_desc', 'highest ethical standards'],
    ['about_value_2_title', 'Professional Excellence'],
    ['about_value_2_desc', 'continuous learning'],
    ['about_value_3_title', 'Client-Centered'],
    ['about_value_3_desc', 'tailored solutions'],
    ['about_value_4_title', 'Respect & Fairness'],
    ['about_value_4_desc', 'dignity and impartiality'],
    ['about_value_5_title', 'Results-Driven'],
    ['about_value_5_desc', 'practical, efficient outcomes'],
    ['navy_tag', 'SLC Commitments'],
    ['navy_heading', 'Our Purpose & Credentials'],
    ['navy_desc', 'Spring Legal Consultancy is dedicated to providing high-caliber, ethical, and client-focused legal services that protect our clients\' interests and foster sustainable business growth in Ghana and internationally.'],
    ['navy_cred_1', 'Ghana Bar Association Certified Counsel'],
    ['navy_cred_2', 'Qualified Notaries Public'],
    ['navy_cred_3', 'Aviation Law Specialists'],
    ['navy_cred_4', 'Experienced Civil Litigation & Dispute Resolution'],
    ['mission_title', 'Our Mission'],
    ['vision_title', 'Our Vision'],
    ['team_tag', 'Experienced lawyers for complex legal matters.'],
    ['team_1_location', 'Accra, Ghana'],
    ['team_2_location', 'Accra, Ghana'],
    ['team_3_location', 'Accra, Ghana'],
    ['service_1_btn', 'Read More'],
    ['service_2_btn', 'Read More'],
    ['service_3_btn', 'Read More'],
    ['service_4_btn', 'Read More'],
    ['service_5_btn', 'Read More'],
    ['service_6_btn', 'Read More'],
    ['service_7_btn', 'Read More'],
    ['service_8_btn', 'Read More'],
    ['service_9_btn', 'Read More'],
    ['contact_address_title', 'Office Location'],
    ['contact_phone_title', 'Telephone'],
    ['contact_email_title', 'Email Address'],
    ['contact_hours_title', 'Office Hours'],
    ['contact_form_title', 'Request a Consultation'],
    ['contact_select_default', 'Select Practice Area…'],
    ['contact_form_btn', 'Send Enquiry'],
    ['footer_copyright', '© 2026 Spring Legal Consultancy. All rights reserved.']
  ];

  let added = 0;
  for (const [key, val] of newSeeds) {
    // INSERT IF NOT EXISTS OR IF CURRENT CONTENT IS EMPTY
    const checkRes = await client.query('SELECT content FROM site_content WHERE section_key = $1', [key]);
    if (checkRes.rows.length === 0) {
      await client.query('INSERT INTO site_content (section_key, content) VALUES ($1, $2)', [key, val]);
      added++;
    } else if (checkRes.rows[0].content === '') {
      await client.query('UPDATE site_content SET content = $2 WHERE section_key = $1', [key, val]);
      added++;
    }
  }

  console.log(`Successfully seeded/updated ${added} missing CMS keys.`);
  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
