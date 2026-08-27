/* ML Portal, i18n engine (same technique as mestrado.html, adapted to a multi-page portal)
   - I18N.register({ "pt string": "en string" }) dictionaries, loaded per page
   - setLang('en'|'pt') persists the choice, sets <html lang>, marks [data-lang-value]
     buttons active and runs every RERENDER callback
   - pick(obj) / pick(obj,'field') for data objects that carry both languages
   - Because most of this portal's content is rendered by page scripts from
     Portuguese data files, a MutationObserver re-applies the dictionary to anything
     injected after load. Strings without an entry simply stay in Portuguese.

   Load in <head> right after theme-init.js so <html lang> is set before first paint. */
(function () {
  var LANG_KEY = 'ml_portal_lang';
  var DEFAULT_LANG = 'en';           // English is the default

  var dict = Object.create(null);    // pt -> en
  var patterns = [];                 // [regex, replacement] for interpolated strings
  var keyed = { en: Object.create(null), pt: Object.create(null) };
  var lang = DEFAULT_LANG;
  var applying = false;
  var observer = null;
  var timer = null;

  try {
    var stored = localStorage.getItem(LANG_KEY);
    if (stored === 'pt' || stored === 'en') lang = stored;
  } catch (_) {}

  document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'pt-BR');

  var origText = new WeakMap();
  var origAttr = new WeakMap();

  var SKIP = { SCRIPT: 1, STYLE: 1, CODE: 1, PRE: 1, TEXTAREA: 1, NOSCRIPT: 1 };
  var ATTRS = ['placeholder', 'title', 'aria-label'];

  function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }

  function register(map) {
    if (!map) return;
    for (var k in map) if (Object.prototype.hasOwnProperty.call(map, k)) dict[k] = map[k];
    if (lang === 'en') schedule();
  }

  /* keyed dictionary, for pages that prefer explicit data-i18n="key" markup */
  function registerKeys(byLang) {
    if (!byLang) return;
    ['en', 'pt'].forEach(function (l) {
      if (!byLang[l]) return;
      for (var k in byLang[l]) if (Object.prototype.hasOwnProperty.call(byLang[l], k)) keyed[l][k] = byLang[l][k];
    });
    schedule();
  }

  /* patterns for strings built with interpolated values, e.g. "5 lições" */
  function registerPatterns(list) {
    if (!list) return;
    list.forEach(function (p) { patterns.push(p); });
    if (lang === 'en') schedule();
  }

  function lookup(pt) {
    var v = dict[pt];
    if (v != null) return v;
    var m = pt.match(/^(.*?)([.:;,!?…]+)$/);
    if (m && dict[m[1]] != null) return dict[m[1]] + m[2];
    for (var i = 0; i < patterns.length; i++) {
      if (patterns[i][0].test(pt)) return pt.replace(patterns[i][0], patterns[i][1]);
    }
    return null;
  }

  function applyKeyed() {
    var table = keyed[lang];
    if (!table) return;
    document.querySelectorAll('[data-i18n]').forEach(function (node) {
      var v = table[node.getAttribute('data-i18n')];
      if (v != null) node.innerHTML = v;
    });
  }

  function translateTextNodes(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !/[A-Za-zÀ-ÿ]/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
        var p = n.parentNode;
        if (!p || SKIP[p.nodeName]) return NodeFilter.FILTER_REJECT;
        if (p.closest && (p.closest('[data-i18n]') || p.closest('[data-i18n-skip]'))) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);

    nodes.forEach(function (node) {
      if (lang === 'pt') {
        if (origText.has(node)) { node.nodeValue = origText.get(node); origText.delete(node); }
        return;
      }
      var raw = node.nodeValue;
      var key = origText.has(node) ? norm(origText.get(node)) : norm(raw);
      var hit = lookup(key);
      if (hit == null || hit === key) return;
      if (!origText.has(node)) origText.set(node, raw);
      var lead = (raw.match(/^\s*/) || [''])[0];
      var tail = (raw.match(/\s*$/) || [''])[0];
      node.nodeValue = lead + hit + tail;
    });
  }

  function translateAttributes(root) {
    var sel = ATTRS.map(function (a) { return '[' + a + ']'; }).join(',');
    var els = [];
    if (root.matches && root.matches(sel)) els.push(root);
    if (root.querySelectorAll) els = els.concat(Array.prototype.slice.call(root.querySelectorAll(sel)));

    els.forEach(function (el) {
      var store = origAttr.get(el);
      ATTRS.forEach(function (a) {
        if (!el.hasAttribute(a)) return;
        if (lang === 'pt') {
          if (store && store[a] != null) el.setAttribute(a, store[a]);
          return;
        }
        var cur = el.getAttribute(a);
        var key = (store && store[a] != null) ? norm(store[a]) : norm(cur);
        var hit = lookup(key);
        if (hit == null || hit === key) return;
        if (!store) { store = {}; origAttr.set(el, store); }
        if (store[a] == null) store[a] = cur;
        el.setAttribute(a, hit);
      });
    });
  }

  function translateTitle() {
    if (!document.title) return;
    if (lang === 'pt') {
      if (origText.has(document)) { document.title = origText.get(document); origText.delete(document); }
      return;
    }
    var key = origText.has(document) ? norm(origText.get(document)) : norm(document.title);
    var hit = lookup(key);
    if (hit == null || hit === key) return;
    if (!origText.has(document)) origText.set(document, document.title);
    document.title = hit;
  }

  function apply(root) {
    root = root || document.body;
    if (!root) return;
    applying = true;
    try {
      applyKeyed();
      translateTextNodes(root);
      translateAttributes(root);
      if (root === document.body) translateTitle();
    } finally {
      applying = false;
    }
  }

  function schedule(root) {
    clearTimeout(timer);
    timer = setTimeout(function () { apply(root); }, 16);
  }

  function startObserver() {
    if (observer || !document.body || typeof MutationObserver === 'undefined') return;
    observer = new MutationObserver(function (muts) {
      if (applying) return;
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if ((m.type === 'childList' && m.addedNodes.length) || m.type === 'characterData' || m.type === 'attributes') {
          schedule(); return;
        }
      }
    });
    observer.observe(document.body, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ATTRS
    });
  }

  function markButtons() {
    document.querySelectorAll('[data-lang-value]').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang-value') === lang);
    });
  }

  function getLang() { return lang; }

  function setLang(l) {
    if (l !== 'en' && l !== 'pt') return;
    var changed = l !== lang;
    lang = l;
    try { localStorage.setItem(LANG_KEY, l); } catch (_) {}
    document.documentElement.setAttribute('lang', l === 'en' ? 'en' : 'pt-BR');
    apply(document.body);
    markButtons();
    if (changed) {
      window.RERENDER.forEach(function (fn) { try { fn(l); } catch (e) { console.warn(e); } });
      window.dispatchEvent(new CustomEvent('mlp:lang', { detail: { lang: l } }));
      schedule();
    }
  }

  function toggleLang() { setLang(lang === 'en' ? 'pt' : 'en'); }

  /* pick({en:'...', pt:'...'})  or  pick(lesson, 'title') -> lesson.title_en when in EN */
  function pick(obj, field) {
    if (!obj) return '';
    if (field == null) return obj[lang] != null ? obj[lang] : obj.en;
    if (lang === 'en' && obj[field + '_en'] != null) return obj[field + '_en'];
    var v = obj[field];
    if (lang === 'en' && typeof v === 'string') {
      var hit = lookup(norm(v));
      if (hit != null) return hit;
    }
    return v;
  }

  function t(s) {
    if (lang !== 'en' || s == null) return s;
    var hit = lookup(norm(s));
    return hit == null ? s : hit;
  }

  /* callbacks that re-render JS-built content after a language switch */
  window.RERENDER = window.RERENDER || [];

  window.I18N = {
    register: register,
    registerKeys: registerKeys,
    registerPatterns: registerPatterns,
    apply: apply,
    getLang: getLang,
    setLang: setLang,
    toggleLang: toggleLang,
    pick: pick,
    t: t,
    get dict() { return dict; }
  };

  // mestrado-compatible globals
  window.setLang = setLang;
  window.pick = pick;
  Object.defineProperty(window, 'CURRENT_LANG', { get: function () { return lang; } });

  function boot() {
    apply(document.body);
    markButtons();
    startObserver();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
