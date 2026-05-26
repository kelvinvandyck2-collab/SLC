const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\DELL\\Desktop\\LAW';
const practiceDir = path.join(rootDir, 'practice');

// 1. Process about.html
const aboutPath = path.join(rootDir, 'about.html');
if (fs.existsSync(aboutPath)) {
  let html = fs.readFileSync(aboutPath, 'utf8');

  // Simple string replacements for about.html
  const replaces = [
    [
      '<h1 class="serif banner-title">About Spring Legal Consultancy</h1>',
      '<h1 class="serif banner-title" data-cms="about_banner_title">About Spring Legal Consultancy</h1>'
    ],
    [
      '<p class="banner-sub">A full-service law firm built on integrity, professionalism, and results since 2012.</p>',
      '<p class="banner-sub" data-cms="about_banner_sub">A full-service law firm built on integrity, professionalism, and results since 2012.</p>'
    ],
    [
      '<h2 class="serif">A firm built on integrity and exceptional client service.</h2>',
      '<h2 class="serif" data-cms="about_heading">A firm built on integrity and exceptional client service.</h2>'
    ],
    [
      '<p>Spring Legal Consultancy (SLC) has evolved from a sole practitioner practice established in 2012 into a reputable partnership serving a broad and diverse clientele. We are guided by the highest standards of integrity, fairness, and professionalism, which define our approach to client service and legal practice.</p>',
      '<p data-cms="about_para_1">Spring Legal Consultancy (SLC) has evolved from a sole practitioner practice established in 2012 into a reputable partnership serving a broad and diverse clientele. We are guided by the highest standards of integrity, fairness, and professionalism, which define our approach to client service and legal practice.</p>'
    ],
    [
      '<p>Our multidisciplinary team of legal consultants and paralegals delivers bespoke legal solutions aligned with our clients\' strategic and commercial objectives. We adopt a proactive, solutions-oriented approach, combining technical expertise with practical insight to achieve optimal outcomes.</p>',
      '<p data-cms="about_para_2">Our multidisciplinary team of legal consultants and paralegals delivers bespoke legal solutions aligned with our clients\' strategic and commercial objectives. We adopt a proactive, solutions-oriented approach, combining technical expertise with practical insight to achieve optimal outcomes.</p>'
    ],
    [
      '<p>Whether advising corporations on complex transactions or guiding individuals through sensitive personal matters, SLC brings the same commitment to excellence and the same dedication to protecting our clients\' interests.</p>',
      '<p data-cms="about_para_3">Whether advising corporations on complex transactions or guiding individuals through sensitive personal matters, SLC brings the same commitment to excellence and the same dedication to protecting our clients\' interests.</p>'
    ],
    [
      '<div class="stat-card"><div class="stat-number serif">2012</div><div class="stat-label">Established</div></div>',
      '<div class="stat-card"><div class="stat-number serif" data-cms="about_stat_1_num">2012</div><div class="stat-label" data-cms="about_stat_1_label">Established</div></div>'
    ],
    [
      '<div class="stat-card"><div class="stat-number serif">9+</div><div class="stat-label">Practice Areas</div></div>',
      '<div class="stat-card"><div class="stat-number serif" data-cms="about_stat_2_num">9+</div><div class="stat-label" data-cms="about_stat_2_label">Practice Areas</div></div>'
    ],
    [
      '<div class="stat-card"><div class="stat-number serif">3</div><div class="stat-label">Partner Lawyers</div></div>',
      '<div class="stat-card"><div class="stat-number serif" data-cms="about_stat_3_num">3</div><div class="stat-label" data-cms="about_stat_3_label">Partner Lawyers</div></div>'
    ],
    [
      '<div class="stat-card"><div class="stat-number serif">GBA</div><div class="stat-label">Certified Counsel</div></div>',
      '<div class="stat-card"><div class="stat-number serif" data-cms="about_stat_4_num">GBA</div><div class="stat-label" data-cms="about_stat_4_label">Certified Counsel</div></div>'
    ],
    [
      '<h3 class="serif">Our Core Values</h3>',
      '<h3 class="serif" data-cms="about_values_title">Our Core Values</h3>'
    ],
    [
      '<div class="value-item"><i class="fa-solid fa-check"></i><span><strong>Integrity</strong> — highest ethical standards in every engagement</span></div>',
      '<div class="value-item"><i class="fa-solid fa-check"></i><span><strong data-cms="about_value_1_title">Integrity</strong> — <span data-cms="about_value_1_desc">highest ethical standards in every engagement</span></span></div>'
    ],
    [
      '<div class="value-item"><i class="fa-solid fa-check"></i><span><strong>Professional Excellence</strong> — continuous learning and technical mastery</span></div>',
      '<div class="value-item"><i class="fa-solid fa-check"></i><span><strong data-cms="about_value_2_title">Professional Excellence</strong> — <span data-cms="about_value_2_desc">continuous learning and technical mastery</span></span></div>'
    ],
    [
      '<div class="value-item"><i class="fa-solid fa-check"></i><span><strong>Client-Centered</strong> — tailored solutions aligned with client objectives</span></div>',
      '<div class="value-item"><i class="fa-solid fa-check"></i><span><strong data-cms="about_value_3_title">Client-Centered</strong> — <span data-cms="about_value_3_desc">tailored solutions aligned with client objectives</span></span></div>'
    ],
    [
      '<div class="value-item"><i class="fa-solid fa-check"></i><span><strong>Respect &amp; Fairness</strong> — dignity and impartiality in all matters</span></div>',
      '<div class="value-item"><i class="fa-solid fa-check"></i><span><strong data-cms="about_value_4_title">Respect &amp; Fairness</strong> — <span data-cms="about_value_4_desc">dignity and impartiality in all matters</span></span></div>'
    ],
    [
      '<div class="value-item"><i class="fa-solid fa-check"></i><span><strong>Results-Driven</strong> — practical, efficient outcomes for every client</span></div>',
      '<div class="value-item"><i class="fa-solid fa-check"></i><span><strong data-cms="about_value_5_title">Results-Driven</strong> — <span data-cms="about_value_5_desc">practical, efficient outcomes for every client</span></span></div>'
    ],
    [
      '<span class="navy-tag">SLC Commitments</span>',
      '<span class="navy-tag" data-cms="navy_tag">SLC Commitments</span>'
    ],
    [
      '<h2 class="serif">Our Purpose &amp; Credentials</h2>',
      '<h2 class="serif" data-cms="navy_heading">Our Purpose &amp; Credentials</h2>'
    ],
    [
      '<p class="navy-desc">Spring Legal Consultancy is dedicated to providing high-caliber, ethical, and client-focused legal services that protect our clients\' interests and foster sustainable business growth in Ghana and internationally.</p>',
      '<p class="navy-desc" data-cms="navy_desc">Spring Legal Consultancy is dedicated to providing high-caliber, ethical, and client-focused legal services that protect our clients\' interests and foster sustainable business growth in Ghana and internationally.</p>'
    ],
    [
      '<li><i class="fa-solid fa-shield-halved"></i> Ghana Bar Association Certified Counsel</li>',
      '<li><i class="fa-solid fa-shield-halved"></i> <span data-cms="navy_cred_1">Ghana Bar Association Certified Counsel</span></li>'
    ],
    [
      '<li><i class="fa-solid fa-certificate"></i> Qualified Notaries Public</li>',
      '<li><i class="fa-solid fa-certificate"></i> <span data-cms="navy_cred_2">Qualified Notaries Public</span></li>'
    ],
    [
      '<li><i class="fa-solid fa-plane"></i> Aviation Law Specialists</li>',
      '<li><i class="fa-solid fa-plane"></i> <span data-cms="navy_cred_3">Aviation Law Specialists</span></li>'
    ],
    [
      '<li><i class="fa-solid fa-scale-balanced"></i> Experienced Civil Litigation &amp; Dispute Resolution</li>',
      '<li><i class="fa-solid fa-scale-balanced"></i> <span data-cms="navy_cred_4">Experienced Civil Litigation &amp; Dispute Resolution</span></li>'
    ],
    [
      '<h3 class="serif">Our Mission</h3>',
      '<h3 class="serif" data-cms="mission_title">Our Mission</h3>'
    ],
    [
      '<p>To deliver high-quality, ethical, and client-focused legal services that protect our clients\' interests, support business growth, and provide practical solutions to complex legal challenges.</p>',
      '<p data-cms="mission_text">To deliver high-quality, ethical, and client-focused legal services that protect our clients\' interests, support business growth, and provide practical solutions to complex legal challenges.</p>'
    ],
    [
      '<h3 class="serif">Our Vision</h3>',
      '<h3 class="serif" data-cms="vision_title">Our Vision</h3>'
    ],
    [
      '<p>To be a leading and trusted legal consultancy recognized for excellence, innovation, and professionalism, setting the benchmark for premium legal service delivery in the region.</p>',
      '<p data-cms="vision_text">To be a leading and trusted legal consultancy recognized for excellence, innovation, and professionalism, setting the benchmark for premium legal service delivery in the region.</p>'
    ]
  ];

  replaces.forEach(([target, replacement]) => {
    html = html.replace(target, replacement);
  });
  fs.writeFileSync(aboutPath, html, 'utf8');
  console.log('Processed about.html attributes.');
}

