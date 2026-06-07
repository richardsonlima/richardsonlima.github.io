/* ============================================================
   MESTRADO · CORE
   Shared logic for all visual directions:
   i18n (PT-BR / EN), regressive countdown, theme + language,
   research data and small render helpers.
   ============================================================ */

/* ---- Regular-student deadline -----------------------------------------
   Admission as regular student: 2025.1 (first semester 2025).
   Maximum regulation limit to finish: June 2027 (2027.1).
   Adjust the date below if the official deadline differs.            */
const ITA_DEADLINE = new Date('2027-06-30T23:59:59-03:00');

/* ============================ I18N ============================ */
const I18N = {
  en: {
    nav_brand: "Richardson Lima",
    nav_unit: "ITA · PG-EEC",
    hero_eyebrow: "ITA · PG-EEC · Electronic & Computer Engineering (EEC-I · Informatics)",
    hero_title: "Chaos Engineering<br>&amp; Dependability",
    hero_desc: "Master&rsquo;s research at <b>ITA</b> developing <b>MECADE</b>, a Chaos Engineering model for assessing dependability assurance in mission-critical distributed systems.",

    cd_label: "Time left as regular student",
    cd_sub: "Admitted 2025.1 · maximum limit 2027.1",
    cd_years: "years", cd_months: "months", cd_days: "days",
    cd_hours: "hours", cd_mins: "min", cd_secs: "sec",
    cd_target: "Deadline · 2027.1",

    f_inst: "Institution", f_inst_v: "ITA (PG-EEC)",
    f_status: "Enrollment status", f_status_v: "Regular Student",
    f_adv: "Advisor", f_adv_v: "Prof. Dr. Johnny Marques",
    f_group: "Research group", f_group_v: "GIMPS",

    links_title: "Quick links",
    lnk_cal: "Academic calendar", lnk_gimps: "GIMPS group",
    lnk_master: "Master&rsquo;s info", lnk_sel: "Selection", lnk_pgeec: "PG-EEC",

    mc_label: "The model",
    mc_name: "MECADE",
    mc_full: "Chaos Engineering Model for Dependability Assurance Assessment",
    mc_desc: "MECADE structures a Chaos Engineering cycle integrated with intelligent observability to surface non-trivial <b>gray failures</b> and evolve systems toward <b>active tolerance</b>, reducing <b>MTTR</b> and <b>RTO</b> in critical distributed environments.",
    mc_layers_label: "Seven layers",
    mc_cta_title: "Help validate MECADE",
    mc_cta_desc: "A ~10-minute expert survey for SRE, Distributed Systems and Chaos Engineering practitioners on the framework&rsquo;s applicability and consistency.",
    mc_cta_btn: "Open the survey",
    mc_repo: "Repository &amp; docs",
    mc_videos: "Video series (7 layers)",

    s1_label: "01 / Objective",
    s1_title: "Research core &amp; questions",
    t_id: "ID", t_q: "Research question", t_r: "Rationale",
    rq1_q: "Do similar models already exist?", rq1_r: "Avoid redundancy and position the contribution.",
    rq2_q: "What software types are developed?", rq2_r: "Map the open-source vs. commercial landscape.",
    rq3_q: "What links Chaos Eng. &amp; Dependability?", rq3_r: "Support strategic resilience actions.",

    s2_label: "02 / Timeline",
    s2_title: "Academic progress",
    tl1: "Started as Special Student", tl1_d: "Balancing the master&rsquo;s with professional life.",
    tl2: "Special Student (15 credits)", tl2_d: "Three years of foundational coursework.",
    tl3: "Admitted as Regular Graduate Student", tl3_d: "Start of the regular-student period.",
    tl4: "CT-234 Data Structures completed", tl4_d: "Last remaining coursework credit.",
    tl5: "Dissertation &amp; paper submissions", tl5_d: "MECADE validation, writing and LADC 2026.",
    tl6: "Regulation deadline · defense", tl6_d: "Final dissertation defense target.",

    s3_label: "03 / Curriculum",
    s3_title: "Credits &amp; records",
    c_code: "Code", c_name: "Course", c_status: "Status", c_credits: "Cr.",
    st_app: "Approved", st_prog: "In progress",
    c1: "Software Engineering Fundamentals",
    c2: "Teaching Internship I",
    c3: "Computing Research Methodology",
    c4: "Complex Systems Requirements Engineering",
    c5: "Quality, Reliability &amp; Security",
    c6: "Data Structures &amp; Complexity",
    c7: "M.Sc. Dissertation",

    s4_label: "04 / Mapping",
    s4_title: "Systematic mapping &amp; SLM base",
    m_g1: "Taxonomy &amp; foundations",
    m_g2: "Chaos Engineering &amp; cloud",
    m_g3: "Critical domains",
    m_year: "Year", m_title: "Title", m_authors: "Authors",
    m_source: "Source", m_contrib: "Contribution", m_ref: "Key reference",
    m_domain: "Domain", m_context: "Context / study",

    s5_label: "05 / Output",
    s5_title: "Publications &amp; dissertation",
    p_type: "Type", p_item: "Item", p_status: "Status", p_access: "Access",
    p_profile_t: "Research profile", p_profile_i: "ResearchGate profile", p_active: "Active", p_open_profile: "Open profile",
    p_a1_t: "Article 1", p_a1_i: "First published paper (SBC / SBSI Estendido)", p_published: "Published", p_open_pub: "Open publication",
    p_a2_t: "Article 2", p_a2_i: "MECADE validation paper for LADC 2026", p_review: "Under review", p_confidential: "Confidential (blind review)",
    p_a3_t: "Article 3", p_a3_i: "Third paper in pipeline", p_backlog: "Backlog", p_pending: "Pending definition",
    p_diss_t: "M.Sc. Dissertation", p_diss_i: "Dissertation writing project", p_wip: "Writing", p_private: "Private",

    foot_updated: "Updated June 2026",
    foot_quote: "&ldquo;Standing on the shoulders of giants.&rdquo;",
    theme_light: "Light", theme_dark: "Dark"
  },

  pt: {
    nav_brand: "Richardson Lima",
    nav_unit: "ITA · PG-EEC",
    hero_eyebrow: "ITA · PG-EEC · Eng. Eletrônica e Computação (EEC-I · Informática)",
    hero_title: "Engenharia do Caos<br>&amp; Dependabilidade",
    hero_desc: "Pesquisa de mestrado no <b>ITA</b> desenvolvendo o <b>MECADE</b>, um Modelo de Engenharia do Caos para Avaliação da Garantia de Dependabilidade em sistemas distribuídos críticos.",

    cd_label: "Tempo restante como aluno regular",
    cd_sub: "Admissão 2025.1 · limite máximo 2027.1",
    cd_years: "anos", cd_months: "meses", cd_days: "dias",
    cd_hours: "horas", cd_mins: "min", cd_secs: "seg",
    cd_target: "Prazo · 2027.1",

    f_inst: "Instituição", f_inst_v: "ITA (PG-EEC)",
    f_status: "Situação de matrícula", f_status_v: "Aluno Regular",
    f_adv: "Orientador", f_adv_v: "Prof. Dr. Johnny Marques",
    f_group: "Grupo de pesquisa", f_group_v: "GIMPS",

    links_title: "Links rápidos",
    lnk_cal: "Calendário acadêmico", lnk_gimps: "Grupo GIMPS",
    lnk_master: "Info do mestrado", lnk_sel: "Seleção", lnk_pgeec: "PG-EEC",

    mc_label: "O modelo",
    mc_name: "MECADE",
    mc_full: "Modelo de Engenharia do Caos para Avaliação da Garantia de Dependabilidade",
    mc_desc: "O MECADE estrutura um ciclo de Engenharia do Caos integrado à observabilidade inteligente para revelar falhas não triviais (<b>gray failures</b>) e evoluir o sistema para uma postura de <b>tolerância ativa</b>, reduzindo <b>MTTR</b> e <b>RTO</b> em ambientes distribuídos críticos.",
    mc_layers_label: "Sete camadas",
    mc_cta_title: "Ajude a validar o MECADE",
    mc_cta_desc: "Um formulário de ~10 minutos para profissionais de SRE, Sistemas Distribuídos e Engenharia do Caos sobre a aplicabilidade e consistência do framework.",
    mc_cta_btn: "Abrir formulário",
    mc_repo: "Repositório &amp; docs",
    mc_videos: "Série de vídeos (7 camadas)",

    s1_label: "01 / Objetivo",
    s1_title: "Núcleo da pesquisa &amp; questões",
    t_id: "ID", t_q: "Questão de pesquisa", t_r: "Justificativa",
    rq1_q: "Já existem modelos similares?", rq1_r: "Evitar redundância e posicionar a contribuição.",
    rq2_q: "Que tipos de software são desenvolvidos?", rq2_r: "Mapear o cenário open-source vs. comercial.",
    rq3_q: "O que liga Eng. do Caos &amp; Dependabilidade?", rq3_r: "Apoiar ações estratégicas de resiliência.",

    s2_label: "02 / Linha do tempo",
    s2_title: "Progresso acadêmico",
    tl1: "Início como Aluno Especial", tl1_d: "Conciliando o mestrado com a vida profissional.",
    tl2: "Aluno Especial (15 créditos)", tl2_d: "Três anos de disciplinas de base.",
    tl3: "Admissão como Aluno Regular", tl3_d: "Início do período como aluno regular.",
    tl4: "CT-234 Estruturas de Dados concluída", tl4_d: "Último crédito de disciplina restante.",
    tl5: "Dissertação &amp; submissões", tl5_d: "Validação do MECADE, escrita e LADC 2026.",
    tl6: "Prazo regulamentar · defesa", tl6_d: "Meta de defesa final da dissertação.",

    s3_label: "03 / Currículo",
    s3_title: "Créditos &amp; registros",
    c_code: "Código", c_name: "Disciplina", c_status: "Status", c_credits: "Cr.",
    st_app: "Aprovado", st_prog: "Em curso",
    c1: "Fundamentos de Engenharia de Software",
    c2: "Estágio em Docência I",
    c3: "Metodologia de Pesquisa em Computação",
    c4: "Eng. de Requisitos de Sistemas Complexos",
    c5: "Qualidade, Confiabilidade &amp; Segurança",
    c6: "Estruturas de Dados &amp; Complexidade",
    c7: "Dissertação de Mestrado",

    s4_label: "04 / Mapeamento",
    s4_title: "Mapeamento sistemático &amp; base SLM",
    m_g1: "Taxonomia &amp; fundamentos",
    m_g2: "Engenharia do Caos &amp; nuvem",
    m_g3: "Domínios críticos",
    m_year: "Ano", m_title: "Título", m_authors: "Autores",
    m_source: "Fonte", m_contrib: "Contribuição", m_ref: "Referência",
    m_domain: "Domínio", m_context: "Contexto / estudo",

    s5_label: "05 / Produção",
    s5_title: "Publicações &amp; dissertação",
    p_type: "Tipo", p_item: "Item", p_status: "Status", p_access: "Acesso",
    p_profile_t: "Perfil de pesquisa", p_profile_i: "Perfil no ResearchGate", p_active: "Ativo", p_open_profile: "Abrir perfil",
    p_a1_t: "Artigo 1", p_a1_i: "Primeiro artigo publicado (SBC / SBSI Estendido)", p_published: "Publicado", p_open_pub: "Abrir publicação",
    p_a2_t: "Artigo 2", p_a2_i: "Artigo de validação do MECADE para a LADC 2026", p_review: "Em avaliação", p_confidential: "Confidencial (blind review)",
    p_a3_t: "Artigo 3", p_a3_i: "Terceiro artigo em pipeline", p_backlog: "Backlog", p_pending: "Definição pendente",
    p_diss_t: "Dissertação de Mestrado", p_diss_i: "Projeto de escrita da dissertação", p_wip: "Em escrita", p_private: "Privado",

    foot_updated: "Atualizado em junho de 2026",
    foot_quote: "&ldquo;Apoiado sobre os ombros de gigantes.&rdquo;",
    theme_light: "Claro", theme_dark: "Escuro"
  }
};

