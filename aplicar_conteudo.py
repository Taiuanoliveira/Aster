# Projeto Aster - liga o conteudo extra (home-mais.js) a home e ao painel
def ler(p): return open(p, encoding='utf-8').read()
def gravar(p, s): open(p, 'w', encoding='utf-8').write(s)

d = ler('js/home-dados.js')
if 'home-mais' not in d:
    for nome in ('DEV', 'VERS', 'BANCO'):
        ant = 'export const %s = [' % nome
        assert ant in d, 'home-dados.js diferente do esperado'
        d = d.replace(ant, 'const %s0 = [' % nome, 1)
    d = "import { MAIS_DEV, MAIS_VERS, MAIS_BANCO } from './home-mais.js';\n" + d
    d += "export const DEV = DEV0.concat(MAIS_DEV);\nexport const VERS = VERS0.concat(MAIS_VERS);\nexport const BANCO = BANCO0.concat(MAIS_BANCO);\n"
    gravar('js/home-dados.js', d); print('home-dados.js: conteudo extra ligado')
else:
    print('home-dados.js: ja estava ligado')

a = ler('admin/home-admin.html')
if 'faltantes' not in a:
    t1 = "const CATS = ['Complete o versículo', 'Quem é o pai?', 'Livros e números', 'Personagens'];"
    n1 = "const CATS = Array.from(new Set(['Complete o versículo', 'Quem é o pai?', 'Livros e números', 'Personagens'].concat(BANCO.map(b => b[0]))));"
    t2 = "(cache.length === 0 ? `<p class=\"ha-nota\"><button class=\"btn-secundario\" id=\"importar\">Importar o conteúdo que já está no site (${S.seed().length})</button></p>` : '') +"
    n2 = "(faltantes(S).length ? `<p class=\"ha-nota\"><button class=\"btn-secundario\" id=\"importar\">${cache.length ? 'Adicionar o conteúdo novo do site' : 'Importar o conteúdo que já está no site'} (${faltantes(S).length})</button></p>` : '') +"
    t3 = "const b = writeBatch(db); S.seed().forEach(x =>"
    n3 = "const b = writeBatch(db); faltantes(S).forEach(x =>"
    t4 = "    async function secao() {"
    n4 = "    function faltantes(S) { const ja = new Set(cache.map(S.chave)); return S.seed().filter(x => !ja.has(S.chave(x))); }\n\n    async function secao() {"
    t5 = "        valida: d => (new Set("
    n5 = "        chave: d => d.pergunta,\n        valida: d => (new Set("
    t6 = "        seed: () => DEV.map("
    n6 = "        chave: d => d.aba,\n        seed: () => DEV.map("
    t7 = "        seed: () => VERS.map("
    n7 = "        chave: d => d.texto,\n        seed: () => VERS.map("
    for t, n in ((t1, n1), (t2, n2), (t3, n3), (t4, n4), (t5, n5), (t6, n6), (t7, n7)):
        assert a.count(t) == 1, 'home-admin.html diferente do esperado: ' + t[:40]
        a = a.replace(t, n)
    gravar('admin/home-admin.html', a); print('home-admin.html: botao "Adicionar o conteudo novo" criado')
else:
    print('home-admin.html: ja estava atualizado')