// 2. Process team.html
const teamPath = path.join(rootDir, 'team.html');
if (fs.existsSync(teamPath)) {
  let html = fs.readFileSync(teamPath, 'utf8');
  const replaces = [
    [
      '<h1 class="serif banner-title">Our Team</h1>',
      '<h1 class="serif banner-title" data-cms="team_banner_title">Our Team</h1>'
    ],
    [
      '<p class="banner-sub">Senior counsel with decades of combined practice across corporate, regulatory and litigation work.</p>',
      '<p class="banner-sub" data-cms="team_banner_sub">Senior counsel with decades of combined practice across corporate, regulatory and litigation work.</p>'
    ],
    [
      '<h2 class="serif">Experienced lawyers for complex legal matters.</h2>',
      '<h2 class="serif" data-cms="team_heading">Experienced lawyers for complex legal matters.</h2>'
    ],
    [
      '<p>SLC\'s partners bring together expertise across corporate law, aviation, banking, litigation, real estate, and family law — combining deep technical knowledge with practical insight and a commitment to results.</p>',
      '<p data-cms="team_subheading">SLC\'s partners bring together expertise across corporate law, aviation, banking, litigation, real estate, and family law — combining deep technical knowledge with practical insight and a commitment to results.</p>'
    ],
    // Ruby
    [
      '<span class="team-location">Accra, Ghana</span>\r\n                            <h3 class="serif team-name">Mrs. Ruby Akua Aglagoh</h3>\r\n                            <span class="team-role">Founder/Partner | Notary Public | Human Rights Advocate</span>\r\n                            <p class="team-bio">Called to the Ghana Bar in 2001. Extensive experience in corporate governance, litigation, debt recovery, family law, aviation, real estate, and construction. Adjunct Lecturer at Ensign Global University. Holds LLB (Ghana), BL (Ghana School of Law), and LLM (Research) from Edith Cowan University, Australia.</p>',
      '<span class="team-location" data-cms="team_1_location">Accra, Ghana</span>\r\n                            <h3 class="serif team-name" data-cms="team_1_name">Mrs. Ruby Akua Aglagoh</h3>\r\n                            <span class="team-role" data-cms="team_1_role">Founder/Partner | Notary Public | Human Rights Advocate</span>\r\n                            <p class="team-bio" data-cms="team_1_bio">Called to the Ghana Bar in 2001. Extensive experience in corporate governance, litigation, debt recovery, family law, aviation, real estate, and construction. Adjunct Lecturer at Ensign Global University. Holds LLB (Ghana), BL (Ghana School of Law), and LLM (Research) from Edith Cowan University, Australia.</p>'
    ],
    // Let's also support matching with \n for Unix systems
    [
      '<span class="team-location">Accra, Ghana</span>\n                            <h3 class="serif team-name">Mrs. Ruby Akua Aglagoh</h3>\n                            <span class="team-role">Founder/Partner | Notary Public | Human Rights Advocate</span>\n                            <p class="team-bio">Called to the Ghana Bar in 2001. Extensive experience in corporate governance, litigation, debt recovery, family law, aviation, real estate, and construction. Adjunct Lecturer at Ensign Global University. Holds LLB (Ghana), BL (Ghana School of Law), and LLM (Research) from Edith Cowan University, Australia.</p>',
      '<span class="team-location" data-cms="team_1_location">Accra, Ghana</span>\n                            <h3 class="serif team-name" data-cms="team_1_name">Mrs. Ruby Akua Aglagoh</h3>\n                            <span class="team-role" data-cms="team_1_role">Founder/Partner | Notary Public | Human Rights Advocate</span>\n                            <p class="team-bio" data-cms="team_1_bio">Called to the Ghana Bar in 2001. Extensive experience in corporate governance, litigation, debt recovery, family law, aviation, real estate, and construction. Adjunct Lecturer at Ensign Global University. Holds LLB (Ghana), BL (Ghana School of Law), and LLM (Research) from Edith Cowan University, Australia.</p>'
    ],
    // Alexander
    [
      '<span class="team-location">Accra, Ghana</span>\r\n                            <h3 class="serif team-name">Alexander Nii Kwartey Owoo, Esq.</h3>\r\n                            <span class="team-role">Managing Partner | Barrister &amp; Solicitor | Notary Public</span>\r\n                            <p class="team-bio">Over two decades of experience in corporate law, banking, finance, trusts, family law, and insurance. Former Head of Legal at HFC Bank. Lecturer in Law of Trusts and Business Law. Holds LLB (Ghana) and LLM in International Commercial and Corporate Law (London). Licensed Insolvency Practitioner.</p>',
      '<span class="team-location" data-cms="team_2_location">Accra, Ghana</span>\r\n                            <h3 class="serif team-name" data-cms="team_2_name">Alexander Nii Kwartey Owoo, Esq.</h3>\r\n                            <span class="team-role" data-cms="team_2_role">Managing Partner | Barrister &amp; Solicitor | Notary Public</span>\r\n                            <p class="team-bio" data-cms="team_2_bio">Over two decades of experience in corporate law, banking, finance, trusts, family law, and insurance. Former Head of Legal at HFC Bank. Lecturer in Law of Trusts and Business Law. Holds LLB (Ghana) and LLM in International Commercial and Corporate Law (London). Licensed Insolvency Practitioner.</p>'
    ],
    [
      '<span class="team-location">Accra, Ghana</span>\n                            <h3 class="serif team-name">Alexander Nii Kwartey Owoo, Esq.</h3>\n                            <span class="team-role">Managing Partner | Barrister &amp; Solicitor | Notary Public</span>\n                            <p class="team-bio">Over two decades of experience in corporate law, banking, finance, trusts, family law, and insurance. Former Head of Legal at HFC Bank. Lecturer in Law of Trusts and Business Law. Holds LLB (Ghana) and LLM in International Commercial and Corporate Law (London). Licensed Insolvency Practitioner.</p>',
      '<span class="team-location" data-cms="team_2_location">Accra, Ghana</span>\n                            <h3 class="serif team-name" data-cms="team_2_name">Alexander Nii Kwartey Owoo, Esq.</h3>\n                            <span class="team-role" data-cms="team_2_role">Managing Partner | Barrister &amp; Solicitor | Notary Public</span>\n                            <p class="team-bio" data-cms="team_2_bio">Over two decades of experience in corporate law, banking, finance, trusts, family law, and insurance. Former Head of Legal at HFC Bank. Lecturer in Law of Trusts and Business Law. Holds LLB (Ghana) and LLM in International Commercial and Corporate Law (London). Licensed Insolvency Practitioner.</p>'
    ],
    // Ernest
    [
      '<span class="team-location">Accra, Ghana</span>\r\n                            <h3 class="serif team-name">Ernest Assie, Esq.</h3>\r\n                            <span class="team-role">Junior Partner | Barrister &amp; Solicitor</span>\r\n                            <p class="team-bio">Called to the Ghana Bar in 2017. Over 16 years of prior experience in recovery and debt management, client service, and banking operations. Formerly with Republic Bank Ghana PLC. Successfully handled high-profile cases in court and before statutory bodies. Holds BA (KNUST), LLB (Mountcrest), and BL (Ghana School of Law).</p>',
      '<span class="team-location" data-cms="team_3_location">Accra, Ghana</span>\r\n                            <h3 class="serif team-name" data-cms="team_3_name">Ernest Assie, Esq.</h3>\r\n                            <span class="team-role" data-cms="team_3_role">Junior Partner | Barrister &amp; Solicitor</span>\r\n                            <p class="team-bio" data-cms="team_3_bio">Called to the Ghana Bar in 2017. Over 16 years of prior experience in recovery and debt management, client service, and banking operations. Formerly with Republic Bank Ghana PLC. Successfully handled high-profile cases in court and before statutory bodies. Holds BA (KNUST), LLB (Mountcrest), and BL (Ghana School of Law).</p>'
    ],
    [
      '<span class="team-location">Accra, Ghana</span>\n                            <h3 class="serif team-name">Ernest Assie, Esq.</h3>\n                            <span class="team-role">Junior Partner | Barrister &amp; Solicitor</span>\n                            <p class="team-bio">Called to the Ghana Bar in 2017. Over 16 years of prior experience in recovery and debt management, client service, and banking operations. Formerly with Republic Bank Ghana PLC. Successfully handled high-profile cases in court and before statutory bodies. Holds BA (KNUST), LLB (Mountcrest), and BL (Ghana School of Law).</p>',
      '<span class="team-location" data-cms="team_3_location">Accra, Ghana</span>\n                            <h3 class="serif team-name" data-cms="team_3_name">Ernest Assie, Esq.</h3>\n                            <span class="team-role" data-cms="team_3_role">Junior Partner | Barrister &amp; Solicitor</span>\n                            <p class="team-bio" data-cms="team_3_bio">Called to the Ghana Bar in 2017. Over 16 years of prior experience in recovery and debt management, client service, and banking operations. Formerly with Republic Bank Ghana PLC. Successfully handled high-profile cases in court and before statutory bodies. Holds BA (KNUST), LLB (Mountcrest), and BL (Ghana School of Law).</p>'
    ]
  ];

  replaces.forEach(([target, replacement]) => {
    html = html.replace(target, replacement);
  });
  fs.writeFileSync(teamPath, html, 'utf8');
  console.log('Processed team.html attributes.');
}