/* ============================ DATA ============================ */
const LINKS = {
  ita: "http://www.ita.br/",
  status: "http://www.ita.br/noticias323",
  advisor: "https://www.gimps.info/equipe/coordenador",
  calendar: "http://www.ita.br/posgrad/calendario",
  gimps: "https://www.gimps.info/home",
  master: "https://www.pgfis.ita.br/pt/post/mestrado",
  selection: "https://www.pgfis.ita.br/post/processo-seletivo",
  pgeec: "https://www.pgfis.ita.br/post/pg-eec",
  researchgate: "https://www.researchgate.net/profile/Richardson-Edson-De-Lima",
  article1: "https://sol.sbc.org.br/index.php/sbsi_estendido/article/view/21575",
  ladc: "https://ladc.sbc.org.br/2026/",
  mecadeRepo: "https://github.com/richardsonlima/mecade/blob/main/README.md",
  mecadeVideos: "https://www.youtube.com/watch?v=N6bE7Qh9pWc&list=PLkxSfloUbcmAlTUslIEu1mr4Nv1cviRAo",
  mecadeForm: "https://forms.gle/cWQhdargarRRThu68"
};

const MECADE_LAYERS = [
  { n: "01", en: ["Planning", "FMEA &amp; Chaos Budget"],            pt: ["Planejamento", "FMEA e Chaos Budget"] },
  { n: "02", en: ["Objectives &amp; Indicators", "η&#8201;I, η&#8201;t"], pt: ["Objetivos &amp; Indicadores", "η&#8201;I, η&#8201;t"] },
  { n: "03", en: ["Automatic Detection", "ALERT / LIMIT axioms"],    pt: ["Detecção Automática", "Axiomas ALERT / LIMIT"] },
  { n: "04", en: ["Technical Implementations", "Injection &amp; BLOCK"], pt: ["Implementações Técnicas", "Injeção e BLOCK"] },
  { n: "05", en: ["Integration", "Resilience as Code &amp; CI/CD"],  pt: ["Integração", "Resilience as Code e CI/CD"] },
  { n: "06", en: ["Audit", "Blockchain &amp; immutability"],         pt: ["Auditoria", "Blockchain e imutabilidade"] },
  { n: "07", en: ["Continuous Improvement", "Negative entropy"],     pt: ["Melhoria Contínua", "Entropia negativa"] }
];

