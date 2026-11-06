# Projeto Aster - versiculo do dia, caixinha de referencias e home passam a usar a Biblia local
import re
def ler(p): return open(p, encoding='utf-8').read()
def gravar(p, s): open(p, 'w', encoding='utf-8').write(s)

LOADER = '''function biblia() {
  if (window.AsterBiblia) return Promise.resolve(window.AsterBiblia);
  return new Promise(function (ok, no) {
    var s = document.createElement('script'); s.src = 'js/biblia-local.js';
    s.onload = function () { ok(window.AsterBiblia); }; s.onerror = no; document.head.appendChild(s);
  });
}
'''

# 1) versiculo do dia
p = 'js/versiculo-do-dia.js'; s = ler(p)
if 'biblia-local' not in s:
    a = s.index("    var url = consultaApi(h.ref);")
    b = s.index("  // Se a página ficar aberta")
    novo = '''    var m = /^(.+) (\\d+):(\\d+)(?:-(\\d+))?$/.exec(h.ref);
    if (!m) { mostrar(h.ref, ''); return; }
    biblia().then(function (B) { return B.versiculos('pt-livre', m[1], +m[2], +m[3], m[4] ? +m[4] : +m[3]); }).then(function (vs) {
      var texto = vs.map(function (v) { return v.t; }).join(' ').replace(/\\s+/g, ' ').trim();
      if (!texto) throw 0;
      salvarCache({ chave: h.chave, ref: h.ref, texto: texto, v: 2 });
      mostrar(h.ref, texto);
    }).catch(function () { mostrar(h.ref, ''); });
  }

'''
    s = s[:a] + novo + s[b:]
    assert s.count("cache && cache.chave === h.chave && cache.texto)") == 1
    s = s.replace("cache && cache.chave === h.chave && cache.texto)", "cache && cache.chave === h.chave && cache.texto && cache.v === 2)")
    assert s.count("  function atualizar() {") == 1
    s = s.replace("  function atualizar() {", LOADER.replace('\n', '\n  ').rstrip(' ') + "  function atualizar() {", 1)
    s = s.replace("// O texto vem da Bíblia Almeida (bible-api.com) e fica guardado no aparelho para não buscar de novo.", "// O texto vem da Bíblia Livre (arquivos do próprio site, em data/biblia) e fica guardado no aparelho.")
    gravar(p, s); print('versiculo-do-dia.js: ok')
else: print('versiculo-do-dia.js: ja estava atualizado')

# 2) caixinha das referencias nos artigos
p = 'js/versiculos.js'; s = ler(p)
if 'biblia-local' not in s:
    a = s.index("  const chave = 'aster_ref_' + ref.consulta;")
    b = s.index("  } catch (e) { t.textContent = 'Não foi possível carregar este texto agora.'; }")
    novo = '''  try {
    const B = await biblia();
    const m = /^(.+) (\\d+)(?::(\\d+)(?:-(\\d+))?)?$/.exec(ref.consulta);
    const vs = await B.versiculos('pt-livre', m[1], +m[2], m[3] ? +m[3] : 0, m[4] ? +m[4] : 0);
    t.textContent = '';
    vs.forEach(v => {
      const p = document.createElement('p'), s = document.createElement('sup');
      s.textContent = v.n + ' '; p.append(s, v.t); t.append(p);
    });
    if (!t.firstChild) throw 0;
'''
    s = s[:a] + novo + s[b:]
    assert s.count("async function abrir(ref) {") == 1
    s = s.replace("async function abrir(ref) {", LOADER.replace('  var s', '  const s').replace('var s = ', 'const s = ') + "async function abrir(ref) {", 1)
    assert s.count("ref.bonito + ' (Almeida)'") == 1
    s = s.replace("ref.bonito + ' (Almeida)'", "ref.bonito + ' (Bíblia Livre)'")
    gravar(p, s); print('versiculos.js: ok')
else: print('versiculos.js: ja estava atualizado')

# 3) home: etiquetas da Biblia online
p = 'index.html'; s = ler(p)
r = re.compile(r'<span class="pill ativa">Almeida</span>\s*<span class="pill">KJV</span>\s*<span class="pill">WEB</span>')
if r.search(s):
    s = r.sub('<span class="pill ativa">Português</span>\n        <span class="pill">English</span>\n        <span class="pill">Español</span>\n        <span class="pill">Latim</span>\n        <span class="pill">Hebraico</span>\n        <span class="pill">Grego</span>', s, 1)
    gravar(p, s); print('index.html: ok')
else: print('index.html: ja estava atualizado')
