# Projeto Aster - botao "Imagem" no leitor da Biblia e "Compartilhar" no versiculo do dia
def ler(p): return open(p, encoding='utf-8').read()
def gravar(p, s): open(p, 'w', encoding='utf-8').write(s)

p = 'biblia.html'; s = ler(p)
if 'aster-imagem' not in s:
    for t in ('<button onclick="compartilhar()">Compartilhar</button>', 'function mover(d){', '<script src="js/biblia-local.js"></script>'):
        assert s.count(t) == 1, 'biblia.html diferente do esperado: ' + t
    s = s.replace('<button onclick="compartilhar()">Compartilhar</button>', '<button onclick="imagem()">Imagem</button>\n<button onclick="compartilhar()">Compartilhar</button>')
    s = s.replace('<script src="js/biblia-local.js"></script>', '<script src="js/aster-imagem.js"></script>\n<script src="js/biblia-local.js"></script>')
    s = s.replace('function mover(d){', "function imagem(){\n  const vs=[...sel].sort((a,b)=>a.dataset.v-b.dataset.v);if(!vs.length)return;\n  const ref=cur.b+' '+cur.c+':'+vs[0].dataset.v+(vs.length>1?'-'+vs[vs.length-1].dataset.v:'');\n  AsterImagem.abrir({texto:vs.map(p=>p.dataset.t).join(' '),ref:ref,edicao:cur.t});\n}\nfunction mover(d){")
    gravar(p, s); print('biblia.html: botao Imagem criado')
else: print('biblia.html: ja estava atualizado')

p = 'index.html'; s = ler(p)
if 'btnImgVers' not in s:
    a = '<a href="edicoes.html" class="btn btn-outline">Ler o editorial</a>'
    assert s.count(a) == 1 and s.count('</body>') == 1, 'index.html diferente do esperado'
    s = s.replace(a, a + '\n    <button type="button" class="btn btn-outline" id="btnImgVers">Compartilhar</button>')
    s = s.replace('</body>', '<script src="js/aster-imagem.js"></script>\n<script>document.getElementById(\'btnImgVers\').onclick=function(){var t=document.getElementById(\'versiculoTexto\').textContent,r=document.getElementById(\'versiculoRef\').textContent;if(/^Abra a B/.test(t))return;AsterImagem.abrir({texto:t,ref:r,edicao:\'Almeida Revista e Corrigida (ARC)\'})}</script>\n</body>')
    gravar(p, s); print('index.html: botao Compartilhar criado')
else: print('index.html: ja estava atualizado')
