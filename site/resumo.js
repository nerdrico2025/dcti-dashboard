/* Resumo: the 8 summary tiles shared by admin.html and index.html.
   Shows only aggregate counts (never task names, people or hours).
   DctiResumo.render(host, data, lang)  -> tiles
   DctiResumo.footer(host, data, lang)  -> "Última atualização: 19/11/2026 · semana de 09/11/2026"
   data = { active, backlog, next, doing, blocked, late, done,   (numbers)
            color: 'Green'|'Yellow'|'Red'|'Gray'|'', color_note: '',
            updated_on: 'AAAA-MM-DD', week_start: 'AAAA-MM-DD' }
   lang = 'pt-BR' | 'en-CA'. */
(function () {
  'use strict';
  var TXT = {
    active:  { 'pt-BR': 'Tarefas ativas', 'en-CA': 'Active tasks' },
    backlog: { 'pt-BR': 'Backlog', 'en-CA': 'Backlog' },
    next:    { 'pt-BR': 'Próxima', 'en-CA': 'Next' },
    doing:   { 'pt-BR': 'Em andamento', 'en-CA': 'In progress' },
    blocked: { 'pt-BR': 'Bloqueada', 'en-CA': 'Blocked' },
    late:    { 'pt-BR': 'Atrasadas', 'en-CA': 'Overdue' },
    late_sub: { 'pt-BR': 'com prazo vencido', 'en-CA': 'past the deadline' },
    done:    { 'pt-BR': 'Concluída', 'en-CA': 'Done' },
    status:  { 'pt-BR': 'Status', 'en-CA': 'Status' },
    updated: { 'pt-BR': 'Última atualização', 'en-CA': 'Last update' },
    week_of: { 'pt-BR': 'semana de {d}', 'en-CA': 'week of {d}' },
    no_data: { 'pt-BR': 'Sem dados', 'en-CA': 'No data' },
    Green:   { 'pt-BR': 'Verde', 'en-CA': 'Green' },
    Yellow:  { 'pt-BR': 'Amarelo', 'en-CA': 'Yellow' },
    Red:     { 'pt-BR': 'Vermelho', 'en-CA': 'Red' },
    Gray:    { 'pt-BR': 'Cinza', 'en-CA': 'Grey' }
  };
  // order and colour of each tile
  var TILES = [['active', 'rs-none'], ['backlog', 'rs-backlog'], ['next', 'rs-next'], ['doing', 'rs-doing'],
    ['blocked', 'rs-blocked'], ['late', 'rs-late'], ['done', 'rs-done']];

  function t(key, lang) { var r = TXT[key]; return r ? (r[lang] || r['pt-BR']) : key; }
  function num(v) { return typeof v === 'number' && isFinite(v) ? v : 0; }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = String(text);
    return n;
  }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  // 16/11/2026 in Portuguese, 11/16/2026 in English (same as the admin summary)
  function fmtDate(ds, lang) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ds || '');
    if (!m) return '';
    return lang === 'en-CA' ? m[2] + '/' + m[3] + '/' + m[1] : m[3] + '/' + m[2] + '/' + m[1];
  }
  // Done ÷ active tasks, rounded to a whole number; 0 active = 0%.
  function donePct(d) { var a = num(d.active); return a > 0 ? Math.round(num(d.done) / a * 100) : 0; }

  function tile(cls, label, value, sub) {
    var d = el('div', 'rs-tile ' + cls);
    d.appendChild(el('div', 'rs-label', label));
    d.appendChild(el('div', 'rs-value', value));
    if (sub) d.appendChild(el('div', 'rs-sub', sub));
    return d;
  }

  function render(host, data, lang) {
    var d = data || {};
    clear(host);
    host.classList.add('rs-grid');
    TILES.forEach(function (k) {
      host.appendChild(tile(k[1], t(k[0], lang), num(d[k[0]]), k[0] === 'late' ? t('late_sub', lang) : ''));
    });
    var color = ['Green', 'Yellow', 'Red', 'Gray'].indexOf(d.color) >= 0 ? d.color : '';
    var st = tile(color ? 'rs-color-' + color : 'rs-none', t('status', lang), donePct(d) + '%');
    st.appendChild(el('div', 'rs-color-name', color ? t(color, lang) : t('no_data', lang)));
    if (d.color_note) st.appendChild(el('div', 'rs-sub', d.color_note));
    host.appendChild(st);
  }

  function footer(host, data, lang) {
    var d = data || {};
    var parts = [t('updated', lang) + ': ' + (fmtDate(d.updated_on, lang) || t('no_data', lang))];
    if (fmtDate(d.week_start, lang)) parts.push(t('week_of', lang).replace('{d}', fmtDate(d.week_start, lang)));
    host.textContent = parts.join(' · ');
  }

  window.DctiResumo = { render: render, footer: footer, donePct: donePct, text: t };
})();
