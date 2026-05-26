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

const CMS_CACHE_KEY = 'slc_cms_cache';
const SUPABASE_URL  = 'https://uwhujavrrdzzwxunrlzu.supabase.co';
const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3aHVqYXZycmR6end4dW5ybHp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MzE1MDAsImV4cCI6MjA4NjUwNzUwMH0.l9qlQDGwJLKcyiq0saQamT91s44qHT3MDnG8s2FINvk';

// ─── Core injector ────────────────────────────────────────────────────────────
function applyCMSData(data) {
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

        // Compare with cache — only update DOM and cache if something changed
        const cached = localStorage.getItem(CMS_CACHE_KEY);
        const fresh  = JSON.stringify(data);
        if (cached !== fresh) {
            applyCMSData(data);
            localStorage.setItem(CMS_CACHE_KEY, fresh);
        }
    } catch (e) {
        // Network failure — cached content already showing, no action needed
        console.warn('CMS background refresh failed:', e.message);
    }
}

// ─── Initialise ───────────────────────────────────────────────────────────────
// Apply cache immediately (synchronous) to prevent any visible flash
applyCache();

// Then fetch fresh data once the page is fully loaded
document.addEventListener('DOMContentLoaded', fetchAndRefresh);