const TIMELINE = [
  { time: "2021.1",      key: "tl1", state: "done" },
  { time: "2021–2024",   key: "tl2", state: "done" },
  { time: "2025.1",      key: "tl3", state: "done" },
  { time: "2025.2",      key: "tl4", state: "done" },
  { time: "2026",        key: "tl5", state: "active" },
  { time: "2027.1",      key: "tl6", state: "future" }
];

const COURSES = [
  ["CE-220", "c1", "app", "3"],
  ["CT-601", "c2", "app", "3"],
  ["CE-221", "c3", "app", "3"],
  ["CE-294", "c4", "app", "3"],
  ["CE-230", "c5", "app", "3"],
  ["CT-234", "c6", "app", "3"],
  ["CT-500", "c7", "prog", "·"]
];

const RQS = [
  ["RQ1", "rq1_q", "rq1_r"],
  ["RQ2", "rq2_q", "rq2_r"],
  ["RQ3", "rq3_q", "rq3_r"]
];

const MAP_G1 = [
  ["IM1", "2004", "Basic concepts and taxonomy of dependable and secure computing", "Avizienis et al. (IEEE TDSC)"],
  ["IM2", "2007", "Model-Based Analysis and Development of Dependable Systems", "C. Buckl et al. (Springer)"],
  ["IM8", "2019", "System Dependability: Benchmarking", "Y. Crouzet (Sem. Scholar)"],
  ["IM12", "2015", "Model for Assessing Internetware Dependability", "Huiqun Zhao et al. (IEEE)"]
];
const MAP_G2 = [
  ["EP1", "IEEE", "Security Chaos Engineering for Cloud Services", "K. A. Torkura et al. (2019)"],
  ["EP15", "Springer", "Scalability resilience via fault injection", "A. Al-Said Ahmad (2021)"],
  ["EP24", "IST", "Chaos Engineering: a Multi-Vocal Literature Review", "Owotogbe, J. et al. (2024)"],
  ["EP26", "IEEE", "Resilience Testing in Microservices Architectures", "Malilewa, A. B. et al. (2025)"],
  ["PAT1", "Patent", "Validating the resiliency of networked applications", "Orzell, G. S. (Netflix, 2012)"]
];
const MAP_G3 = [
  ["CD1", "Finance", "Chaos case study in financial systems", "Lee, J. et al. (2023)"],
  ["CD2", "Space", "Benchmarking satellite simulator resilience", "Azevedo, D. (INPE, 2014)"],
  ["CD3", "CPS", "Resilience of Cyber-Physical Systems", "Konstantinou, C. (2021)"]
];

