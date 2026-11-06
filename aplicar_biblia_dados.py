# Projeto Aster - baixa Biblias livres (dominio publico / Creative Commons) e grava em data/biblia/
import json, os, re, sys, time, urllib.request

T = 'https://raw.githubusercontent.com/thiagobodruk/bible/master/json/%s.json'
S = 'https://raw.githubusercontent.com/scrollmapper/bible_databases/master/formats/json/%s.json'
CAPS = [50,40,27,36,34,24,21,4,31,24,22,25,29,36,10,13,10,42,150,31,12,8,66,52,5,48,12,14,3,9,1,4,7,3,3,3,2,14,4,28,16,24,21,28,16,16,13,6,6,4,4,5,3,6,4,3,1,13,5,5,3,5,1,1,1,22]
TODOS = list(range(66)); AT = list(range(39)); NT = list(range(39, 66))
LXX = list(range(15)) + list(range(17, 26)) + list(range(27, 39))

# id, nome curto, nome completo, idioma, direcao, licenca, fonte, arquivo, mapa de livros, nota
V = [
 ('pt-livre', 'Bíblia Livre', 'Bíblia Livre (BLIVRE)', 'Português', 'ltr', 'Creative Commons CC BY 4.0 · © Diego Santos, Mario Sérgio e Marco Teles', S, 'PorBLivre', TODOS, ''),
 ('pt-tb', 'Tradução Brasileira', 'Tradução Brasileira (1917)', 'Português', 'ltr', 'Domínio público', T, 'pt_tb', TODOS, ''),
 ('en-kjv', 'King James', 'King James Version (1769)', 'English', 'ltr', 'Domínio público', T, 'en_kjv', TODOS, ''),
 ('en-asv', 'American Standard', 'American Standard Version (1901)', 'English', 'ltr', 'Domínio público', T, 'en_asv', TODOS, ''),
 ('en-web', 'World English', 'World English Bible', 'English', 'ltr', 'Domínio público', T, 'en_webus', TODOS, ''),
 ('es-rv', 'Reina-Valera 1909', 'Reina-Valera (1909)', 'Español', 'ltr', 'Domínio público', S, 'SpaRV', TODOS, ''),
 ('la-vulg', 'Vulgata', 'Vulgata Latina (São Jerônimo)', 'Latim', 'ltr', 'Domínio público', T, 'la_vulg', TODOS, 'A numeração de alguns Salmos e versículos da Vulgata difere das traduções modernas.'),
 ('he-wlc', 'Hebraico (AT)', 'Hebraico: Códice de Leningrado (WLC)', 'Hebraico', 'rtl', 'Domínio público', T, 'he_wlc', AT, 'Texto com vogais, sem os sinais de cantilação. A numeração de alguns versículos (Salmos, Joel, Malaquias) difere das traduções.'),
 ('gr-tr', 'Grego (NT)', 'Grego: Textus Receptus (Novo Testamento)', 'Grego', 'ltr', 'Domínio público', T, 'grc_grctr', NT, ''),
 ('gr-lxx', 'Grego (AT)', 'Grego: Septuaginta, edição de Brenton (Antigo Testamento)', 'Grego', 'ltr', 'Domínio público', T, 'grc_grcbrent', LXX, 'Faltam Neemias, Ester e Daniel nesta edição. A numeração de Salmos e Jeremias difere do hebraico.'),
]

def baixar(url):
    for t in range(4):
        try:
            rq = urllib.request.Request(url, headers={'User-Agent': 'aster-build'})
            return json.loads(urllib.request.urlopen(rq, timeout=90).read().decode('utf-8-sig'))
        except Exception as e:
            print('  tentando de novo...', e); time.sleep(2 + 3 * t)
    sys.exit('ERRO: nao consegui baixar ' + url)

def livros(d):
    if isinstance(d, dict):
        out = []
        for b in d['books']:
            cs = []
            for c in b['chapters']:
                vs = {int(v['verse']): v['text'] for v in c['verses']}
                cs.append([vs.get(i, '') for i in range(1, max(vs) + 1)] if vs else [])
            out.append(cs)
        return out
    return [b['chapters'] for b in d]

CANT = re.compile(r'[\u0591-\u05AF\u05BD\u05C0]')
def limpa(t, idioma):
    t = re.sub(r'\s+', ' ', t).strip()
    if idioma == 'Hebraico': return CANT.sub('', t)
    if idioma == 'Grego': return t
    t = re.sub(r'\s+([,.;:!?)])', r'\1', t)
    return re.sub(r'\(\s+', '(', t)

os.makedirs('data/biblia', exist_ok=True)
indice = []; erros = 0
for (vid, curto, longo, idioma, dire, lic, base, arq, mapa, nota) in V:
    print('>', longo)
    bs = livros(baixar(base % arq))
    assert len(bs) == len(mapa), '%s: esperava %d livros e veio %d' % (vid, len(mapa), len(bs))
    if vid == 'he-wlc':
        m = mapa.index(38); ml = bs[m]
        if len(ml) == 3 and len(ml[2]) > 18:
            ml.append(ml[2][18:]); ml[2] = ml[2][:18]
    os.makedirs('data/biblia/' + vid, exist_ok=True)
    caps = {}; nv = 0
    for idx, cs in zip(mapa, bs):
        cs = [[limpa(t, idioma) for t in c] for c in cs]
        caps[str(idx)] = len(cs); nv += sum(1 for c in cs for t in c if t)
        if len(cs) != CAPS[idx]: print('   aviso: %s tem %d capitulos (padrao %d)' % (idx, len(cs), CAPS[idx]))
        if any(not any(c) for c in cs):
            print('   aviso: capitulo vazio no livro', idx, '(conhecido)' if vid == 'gr-lxx' else ''); erros += (vid != 'gr-lxx')
        with open('data/biblia/%s/%02d.json' % (vid, idx), 'w', encoding='utf-8') as f:
            json.dump(cs, f, ensure_ascii=False, separators=(',', ':'))
    print('   livros: %d · versiculos: %d' % (len(bs), nv))
    indice.append({'id': vid, 'nome': curto, 'longo': longo, 'idioma': idioma, 'dir': dire, 'licenca': lic, 'nota': nota, 'livros': caps})

with open('data/biblia/index.json', 'w', encoding='utf-8') as f:
    json.dump({'versoes': indice}, f, ensure_ascii=False, separators=(',', ':'))
print('PRONTO. Problemas:', erros)
