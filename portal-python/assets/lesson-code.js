/* Vektia Python, code blocks on lesson pages
   - lightweight Python highlighter (theme-aware via CSS tokens, no external dependency)
   - language label + copy button on every <pre><code class="language-*">
   - horizontal scroll wrapper for tables
*/
(function () {
  const KW = new Set(('False None True and as assert async await break case class continue def del elif else ' +
    'except finally for from global if import in is lambda match nonlocal not or pass raise return try type ' +
    'while with yield').split(' '));
  const BI = new Set(('abs all any ascii bin bool breakpoint bytearray bytes callable chr classmethod compile ' +
    'complex delattr dict dir divmod enumerate eval exec filter float format frozenset getattr globals hasattr ' +
    'hash help hex id input int isinstance issubclass iter len list locals map max memoryview min next object ' +
    'oct open ord pow print property range repr reversed round set setattr slice sorted staticmethod str sum ' +
    'super tuple vars zip self cls Exception ValueError TypeError KeyError IndexError RuntimeError StopIteration ' +
    'NotImplementedError AttributeError').split(' '));

  const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const TOKEN = new RegExp([
    '(#[^\\n]*)',                                                   // 1 comment
    '((?:[rRbBuUfF]{1,2})?(?:"""[\\s\\S]*?"""|\'\'\'[\\s\\S]*?\'\'\'|"(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\'))', // 2 string
    '(@[A-Za-z_][\\w.]*)',                                          // 3 decorator
    '\\b(\\d[\\d_]*(?:\\.\\d+)?(?:[eE][+-]?\\d+)?j?)\\b',           // 4 number
    '([A-Za-z_]\\w*)',                                              // 5 identifier
  ].join('|'), 'g');

  function highlightPython(src) {
    let out = '', last = 0, prev = '', m;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(src))) {
      out += esc(src.slice(last, m.index));
      const tok = m[0];
      if (m[1]) out += `<span class="tk-cm">${esc(tok)}</span>`;
      else if (m[2]) out += `<span class="tk-str">${esc(tok)}</span>`;
      else if (m[3]) out += `<span class="tk-deco">${esc(tok)}</span>`;
      else if (m[4]) out += `<span class="tk-num">${tok}</span>`;
      else if (m[5]) {
        if (prev === 'def' || prev === 'class') out += `<span class="tk-fn">${tok}</span>`;
        else if (KW.has(tok)) out += `<span class="tk-kw">${tok}</span>`;
        else if (BI.has(tok)) out += `<span class="tk-bi">${tok}</span>`;
        else out += tok;
        prev = tok;
        last = TOKEN.lastIndex;
        continue;
      }
      prev = '';
      last = TOKEN.lastIndex;
    }
    return out + esc(src.slice(last));
  }

  function enhanceCode(root) {
    (root || document).querySelectorAll('.sb-body pre > code').forEach(code => {
      const pre = code.parentElement;
      if (pre.classList.contains('code-pre')) return;
      const lang = ((code.className.match(/language-(\w+)/) || [])[1] || '').toLowerCase();
      const raw = code.textContent.replace(/^\n/, '');
      if (lang === 'python') code.innerHTML = highlightPython(raw);
      else code.textContent = raw;
      pre.classList.add('code-pre');
      const bar = document.createElement('div');
      bar.className = 'code-bar';
      bar.innerHTML = `<span class="code-lang">${lang || 'code'}</span><button type="button" class="code-copy">copiar</button>`;
      pre.insertBefore(bar, code);
      bar.querySelector('.code-copy').addEventListener('click', async e => {
        const b = e.currentTarget;
        try { await navigator.clipboard.writeText(raw); b.textContent = 'copiado ✓'; }
        catch (_) { b.textContent = 'falhou'; }
        setTimeout(() => { b.textContent = 'copiar'; }, 1400);
      });
    });
    (root || document).querySelectorAll('.sb-body table').forEach(t => {
      if (t.parentElement.classList.contains('table-wrap')) return;
      const w = document.createElement('div');
      w.className = 'table-wrap';
      t.parentNode.insertBefore(w, t);
      w.appendChild(t);
    });
  }

  window.LessonCode = {
    highlightPython,
    enhanceCode,
    REF_LABEL: { livro: 'Livro', curso: 'Curso', video: 'Vídeo', podcast: 'Podcast', artigo: 'Artigo', paper: 'Paper', doc: 'Documentação', portal: 'Portal' },
  };
})();