/* ===================== STATE & HELPERS ===================== */
let CURRENT_LANG = 'en';
const RERENDER = [];
function onRender(fn) { RERENDER.push(fn); }
function L(key) { return (I18N[CURRENT_LANG] && I18N[CURRENT_LANG][key]) ?? (I18N.en[key] ?? key); }
function pick(obj) { return obj[CURRENT_LANG] ?? obj.en; }
function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}

/* ===================== LANGUAGE ===================== */
function setLang(lang) {
  CURRENT_LANG = lang;
  document.documentElement.setAttribute('lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(node => {
    const k = node.getAttribute('data-i18n');
    const v = I18N[lang][k];
    if (v != null) node.innerHTML = v;
  });
  document.querySelectorAll('[data-lang-value]').forEach(b =>
    b.classList.toggle('active', b.getAttribute('data-lang-value') === lang));
  RERENDER.forEach(fn => fn());
  try { localStorage.setItem('mestrado-lang', lang); } catch (e) {}
}
function initLang() {
  let saved = null;
  try { saved = localStorage.getItem('mestrado-lang'); } catch (e) {}
  if (saved !== 'pt' && saved !== 'en') {
    saved = (navigator.language || 'en').toLowerCase().startsWith('pt') ? 'pt' : 'en';
  }
  setLang(saved);
}

