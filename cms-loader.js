/**
 * Spring Legal Consultancy — CMS Dynamic Content Loader
 *
 * Strategy to eliminate the "flash of old content":
 * 1. On every page load, apply cached data from localStorage INSTANTLY
 *    (synchronously, before the browser paints), so the user never sees
 *    the static fallback text.
 * 2. Then fetch fresh data from Supabase in the background.
 * 3. If the fresh data differs, update the DOM silently and save to cache.
 * 4. The 5-second polling interval is removed — background refresh on load is enough.
 */

const CMS_CACHE_KEY = 'slc_cms_cache_v2';
const SUPABASE_URL  = 'https://uwhujavrrdzzwxunrlzu.supabase.co';
const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3aHVqYXZycmR6end4dW5ybHp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MzE1MDAsImV4cCI6MjA4NjUwNzUwMH0.l9qlQDGwJLKcyiq0saQamT91s44qHT3MDnG8s2FINvk';

// Inject a global style so & in serif headings renders in Inter (plain font)
// Playfair Display has a decorative/calligraphic & glyph — this forces it plain.
(function injectAmpStyle() {
    if (document.getElementById('slc-amp-style')) return;
    const s = document.createElement('style');
    s.id = 'slc-amp-style';
    s.textContent = '.plain-amp { font-family: "Inter", sans-serif; font-style: normal; font-weight: inherit; font-size: inherit; }';
    document.head.appendChild(s);
})();

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Decode any residual HTML entities that may be in cached/DB values
function decodeEntities(str) {
    return str
        .replace(/&amp;/g, '&')
        .replace(/&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}

// Wrap & in a plain-font span so serif headings don't use the fancy glyph
function wrapAmpersand(str) {
    return str.replace(/&/g, '<span class="plain-amp">&amp;</span>');
}

// ─── Core injector ────────────────────────────────────────────────────────────
// Render dynamic team grid cards
function renderTeamGrid(container, items) {
    if (!Array.isArray(items)) return;
    const fallbackSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 300' fill='%23e8edf5'><rect width='100%' height='100%'/><path d='M120 140c22 0 40-18 40-40s-18-40-40-40-40 18-40 40 18 40 40 40zm0 20c-30 0-90 15-90 45v15h180v-15c0-30-60-45-90-45z' fill='%231a3a6b'/></svg>";
    container.innerHTML = items.map(m => {
        const imgSrc = m.img || fallbackSvg;
        const location = m.location || 'Accra, Ghana';
        const name = m.name || 'Team Member';
        const role = m.role || '';
        const bio = m.bio || '';
        return `
            <article class="team-card">
                <div class="team-img-wrap">
                    <img src="${imgSrc}" alt="${name}" onerror="this.onerror=null;this.src='${fallbackSvg}';">
                </div>
                <div class="team-info">
                    <span class="team-location">${location}</span>
                    <h3 class="serif team-name">${wrapAmpersand(decodeEntities(name))}</h3>
                    <span class="team-role">${role}</span>
                    <p class="team-bio">${bio}</p>
                </div>
            </article>
        `;
    }).join('');
}

function applyCMSData(data) {
    // Dynamic grid containers (Team Members, External Consultants, Paralegals)
    document.querySelectorAll('[data-cms-grid]').forEach(container => {
        const gridKey = container.dataset.cmsGrid;
        const listStr = data[gridKey];
        if (listStr) {
            try {
                const list = typeof listStr === 'string' ? JSON.parse(listStr) : listStr;
                if (Array.isArray(list)) {
                    renderTeamGrid(container, list);
                }
            } catch(e) {
                console.warn('Grid parse error for', gridKey, e);
            }
        }
    });

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

        // Image elements
        if (el.tagName === 'IMG') {
            el.src = val;
            return;
        }

        // Form elements
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
            el.value = val;
            return;
        }

        // Heading elements — use innerHTML so we can wrap & with plain-font span
        const decoded = decodeEntities(val);
        if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName)) {
            el.innerHTML = wrapAmpersand(decoded);
            return;
        }

        // All other elements — plain text (safe), entities decoded
        el.textContent = decoded;
    });
}

// ─── Step 1: Apply cache instantly (runs before first paint) ──────────────────
function applyCache() {
    try {
        const raw = localStorage.getItem(CMS_CACHE_KEY);
        if (raw) {
            const data = JSON.parse(raw);
            applyCMSData(data);
        }
    } catch (e) {
        // Corrupt cache — ignore, fresh fetch will fix it
        localStorage.removeItem(CMS_CACHE_KEY);
    }
}

// ─── Step 2: Fetch fresh data in background ────────────────────────────────────
async function fetchAndRefresh() {
    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/site_content?section_key=neq.admin_password&select=section_key,content`,
            { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
        );
        if (!res.ok) return;

        const rows = await res.json();
        const data = {};
        rows.forEach(r => data[r.section_key] = r.content);

        // Always apply fresh Supabase DB content to DOM and sync localStorage cache
        applyCMSData(data);
        localStorage.setItem(CMS_CACHE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn('CMS background refresh failed:', e.message);
    }
}

// ─── Initialise ───────────────────────────────────────────────────────────────
applyCache();
document.addEventListener('DOMContentLoaded', fetchAndRefresh);