// 3. Process contact.html
const contactPath = path.join(rootDir, 'contact.html');
if (fs.existsSync(contactPath)) {
  let html = fs.readFileSync(contactPath, 'utf8');
  const replaces = [
    [
      '<h1 class="serif banner-title">Contact Us</h1>',
      '<h1 class="serif banner-title" data-cms="contact_banner_title">Contact Us</h1>'
    ],
    [
      '<p class="banner-sub">Bring your matter to a team that moves with purpose.</p>',
      '<p class="banner-sub" data-cms="contact_banner_sub">Bring your matter to a team that moves with purpose.</p>'
    ],
    [
      '<h2 class="serif">Let\'s discuss your legal matter.</h2>',
      '<h2 class="serif" data-cms="contact_heading">Let\'s discuss your legal matter.</h2>'
    ],
    [
      '<p>Share a few details and the SLC team will follow up promptly with next steps. You can also reach us directly by phone or email.</p>',
      '<p data-cms="contact_subheading">Share a few details and the SLC team will follow up promptly with next steps. You can also reach us directly by phone or email.</p>'
    ],
    [
      '<h4>Office Location</h4>\r\n                                <p>16 Odanta Street, Asylum Down<br>Accra, Ghana</p>',
      '<h4 data-cms="contact_address_title">Office Location</h4>\r\n                                <p data-cms="contact_address">16 Odanta Street, Asylum Down<br>Accra, Ghana</p>'
    ],
    [
      '<h4>Office Location</h4>\n                                <p>16 Odanta Street, Asylum Down<br>Accra, Ghana</p>',
      '<h4 data-cms="contact_address_title">Office Location</h4>\n                                <p data-cms="contact_address">16 Odanta Street, Asylum Down<br>Accra, Ghana</p>'
    ],
    [
      '<h4>Telephone</h4>\r\n                                <a href="tel:+2330302201530">(+233) 030 220 1530</a>',
      '<h4 data-cms="contact_phone_title">Telephone</h4>\r\n                                <a href="tel:+2330302201530" data-cms="contact_phone">(+233) 030 220 1530</a>'
    ],
    [
      '<h4>Telephone</h4>\n                                <a href="tel:+2330302201530">(+233) 030 220 1530</a>',
      '<h4 data-cms="contact_phone_title">Telephone</h4>\n                                <a href="tel:+2330302201530" data-cms="contact_phone">(+233) 030 220 1530</a>'
    ],
    [
      '<h4>Email Address</h4>\r\n                                <a href="mailto:info@springlegal.com.gh">info@springlegal.com.gh</a>',
      '<h4 data-cms="contact_email_title">Email Address</h4>\r\n                                <a href="mailto:info@springlegal.com.gh" data-cms="contact_email">info@springlegal.com.gh</a>'
    ],
    [
      '<h4>Email Address</h4>\n                                <a href="mailto:info@springlegal.com.gh">info@springlegal.com.gh</a>',
      '<h4 data-cms="contact_email_title">Email Address</h4>\n                                <a href="mailto:info@springlegal.com.gh" data-cms="contact_email">info@springlegal.com.gh</a>'
    ],
    [
      '<h4>Office Hours</h4>\r\n                                <p>Mon – Fri: 8:00am – 5:00pm</p>',
      '<h4 data-cms="contact_hours_title">Office Hours</h4>\r\n                                <p data-cms="contact_hours">Mon – Fri: 8:00am – 5:00pm</p>'
    ],
    [
      '<h4>Office Hours</h4>\n                                <p>Mon – Fri: 8:00am – 5:00pm</p>',
      '<h4 data-cms="contact_hours_title">Office Hours</h4>\n                                <p data-cms="contact_hours">Mon – Fri: 8:00am – 5:00pm</p>'
    ],
    [
      '<h3 class="serif">Request a Consultation</h3>',
      '<h3 class="serif" data-cms="contact_form_title">Request a Consultation</h3>'
    ],
    [
      '<option value="">Select a Practice Area</option>',
      '<option value="" data-cms="contact_select_default">Select a Practice Area</option>'
    ],
    [
      '<button type="submit" class="btn btn-primary submit-btn"><i class="fa-solid fa-paper-plane"></i> Send Consultation Request</button>',
      '<button type="submit" class="btn btn-primary submit-btn"><i class="fa-solid fa-paper-plane"></i> <span data-cms="contact_form_btn">Send Consultation Request</span></button>'
    ]
  ];

  replaces.forEach(([target, replacement]) => {
    html = html.replace(target, replacement);
  });
  fs.writeFileSync(contactPath, html, 'utf8');
  console.log('Processed contact.html attributes.');
}