/* ===================== THEME ===================== */
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelectorAll('[data-theme-value]').forEach(b =>
    b.classList.toggle('active', b.getAttribute('data-theme-value') === theme));
  try { localStorage.setItem('mestrado-theme', theme); } catch (e) {}
}
function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem('mestrado-theme'); } catch (e) {}
  if (saved === 'light' || saved === 'dark') { setTheme(saved); return; }
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark ? 'dark' : 'light');
}

/* ===================== COUNTDOWN ===================== */
function calRemaining() {
  const now = new Date();
  const end = ITA_DEADLINE;
  if (end <= now) return { years: 0, months: 0, days: 0, hours: 0, mins: 0, secs: 0, done: true };
  let years = end.getFullYear() - now.getFullYear();
  let months = end.getMonth() - now.getMonth();
  let days = end.getDate() - now.getDate();
  let hours = end.getHours() - now.getHours();
  let mins = end.getMinutes() - now.getMinutes();
  let secs = end.getSeconds() - now.getSeconds();
  if (secs < 0) { secs += 60; mins--; }
  if (mins < 0) { mins += 60; hours--; }
  if (hours < 0) { hours += 24; days--; }
  if (days < 0) {
    const dim = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    days += dim; months--;
  }
  if (months < 0) { months += 12; years--; }
  return { years, months, days, hours, mins, secs, done: false };
}
function totalDaysRemaining() {
  const ms = ITA_DEADLINE - new Date();
  return Math.max(0, Math.floor(ms / 86400000));
}
// pad
function pad(n) { return String(n).padStart(2, '0'); }

/* Renders the countdown into elements identified by data-cd attributes:
   [data-cd="years"], "months","days","hours","mins","secs","totaldays". */
function startCountdown(root) {
  root = root || document;
  function tick() {
    const r = calRemaining();
    const map = { years: r.years, months: r.months, days: r.days, hours: pad(r.hours), mins: pad(r.mins), secs: pad(r.secs), totaldays: totalDaysRemaining() };
    Object.keys(map).forEach(k => {
      root.querySelectorAll('[data-cd="' + k + '"]').forEach(n => { n.textContent = map[k]; });
    });
  }
  tick();
  setInterval(tick, 1000);
}

/* ===================== RENDER HELPERS ===================== */
/* Generic table renderer.
   headerKeys: array of i18n keys (or {raw:'ID'} ) for <th>.
   rows: array of arrays; each cell is either an i18n key resolver via opts.cell or raw html.
   opts.cell(cellValue, colIndex, rowIndex) -> html string. */
