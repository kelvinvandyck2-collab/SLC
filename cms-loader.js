/**
 * Spring Legal Consultancy — CMS Dynamic Content Loader
 * Fetches all site_content rows from Supabase and injects them into
 * every element that has a [data-cms="key"] attribute on the page.
 */
async function loadCMS() {
    try {
        const SUPABASE_URL = 'https://uwhujavrrdzzwxunrlzu.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3aHVqYXZycmR6end4dW5ybHp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MzE1MDAsImV4cCI6MjA4NjUwNzUwMH0.l9qlQDGwJLKcyiq0saQamT91s44qHT3MDnG8s2FINvk';

        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/site_content?section_key=neq.admin_password&select=section_key,content`,
            { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
        );
        if (!res.ok) return;

        const rows = await res.json();
        const data = {};
        rows.forEach(r => data[r.section_key] = r.content);

        document.querySelectorAll('[data-cms]').forEach(el => {
            const key = el.dataset.cms;
            const val = data[key];
            if (val === undefined || val === '') return;

            // hero_badge — preserve the animated dot span
            if (key === 'hero_badge') {
                const dot = el.querySelector('.dot');
                el.innerHTML = '';
                if (dot) el.appendChild(dot);
                el.appendChild(document.createTextNode(' ' + val));
                return;
            }

            // hero_title — allow raw HTML (e.g. <br>, <span class="highlight">)
            if (key === 'hero_title') {
                el.innerHTML = val;
                return;
            }

            // _bullets keys — split by newline and render <li> items
            if (key.endsWith('_bullets')) {
                const lines = val.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                el.innerHTML = lines.map(line => `<li><i class="fa-solid fa-check"></i> ${line}</li>`).join('');
                return;
            }

            // Form elements
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
                el.value = val;
                return;
            }

            // All other elements — plain text only (safe)
            el.textContent = val;
        });

    } catch (e) {
        // Silently fail — static fallback content stays visible
        console.warn('CMS load failed:', e.message);
    }
}

// Run on DOM ready, then refresh every 5 seconds
document.addEventListener('DOMContentLoaded', () => {
    loadCMS();
    setInterval(loadCMS, 5000);
});
