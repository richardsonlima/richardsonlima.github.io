/* ML Portal — shared chrome + progress + theme
   - Renders topbar (with theme toggle) and footer
   - Tracks completion in localStorage
   - Handles theme switching
   - Exposes window.MLPortal
*/

(function () {
  const KEY = 'ml_portal_progress_v1';
  const THEME_KEY = 'ml_portal_theme';

  const TOTAL_LESSONS = 50;
  const NAV = [
    { href: 'index.html',      label: 'Início',     key: 'home' },
    { href: 'curriculum.html', label: 'Trilha',     key: 'curriculum' },
    { href: 'lessons.html',    label: 'Algoritmos', key: 'lessons' },
    { href: 'interview.html',  label: 'Flashcards', key: 'interview' },
    { href: 'resources.html',  label: 'Recursos',   key: 'resources' },
    { href: 'glossary.html',   label: 'Glossário',  key: 'glossary' },
  ];

  // ----- progress -----
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (_) { return {}; }
  }
  function save(state) { localStorage.setItem(KEY, JSON.stringify(state)); }

  function isDone(id) { return !!load()[id]; }
  function setDone(id, val) {
    const s = load();
    if (val) s[id] = Date.now();
    else delete s[id];
    save(s);
    window.dispatchEvent(new CustomEvent('mlp:progress', { detail: { id, done: !!val } }));
  }
  function toggle(id) { setDone(id, !isDone(id)); return isDone(id); }
  function completedCount() { return Object.keys(load()).length; }

  // ===== SUB-PROGRESS (sections within a lesson) =====
  const SUB_KEY = 'ml_portal_subprogress_v1';
  function loadSubs() {
    try { return JSON.parse(localStorage.getItem(SUB_KEY)) || {}; }
    catch (_) { return {}; }
  }
  function saveSubs(s) { localStorage.setItem(SUB_KEY, JSON.stringify(s)); }

  function subKey(lessonId, sectionId) { return lessonId + '::' + sectionId; }
  function subIsDone(lessonId, sectionId) { return !!loadSubs()[subKey(lessonId, sectionId)]; }
  function subSetDone(lessonId, sectionId, val) {
    const s = loadSubs();
    const k = subKey(lessonId, sectionId);
    if (val) s[k] = Date.now();
    else delete s[k];
    saveSubs(s);
    window.dispatchEvent(new CustomEvent('mlp:subprogress', { detail: { lessonId, sectionId, done: !!val } }));
  }
  function subToggle(lessonId, sectionId) {
    subSetDone(lessonId, sectionId, !subIsDone(lessonId, sectionId));
    return subIsDone(lessonId, sectionId);
  }
  // Returns { done, total, pct } given a list of section ids
  function lessonProgress(lessonId, sectionIds) {
    if (!Array.isArray(sectionIds) || sectionIds.length === 0) return { done: 0, total: 0, pct: 0 };
    const subs = loadSubs();
    const done = sectionIds.reduce((acc, sid) => acc + (subs[subKey(lessonId, sid)] ? 1 : 0), 0);
    return { done, total: sectionIds.length, pct: Math.round(100 * done / sectionIds.length) };
  }
  // Auto-sync lesson done flag based on section completion (called by lesson page)
  function syncLessonDoneFromSubs(lessonId, sectionIds) {
    const p = lessonProgress(lessonId, sectionIds);
    if (p.total === 0) return;
    const allDone = p.done === p.total;
    if (allDone && !isDone(lessonId)) setDone(lessonId, true);
    else if (!allDone && isDone(lessonId)) setDone(lessonId, false);
  }

  // ----- theme -----
  function getTheme() { return document.documentElement.getAttribute('data-theme') || 'light'; }
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem(THEME_KEY, t); } catch (_) {}
    window.dispatchEvent(new CustomEvent('mlp:theme', { detail: { theme: t } }));
  }
  function toggleTheme() { setTheme(getTheme() === 'dark' ? 'light' : 'dark'); }

  // ----- topbar -----
  const SUN_ICON = '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  const MOON_ICON = '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function renderTopbar(activeKey) {
    const links = NAV.map(n =>
      `<a href="${n.href}" data-key="${n.key}" ${n.key === activeKey ? 'class="active"' : ''}>${n.label}</a>`
    ).join('');
    const total = TOTAL_LESSONS;
    const done = completedCount();
    return `
      <div class="topbar">
        <a class="brand" href="index.html">
          <div class="brand-mark">ml</div>
          <div>
            <div class="brand-name">Portal de ML</div>
            <div class="brand-sub">Desafio · Sênior</div>
          </div>
        </a>
        <nav class="topnav">${links}</nav>
        <div class="topbar-right">
          <div class="streak" id="mlp-streak" title="Lições concluídas">
            <span class="streak-dot"></span>
            <span id="mlp-streak-text">${done}/${total}</span>
          </div>
          <button class="theme-toggle" id="mlp-theme-toggle" title="Alternar tema (light/dark)" aria-label="Alternar tema">
            ${SUN_ICON}${MOON_ICON}
          </button>
        </div>
      </div>
    `;
  }

  function renderFooter() {
    const year = new Date().getFullYear();
    return `
      <footer class="portal-foot">
        <span>Portal de ML · Desafio Machine Learning · ${year}</span>
        <span>paradigmas → algoritmos → engenharia → produção</span>
      </footer>
    `;
  }

  function mount(activeKey) {
    const top = document.getElementById('mlp-topbar');
    if (top) top.innerHTML = renderTopbar(activeKey);
    const foot = document.getElementById('mlp-footer');
    if (foot) foot.innerHTML = renderFooter();

    // theme toggle wiring
    const btn = document.getElementById('mlp-theme-toggle');
    if (btn) btn.addEventListener('click', toggleTheme);

    // refresh streak when progress changes
    window.addEventListener('mlp:progress', () => {
      const el = document.getElementById('mlp-streak-text');
      if (el) el.textContent = `${completedCount()}/${TOTAL_LESSONS}`;
    });

    // keyboard shortcut: T toggles theme (when not typing)
    document.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 't' || e.key === 'T') toggleTheme();
    });
  }

  // ----- checkboxes binding -----
  function bindCheckboxes(rootSelector) {
    const root = document.querySelector(rootSelector || 'body');
    if (!root) return;
    root.querySelectorAll('[data-progress-id]').forEach(el => {
      const id = el.dataset.progressId;
      if (isDone(id)) el.classList.add('done');
      el.addEventListener('click', () => {
        toggle(id);
        el.classList.toggle('done');
      });
    });
  }

  // ===== STATE COLLECTION =====
  // All persisted keys consolidated into one snapshot
  const FC_STATS_KEY = 'ml_portal_fc_stats_v1';
  const SYNC_HANDLE_KEY = 'ml_portal_sync_handle'; // IndexedDB key

  function snapshot() {
    const progress = load();
    const subprogress = loadSubs();
    let fcStats = { seen: 0, hit: 0, miss: 0 };
    try { fcStats = JSON.parse(localStorage.getItem(FC_STATS_KEY)) || fcStats; } catch(_) {}
    const theme = (function(){ try { return localStorage.getItem(THEME_KEY) || 'light'; } catch(_) { return 'light'; } })();
    return {
      version: 2,
      exportedAt: new Date().toISOString(),
      progress,
      subprogress,
      fcStats,
      theme,
    };
  }

  function applySnapshot(snap, mode = 'merge') {
    if (!snap || typeof snap !== 'object') throw new Error('Snapshot inválido');
    if (mode === 'replace') {
      localStorage.removeItem(KEY);
      localStorage.removeItem(FC_STATS_KEY);
      localStorage.removeItem(SUB_KEY);
    }
    if (snap.progress && typeof snap.progress === 'object') {
      const current = load();
      const merged = { ...current };
      Object.entries(snap.progress).forEach(([id, val]) => {
        if (!val) return;
        const incoming = typeof val === 'number' ? val : Date.now();
        if (!merged[id] || incoming > merged[id]) merged[id] = incoming;
      });
      save(merged);
    }
    if (snap.subprogress && typeof snap.subprogress === 'object') {
      const current = loadSubs();
      const merged = { ...current };
      Object.entries(snap.subprogress).forEach(([k, val]) => {
        if (!val) return;
        const incoming = typeof val === 'number' ? val : Date.now();
        if (!merged[k] || incoming > merged[k]) merged[k] = incoming;
      });
      saveSubs(merged);
    }
    if (snap.fcStats) {
      let cur = { seen: 0, hit: 0, miss: 0 };
      try { cur = JSON.parse(localStorage.getItem(FC_STATS_KEY)) || cur; } catch(_) {}
      const merged = {
        seen: Math.max(cur.seen || 0, snap.fcStats.seen || 0),
        hit:  Math.max(cur.hit  || 0, snap.fcStats.hit  || 0),
        miss: Math.max(cur.miss || 0, snap.fcStats.miss || 0),
      };
      localStorage.setItem(FC_STATS_KEY, JSON.stringify(merged));
    }
    if (snap.theme && (snap.theme === 'light' || snap.theme === 'dark')) {
      setTheme(snap.theme);
    }
    window.dispatchEvent(new CustomEvent('mlp:progress', { detail: { imported: true } }));
  }

  // ===== MARKDOWN EXPORT =====
  function pad(n) { return String(n).padStart(2,'0'); }
  function fmtDate(ms) {
    if (!ms) return '';
    const d = new Date(ms);
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  }

  function exportMarkdown() {
    const snap = snapshot();
    const catalog = window.LESSON_CATALOG || [];
    const totalDone = Object.keys(snap.progress).length;
    const totalAll = catalog.reduce((s, e) => s + e.lessons.length, 0) || TOTAL_LESSONS;
    const pct = totalAll ? Math.round(100 * totalDone / totalAll) : 0;

    // current stage = first stage with incomplete lessons
    let currentStage = catalog[catalog.length - 1] || { n: 0, title: '—' };
    for (const e of catalog) {
      const ld = e.lessons.filter(l => snap.progress[l.id]).length;
      if (ld < e.lessons.length) { currentStage = e; break; }
    }

    const fc = snap.fcStats || { seen: 0, hit: 0, miss: 0 };
    const fcTotal = (fc.hit || 0) + (fc.miss || 0);
    const fcRate = fcTotal ? Math.round(100 * fc.hit / fcTotal) : 0;

    const now = new Date();
    const stamp = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    let md = `# Portal de ML — Progresso\n\n`;
    md += `**Exportado em** ${stamp}  \n`;
    md += `**Versão** ${snap.version}\n\n`;
    md += `## Resumo\n\n`;
    md += `- **Lições concluídas:** ${totalDone}/${totalAll} (${pct}%)\n`;
    md += `- **Etapa atual:** Etapa ${pad(currentStage.n)} — ${currentStage.title}\n`;
    md += `- **Flashcards:** ${fc.seen} vistos · ${fc.hit} acertos · ${fc.miss} erros${fcTotal ? ` (${fcRate}% de acerto)` : ''}\n`;
    md += `- **Tema:** ${snap.theme}\n\n`;

    if (catalog.length) {
      md += `## Trilha\n\n`;
      catalog.forEach(e => {
        md += `### Etapa ${pad(e.n)} — ${e.title}\n\n`;
        e.lessons.forEach(l => {
          const done = !!snap.progress[l.id];
          const mark = done ? 'x' : ' ';
          const when = done ? ` _(${fmtDate(snap.progress[l.id])})_` : '';
          md += `- [${mark}] **${l.title}** \`${l.id}\`${when}\n`;
        });
        md += `\n`;
      });
    }

    md += `---\n\n`;
    md += `## Estado (não editar à mão — usado para import)\n\n`;
    md += '```json\n' + JSON.stringify(snap, null, 2) + '\n```\n';

    return md;
  }

  function exportJSON() {
    return JSON.stringify(snapshot(), null, 2);
  }

  // ===== IMPORT =====
  function parseImport(text) {
    // 1) Try fenced JSON block first
    const fenceMatch = text.match(/```json\s*\n([\s\S]*?)\n```/);
    if (fenceMatch) {
      try { return JSON.parse(fenceMatch[1]); } catch(_) { /* fall through */ }
    }
    // 2) Try parsing the whole text as JSON
    try { return JSON.parse(text); } catch(_) {}
    // 3) Fallback: parse markdown checkboxes — `- [x] ... `slug`` lines
    const progress = {};
    const lineRe = /^- \[(x|X)\] .*?`([a-z0-9-]+)`/gm;
    let m;
    while ((m = lineRe.exec(text)) !== null) {
      progress[m[2]] = Date.now();
    }
    if (Object.keys(progress).length === 0) {
      throw new Error('Nenhum dado reconhecido no arquivo.');
    }
    return { version: 1, progress, fcStats: { seen:0, hit:0, miss:0 } };
  }

  function importText(text, mode = 'merge') {
    const snap = parseImport(text);
    applySnapshot(snap, mode);
    return snap;
  }

  // ===== FILE I/O =====
  function downloadBlob(name, content, mime = 'text/plain') {
    const blob = new Blob([content], { type: mime + ';charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
  }

  function downloadMarkdown() {
    const d = new Date();
    const stamp = `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`;
    downloadBlob(`ml-portal-progresso-${stamp}.md`, exportMarkdown(), 'text/markdown');
  }
  function downloadJSON() {
    const d = new Date();
    const stamp = `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`;
    downloadBlob(`ml-portal-progresso-${stamp}.json`, exportJSON(), 'application/json');
  }

  function pickAndImport(mode = 'merge') {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.md,.markdown,.json,.txt';
      input.onchange = async () => {
        const file = input.files && input.files[0];
        if (!file) return reject(new Error('Cancelado'));
        try {
          const text = await file.text();
          const snap = importText(text, mode);
          resolve(snap);
        } catch (err) { reject(err); }
      };
      input.click();
    });
  }

  // ===== FILE SYSTEM ACCESS API (auto-sync) =====
  const fsaSupported = 'showSaveFilePicker' in window && 'showOpenFilePicker' in window;

  // tiny IndexedDB helper to store FileSystemFileHandle
  function idbReady() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('ml_portal', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('kv');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  async function idbGet(key) {
    try {
      const db = await idbReady();
      return await new Promise((res, rej) => {
        const tx = db.transaction('kv', 'readonly');
        const req = tx.objectStore('kv').get(key);
        req.onsuccess = () => res(req.result);
        req.onerror = () => rej(req.error);
      });
    } catch (_) { return null; }
  }
  async function idbSet(key, val) {
    try {
      const db = await idbReady();
      await new Promise((res, rej) => {
        const tx = db.transaction('kv', 'readwrite');
        tx.objectStore('kv').put(val, key);
        tx.oncomplete = () => res();
        tx.onerror = () => rej(tx.error);
      });
    } catch (_) {}
  }
  async function idbDel(key) {
    try {
      const db = await idbReady();
      await new Promise((res, rej) => {
        const tx = db.transaction('kv', 'readwrite');
        tx.objectStore('kv').delete(key);
        tx.oncomplete = () => res();
        tx.onerror = () => rej(tx.error);
      });
    } catch (_) {}
  }

  let cachedHandle = null;
  async function getSyncHandle() {
    if (cachedHandle) return cachedHandle;
    if (!fsaSupported) return null;
    cachedHandle = await idbGet(SYNC_HANDLE_KEY);
    return cachedHandle || null;
  }

  async function connectSyncFile() {
    if (!fsaSupported) throw new Error('Seu browser não suporta File System Access API. Use Chrome/Edge.');
    const handle = await window.showSaveFilePicker({
      suggestedName: 'ml-portal-progresso.md',
      types: [{ description: 'Markdown', accept: { 'text/markdown': ['.md'] } }]
    });
    cachedHandle = handle;
    await idbSet(SYNC_HANDLE_KEY, handle);
    await writeSyncFile();
    return handle;
  }

  async function loadFromSyncFile() {
    if (!fsaSupported) throw new Error('FSA não suportado.');
    const [handle] = await window.showOpenFilePicker({
      types: [{ description: 'Markdown/JSON', accept: { 'text/markdown': ['.md'], 'application/json': ['.json'] } }]
    });
    cachedHandle = handle;
    await idbSet(SYNC_HANDLE_KEY, handle);
    const file = await handle.getFile();
    const text = await file.text();
    return importText(text, 'merge');
  }

  async function disconnectSyncFile() {
    cachedHandle = null;
    await idbDel(SYNC_HANDLE_KEY);
  }

  async function ensurePermission(handle, mode = 'readwrite') {
    if (!handle || !handle.queryPermission) return true;
    let perm = await handle.queryPermission({ mode });
    if (perm === 'granted') return true;
    perm = await handle.requestPermission({ mode });
    return perm === 'granted';
  }

  async function writeSyncFile() {
    const handle = await getSyncHandle();
    if (!handle) return false;
    const ok = await ensurePermission(handle, 'readwrite');
    if (!ok) return false;
    try {
      const writable = await handle.createWritable();
      await writable.write(exportMarkdown());
      await writable.close();
      return true;
    } catch (err) {
      console.warn('Sync write falhou:', err);
      return false;
    }
  }

  // auto-write on every state change (debounced)
  let syncTimer = null;
  function scheduleSyncWrite() {
    if (!fsaSupported) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => { writeSyncFile(); }, 500);
  }
  window.addEventListener('mlp:progress', scheduleSyncWrite);
  window.addEventListener('mlp:theme', scheduleSyncWrite);
  window.addEventListener('mlp:fcstats', scheduleSyncWrite);

  // ----- expose -----
  window.MLPortal = {
    NAV,
    TOTAL_LESSONS,
    mount,
    bindCheckboxes,
    isDone, setDone, toggle,
    completedCount,
    getTheme, setTheme, toggleTheme,
    reset: () => {
      localStorage.removeItem(KEY);
      localStorage.removeItem(FC_STATS_KEY);
      localStorage.removeItem(SUB_KEY);
      window.dispatchEvent(new CustomEvent('mlp:progress', { detail: {} }));
      window.dispatchEvent(new CustomEvent('mlp:subprogress', { detail: {} }));
    },
    // Sub-progress API
    subIsDone, subSetDone, subToggle,
    lessonProgress, syncLessonDoneFromSubs,
    // Data API
    snapshot,
    applySnapshot,
    exportMarkdown, exportJSON,
    downloadMarkdown, downloadJSON,
    pickAndImport,
    importText,
    // File System Access (auto-sync)
    fsaSupported,
    getSyncHandle,
    connectSyncFile,
    loadFromSyncFile,
    disconnectSyncFile,
    writeSyncFile,
  };
})();