function renderTable(container, headers, rows, cell) {
  container.innerHTML = '';
  const table = el('table');
  const thead = el('thead');
  const trh = el('tr');
  headers.forEach(h => trh.appendChild(el('th', null, h)));
  thead.appendChild(trh);
  table.appendChild(thead);
  const tbody = el('tbody');
  rows.forEach((row, ri) => {
    const tr = el('tr');
    row.forEach((c, ci) => tr.appendChild(el('td', null, cell(c, ci, ri))));
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  container.appendChild(table);
}

function badge(kind) {
  const map = {
    app: ['badge badge-ok', L('st_app')],
    prog: ['badge badge-prog', L('st_prog')],
    published: ['badge badge-ok', L('p_published')],
    review: ['badge badge-review', L('p_review')],
    backlog: ['badge badge-mute', L('p_backlog')],
    wip: ['badge badge-prog', L('p_wip')],
    active: ['badge badge-ok', L('p_active')]
  };
  const [cls, txt] = map[kind] || ['badge', kind];
  return '<span class="' + cls + '">' + txt + '</span>';
}

/* Wire up render of all data sections. Containers identified by ids:
   #rqsTable #curriculum #map1 #map2 #map3 #pubs #timeline #mecadeLayers */
function renderAll() {
  // RQs
  const rqs = document.getElementById('rqsTable');
  if (rqs) renderTable(rqs, [L('t_id'), L('t_q'), L('t_r')], RQS,
    (c, ci) => ci === 0 ? '<b>' + c + '</b>' : L(c));

  // Curriculum
  const cur = document.getElementById('curriculum');
  if (cur) renderTable(cur, [L('c_code'), L('c_name'), L('c_status'), L('c_credits')], COURSES,
    (c, ci) => {
      if (ci === 0) return '<span class="mono">' + c + '</span>';
      if (ci === 1) return L(c);
      if (ci === 2) return badge(c);
      return '<span class="mono">' + c + '</span>';
    });

  // Mapping groups
  const m1 = document.getElementById('map1');
  if (m1) renderTable(m1, [L('t_id'), L('m_year'), L('m_title'), L('m_authors')], MAP_G1,
    (c, ci) => ci === 0 ? '<span class="mono">' + c + '</span>' : (ci === 1 ? '<span class="mono">' + c + '</span>' : c));
  const m2 = document.getElementById('map2');
  if (m2) renderTable(m2, [L('t_id'), L('m_source'), L('m_contrib'), L('m_ref')], MAP_G2,
    (c, ci) => ci === 0 ? '<span class="mono">' + c + '</span>' : c);
  const m3 = document.getElementById('map3');
  if (m3) renderTable(m3, [L('t_id'), L('m_domain'), L('m_context'), L('m_source')], MAP_G3,
    (c, ci) => ci === 0 ? '<span class="mono">' + c + '</span>' : c);

  // Publications (custom rows with links)
  const pubs = document.getElementById('pubs');
  if (pubs) {
    const rows = [
      [L('p_profile_t'), L('p_profile_i'), badge('active'), '<a href="' + LINKS.researchgate + '" target="_blank" rel="noopener">' + L('p_open_profile') + ' ↗</a>'],
      [L('p_a1_t'), L('p_a1_i'), badge('published'), '<a href="' + LINKS.article1 + '" target="_blank" rel="noopener">' + L('p_open_pub') + ' ↗</a>'],
      [L('p_a2_t'), L('p_a2_i') + ' · <a href="' + LINKS.ladc + '" target="_blank" rel="noopener" class="mono ladc">LADC 2026 ↗</a>', badge('review'), '<span class="muted">' + L('p_confidential') + '</span>'],
      [L('p_a3_t'), L('p_a3_i'), badge('backlog'), '<span class="muted">' + L('p_pending') + '</span>'],
      [L('p_diss_t'), L('p_diss_i'), badge('wip'), '<span class="muted">' + L('p_private') + '</span>']
    ];
    renderTable(pubs, [L('p_type'), L('p_item'), L('p_status'), L('p_access')], rows, (c) => c);
  }

  // Timeline
  const tl = document.getElementById('timeline');
  if (tl) {
    tl.innerHTML = '';
    TIMELINE.forEach(item => {
      const step = el('div', 'step ' + item.state);
      step.innerHTML =
        '<time class="mono">' + item.time + '</time>' +
        '<h4>' + L(item.key) + '</h4>' +
        '<p>' + L(item.key + '_d') + '</p>';
      tl.appendChild(step);
    });
  }

  // MECADE layers
  const ml = document.getElementById('mecadeLayers');
  if (ml) {
    ml.innerHTML = '';
    MECADE_LAYERS.forEach(layer => {
      const t = pick(layer);
      const card = el('div', 'layer');
      card.innerHTML =
        '<span class="layer-n mono">' + layer.n + '</span>' +
        '<div class="layer-body"><h4>' + t[0] + '</h4><p class="mono">' + t[1] + '</p></div>';
      ml.appendChild(card);
    });
  }
}

/* ===================== BOOT ===================== */
onRender(renderAll);
function bootMestrado() {
  initTheme();
  initLang();        // triggers setLang -> renderAll via RERENDER
  startCountdown();
}
