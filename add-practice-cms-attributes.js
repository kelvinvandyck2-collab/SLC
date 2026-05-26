const fs = require('fs');
const path = require('path');

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

files.forEach((file, index) => {
  const filePath = path.join(practiceDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  let html = fs.readFileSync(filePath, 'utf8');
  const idx = index + 1; // 1-indexed

  // 1. Banner Title
  html = html.replace(
    /<h1 class="serif banner-title">([\s\S]*?)<\/h1>/,
    `<h1 class="serif banner-title" data-cms="practice_${idx}_banner_title">$1</h1>`
  );

  // 2. Banner Sub
  html = html.replace(
    /<p class="banner-sub">([\s\S]*?)<\/p>/,
    `<p class="banner-sub" data-cms="practice_${idx}_banner_sub">$1</p>`
  );

  // 3. Section Heading
  html = html.replace(
    /<h2 class="serif section-h2">([\s\S]*?)<\/h2>/,
    `<h2 class="serif section-h2" data-cms="practice_${idx}_heading">$1</h2>`
  );

  // 4. Paragraph 1 & 2 after Section Heading
  // Let's locate the position of the section-h2 we just replaced
  const headingMatch = html.match(new RegExp(`<h2 class="serif section-h2" data-cms="practice_${idx}_heading">`));
  if (headingMatch) {
    const headingIndex = html.indexOf(headingMatch[0]);
    const beforeHeading = html.substring(0, headingIndex + headingMatch[0].length);
    let afterHeading = html.substring(headingIndex + headingMatch[0].length);

    // Replace the first and second <p> tags in afterHeading
    let pCount = 0;
    afterHeading = afterHeading.replace(/<p>/g, (match) => {
      pCount++;
      if (pCount === 1) {
        return `<p data-cms="practice_${idx}_p1">`;
      } else if (pCount === 2) {
        return `<p data-cms="practice_${idx}_p2">`;
      }
      return match;
    });

    html = beforeHeading + afterHeading;
  }

  // 5. Bullets
  html = html.replace(
    /<ul class="service-list">/,
    `<ul class="service-list" data-cms="practice_${idx}_bullets">`
  );

  // 6. Why Choose Us / Why SLC paragraph
  // Let's find <h3 class="serif">Why ...</h3>
  const whyHeadingMatch = html.match(/<h3 class="serif">Why[\s\S]*?<\/h3>/);
  if (whyHeadingMatch) {
    const whyIndex = html.indexOf(whyHeadingMatch[0]);
    const beforeWhy = html.substring(0, whyIndex + whyHeadingMatch[0].length);
    let afterWhy = html.substring(whyIndex + whyHeadingMatch[0].length);

    // Replace the first <p> after this heading
    let replaced = false;
    afterWhy = afterWhy.replace(/<p>/, () => {
      replaced = true;
      return `<p data-cms="practice_${idx}_why">`;
    });

    html = beforeWhy + afterWhy;
  }

  // 7. CTA Box
  const ctaBoxMatch = html.match(/<div class="cta-box">/);
  if (ctaBoxMatch) {
    const ctaIndex = html.indexOf(ctaBoxMatch[0]);
    const beforeCta = html.substring(0, ctaIndex + ctaBoxMatch[0].length);
    let afterCta = html.substring(ctaIndex + ctaBoxMatch[0].length);

    // Replace <h4 class="serif"> and <p> in afterCta once
    afterCta = afterCta.replace(/<h4 class="serif">/, `<h4 class="serif" data-cms="practice_${idx}_cta_title">`);
    afterCta = afterCta.replace(/<p>/, `<p data-cms="practice_${idx}_cta_text">`);

    html = beforeCta + afterCta;
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Processed practice/${file} attributes.`);
});
