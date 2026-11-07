# Projeto Aster - adiciona as edicoes mais usadas (com direitos autorais, por conta do site) e define a ARC como padrao
import json, os, re, sys, time, urllib.request

T = 'https://raw.githubusercontent.com/thiagobodruk/bible/master/json/%s.json'
CAPS = [50,40,27,36,34,24,21,4,31,24,22,25,29,36,10,13,10,42,150,31,12,8,66,52,5,48,12,14,3,9,1,4,7,3,3,3,2,14,4,28,16,24,21,28,16,16,13,6,6,4,4,5,3,6,4,3,1,13,5,5,3,5,1,1,1,22]
SBB = 'Direitos reservados à Sociedade Bíblica do Brasil'
# id, nome curto, nome completo, idioma, licenca, arquivo
N = [
 ('pt-arc', 'Almeida ARC', 'Almeida Revista e Corrigida (ARC)', 'Português', SBB, 'pt_arc'),
 ('pt-ara', 'Almeida ARA', 'Almeida Revista e Atualizada (ARA)', 'Português', SBB, 'pt_ara'),
 ('pt-acf', 'Almeida ACF', 'Almeida Corrigida Fiel (ACF)', 'Português', 'Direitos reservados à Sociedade Bíblica Trinitariana do Brasil', 'pt_acf'),
 ('pt-naa', 'Nova Almeida', 'Nova Almeida Atualizada (NAA)', 'Português', SBB, 'pt_naa'),
 ('pt-nvi', 'NVI', 'Nova Versão Internacional (NVI)', 'Português', 'Direitos reservados à Biblica, Inc. e à Editora Vida', 'pt_nvi'),
 ('pt-ntlh', 'NTLH', 'Nova Tradução na Linguagem de Hoje (NTLH)', 'Português', SBB, 'pt_ntlh'),
 ('pt-nvt', 'NVT', 'Nova Versão Transformadora (NVT)', 'Português', 'Direitos reservados à Editora Mundo Cristão', 'pt_nvt'),
 ('en-niv', 'NIV', 'New International Version (NIV)', 'English', 'Direitos reservados à Biblica, Inc.', 'en_niv'),
 ('en-esv', 'ESV', 'English Standard Version (ESV)', 'English', 'Direitos reservados à Crossway', 'en_esv'),
 ('en-nkjv', 'NKJV', 'New King James Version (NKJV)', 'English', 'Direitos reservados à Thomas Nelson', 'en_nkjv'),
 ('en-nlt', 'NLT', 'New Living Translation (NLT)', 'English', 'Direitos reservados à Tyndale House Foundation', 'en_nlt'),
 ('es-rvr1960', 'Reina-Valera 1960', 'Reina-Valera (1960)', 'Español', 'Direitos reservados às Sociedades Bíblicas Unidas', 'es_rvr1960'),
]
ORDEM = ['pt-arc','pt-ara','pt-acf','pt-naa','pt-nvi','pt-ntlh','pt-nvt','pt-livre','pt-tb','en-niv','en-esv','en-nkjv','en-nlt','en-kjv','en-asv','en-web','es-rvr1960','es-rv','la-vulg','he-wlc','gr-tr','gr-lxx']

def baixar(url):
    for t in range(4):
        try:
            rq = urllib.request.Request(url, headers={'User-Agent': 'aster-build'})
            return json.loads(urllib.request.urlopen(rq, timeout=90).read().decode('utf-8-sig'))
        except Exception as e:
            print('  tentando de novo...', e); time.sleep(2 + 3 * t)
    sys.exit('ERRO: nao consegui baixar ' + url)

def limpa(t):
    t = re.sub(r'\s+', ' ', t).strip()
    t = re.sub(r'\s\.\s(?=[a-zà-ÿ])', ' ', t)
    t = re.sub(r'\s+([,.;:!?)])', r'\1', t)
    return re.sub(r'\(\s+', '(', t)

if not os.path.exists('data/biblia/index.json'): sys.exit('ERRO: rode antes o aplicar_biblia_dados.py')
idx = json.load(open('data/biblia/index.json', encoding='utf-8'))
vs = {v['id']: v for v in idx['versoes']}; erros = 0
for (vid, curto, longo, idioma, lic, arq) in N:
    print('>', longo)
    bs = [b['chapters'] for b in baixar(T % arq)]
    assert len(bs) == 66, vid + ': esperava 66 livros'
    os.makedirs('data/biblia/' + vid, exist_ok=True); caps = {}; nv = 0
    for i, cs in enumerate(bs):
        cs = [[limpa(t) for t in c] for c in cs]
        if len(cs) != CAPS[i] or any(not any(c) for c in cs): print('   problema no livro', i); erros += 1
        caps[str(i)] = len(cs); nv += sum(1 for c in cs for t in c if t)
        with open('data/biblia/%s/%02d.json' % (vid, i), 'w', encoding='utf-8') as f:
            json.dump(cs, f, ensure_ascii=False, separators=(',', ':'))
    print('   versiculos:', nv)
    vs[vid] = {'id': vid, 'nome': curto, 'longo': longo, 'idioma': idioma, 'dir': 'ltr', 'licenca': lic, 'nota': '', 'livros': caps}
idx['versoes'] = sorted(vs.values(), key=lambda v: ORDEM.index(v['id']) if v['id'] in ORDEM else 99)
with open('data/biblia/index.json', 'w', encoding='utf-8') as f:
    json.dump(idx, f, ensure_ascii=False, separators=(',', ':'))

# a ARC passa a ser a edicao padrao do site
def troca(p, pares):
    s = open(p, encoding='utf-8').read(); s0 = s
    for a, b in pares: s = s.replace(a, b)
    if s != s0: open(p, 'w', encoding='utf-8').write(s); print('padrao ARC em', p)
troca('biblia.html', [("P={v:'pt-livre'", "P={v:'pt-arc'"), ("P.cmp='pt-livre'", "P.cmp='pt-arc'")])
troca('js/versiculo-do-dia.js', [("'pt-livre'", "'pt-arc'"), ('cache.v === 2', 'cache.v === 3'), ('v: 2 }', 'v: 3 }'), ('Bíblia Livre (arquivos', 'Almeida ARC (arquivos')])
troca('js/versiculos.js', [("'pt-livre'", "'pt-arc'"), ('(Bíblia Livre)', '(Almeida ARC)')])
print('PRONTO. Problemas:', erros)
