// Catálogo de obras com ORIGINAL em domínio público (Brasil: autor falecido até 1955).
// Lista de apoio: confira cada PDF e cada tradução antes de publicar. Traduções modernas têm direitos próprios.
const LINHA = { c: 'Calvinismo (Reformada)', a: 'Arminianismo', w: 'Wesleyanismo (Metodista)', l: 'Luteranismo', g: 'Anglicanismo', p: 'Patrística (Pais da Igreja)', b: 'Batista', m: 'Medieval / Católica clássica', n: 'Neutro / sem linha explícita' };
const TEMA = { f: 'Fé', s: 'Salvação', g: 'Graça', j: 'Justificação', t: 'Santificação', d: 'Predestinação e livre-arbítrio', e: 'Escatologia', c: 'Cristologia', h: 'Espírito Santo', i: 'Igreja', o: 'Oração', v: 'Vida cristã', a: 'Apologética', y: 'História da Igreja', x: 'Teologia sistemática', b: 'Bíblia e interpretação', k: 'Devocional', r: 'Avivamento', u: 'Sofrimento', l: 'Liderança e ministério', w: 'Adoração', z: 'Ética cristã', q: 'Evangelismo e missões' };
// formato de cada linha: Título|Autor|ano da morte|linha|temas
const GRUPOS = [
['Credos e confissões', `
Credo Apostólico|Igreja antiga||p|fx
Credo Niceno-Constantinopolitano (381)|Igreja antiga||p|fcx
Definição de Calcedônia (451)|Igreja antiga||p|cx
Credo Atanasiano|Igreja antiga||p|fcx
Confissão de Augsburgo (1530)|Filipe Melâncton|1560|l|fji
Apologia da Confissão de Augsburgo|Filipe Melâncton|1560|l|jx
Catecismo Menor|Martinho Lutero|1546|l|fvx
Catecismo Maior|Martinho Lutero|1546|l|fx
Artigos de Esmalcalde|Martinho Lutero|1546|l|xj
Fórmula de Concórdia|Teólogos luteranos||l|x
Catecismo de Heidelberg (1563)|Tradição reformada||c|fvx
Confissão Belga (1561)|Tradição reformada||c|fx
Cânones de Dort (1619)|Tradição reformada||c|dsg
Segunda Confissão Helvética|Tradição reformada||c|x
Catecismo de Genebra|João Calvino|1564|c|fx
Confissão de Westminster (1646)|Assembleia de Westminster||c|x
Catecismo Maior de Westminster|Assembleia de Westminster||c|x
Catecismo Breve de Westminster|Assembleia de Westminster||c|fx
Confissão Escocesa|Tradição reformada||c|x
Trinta e Nove Artigos|Igreja Anglicana||g|x
Livro de Oração Comum|Thomas Cranmer|1556|g|wo
Confissão Batista de Londres (1689)|Batistas particulares||b|x
Catecismo de Keach|Benjamin Keach|1704|b|fx
Artigos de Religião (metodistas)|João Wesley|1791|w|x
Remonstrância (1610)|Remonstrantes||a|dsg
Confissão dos Remonstrantes (1621)|Simão Episcópio|1643|a|xd
`],
['Igreja antiga e medieval', `
Didaquê|Igreja primitiva||p|viw
Carta aos Coríntios|Clemente de Roma||p|i
Cartas|Inácio de Antioquia|107|p|iu
Escritos|Policarpo de Esmirna|155|p|vu
Carta a Diogneto|Autor desconhecido||p|av
Apologias|Justino Mártir|165|p|ac
Contra as Heresias|Ireneu de Lyon|202|p|xa
Obras|Tertuliano|220|p|xa
Dos Princípios|Orígenes|253|p|x
Obras|Cipriano de Cartago|258|p|i
História Eclesiástica|Eusébio de Cesareia|339|p|y
Sobre a Encarnação|Atanásio|373|p|c
Obras|Basílio de Cesareia|379|p|vx
Homilias|João Crisóstomo|407|p|bv
Obras|Jerônimo|420|p|b
Confissões|Agostinho|430|p|fgk
A Cidade de Deus|Agostinho|430|p|ye
Sobre a Trindade|Agostinho|430|p|xc
Enchiridion|Agostinho|430|p|fx
Da Doutrina Cristã|Agostinho|430|p|b
Da Graça e do Livre-Arbítrio|Agostinho|430|p|gd
Da Predestinação dos Santos|Agostinho|430|p|dg
Da Natureza e da Graça|Agostinho|430|p|gd
Carta a Demétria|Pelágio|c.418|p|dgv
Obras|Gregório Magno|604|m|lv
Proslógio|Anselmo de Cantuária|1109|m|xf
Por que Deus se Fez Homem|Anselmo de Cantuária|1109|m|cs
Escritos|Bernardo de Claraval|1153|m|kv
Escritos|Francisco de Assis|1226|m|vk
Imitação de Cristo|Tomás de Kempis|1471|m|kv
Escritos|John Wycliffe|1384|m|bi
Da Igreja|Jan Hus|1415|m|i
Do Livre-Arbítrio|Erasmo de Roterdã|1536|n|d
`],
['Reforma luterana', `
95 Teses|Martinho Lutero|1546|l|ji
Da Liberdade Cristã|Martinho Lutero|1546|l|vj
À Nobreza Cristã|Martinho Lutero|1546|l|i
Do Cativeiro Babilônico|Martinho Lutero|1546|l|iw
Da Vontade Cativa|Martinho Lutero|1546|l|dg
Comentário aos Gálatas|Martinho Lutero|1546|l|jb
Prefácio aos Romanos|Martinho Lutero|1546|l|jb
Conversas à Mesa|Martinho Lutero|1546|l|v
Sermões|Martinho Lutero|1546|l|vb
Hinos|Martinho Lutero|1546|l|w
Loci Communes|Filipe Melâncton|1560|l|x
Exame do Concílio de Trento|Martin Chemnitz|1586|l|xy
Meditações Sagradas|Johann Gerhard|1637|l|k
Verdadeiro Cristianismo|Johann Arndt|1621|l|vk
Pia Desideria|Philipp Jakob Spener|1705|l|iv
Lei e Evangelho|C. F. W. Walther|1887|l|jx
Hinos|Paul Gerhardt|1676|l|w
`],
['Reforma reformada e puritanos', `
Institutas da Religião Cristã|João Calvino|1564|c|xg
Comentários bíblicos|João Calvino|1564|c|b
Tratado da Ceia|João Calvino|1564|c|xw
Sobre a Providência|João Calvino|1564|c|dx
Obras|Ulrico Zuínglio|1531|c|x
Obras|Martin Bucer|1551|c|i
Décadas|Heinrich Bullinger|1575|c|x
Obras|John Knox|1572|c|i
Obras|Pedro Mártir Vermigli|1562|c|x
Obras|Teodoro de Beza|1605|c|x
Obras|Girolamo Zanchi|1590|c|dx
Obras|Zacarias Ursino|1583|c|x
Obras|Francis Turretini|1687|c|x
Obras|Herman Witsius|1708|c|x
Obras|Wilhelmus à Brakel|1711|c|vx
Obras|William Perkins|1602|c|dv
A Cana Quebrada|Richard Sibbes|1635|c|ku
A Joia Rara do Contentamento|Jeremiah Burroughs|1646|c|vu
A Morte da Morte|John Owen|1683|c|sc
Mortificação do Pecado|John Owen|1683|c|tv
Corpo de Divindade|Thomas Watson|1686|c|x
Obras|Stephen Charnock|1680|c|x
O Cristão em Armadura Completa|William Gurnall|1679|c|v
Remédios Preciosos|Thomas Brooks|1680|c|v
Obras|John Flavel|1691|c|v
O Pastor Reformado|Richard Baxter|1691|c|l
O Descanso Eterno dos Santos|Richard Baxter|1691|c|ek
Cartas|Samuel Rutherford|1661|c|ku
A Vida de Deus na Alma do Homem|Henry Scougal|1678|c|kv
O Peregrino|John Bunyan|1688|c|vk
A Guerra Santa|John Bunyan|1688|c|v
Graça Abundante ao Principal dos Pecadores|John Bunyan|1688|c|gk
Comentário|Matthew Henry|1714|c|b
Obras|Thomas Boston|1732|c|v
Hinos|Isaac Watts|1748|c|w
Obras|Philip Doddridge|1751|c|vk
A Liberdade da Vontade|Jonathan Edwards|1758|c|d
Afeições Religiosas|Jonathan Edwards|1758|c|vr
Pecadores nas Mãos de um Deus Irado|Jonathan Edwards|1758|c|rs
Diário|David Brainerd|1747|c|kq
Sermões|George Whitefield|1770|c|rq
Obras|John Gill|1771|c|x
Cartas e hinos|John Newton|1807|c|kw
Obras|William Cowper|1800|c|w
O Evangelho Digno de Toda Aceitação|Andrew Fuller|1815|c|sq
Escritos|William Carey|1834|c|q
Sermões|Charles Spurgeon|1892|c|vb
O Tesouro de Davi|Charles Spurgeon|1892|c|bk
Lições aos Meus Alunos|Charles Spurgeon|1892|c|l
Manhã e Noite|Charles Spurgeon|1892|c|k
Todo de Graça|Charles Spurgeon|1892|c|gs
Santidade|J. C. Ryle|1900|g|t
Obras|Charles Hodge|1878|c|x
Obras|A. A. Hodge|1886|c|x
Obras|B. B. Warfield|1921|c|x
Obras|Robert L. Dabney|1898|c|x
Obras|W. G. T. Shedd|1894|c|x
Obras|A. H. Strong|1921|c|x
Obras|James P. Boyce|1888|c|x
Obras|Robert Murray M'Cheyne|1843|c|kv
Comentário de Romanos|Robert Haldane|1842|c|bj
Obras|Horatius Bonar|1889|c|vk
Obras|Octavius Winslow|1878|c|vk
Palestras sobre o Calvinismo|Abraham Kuyper|1920|c|xz
Dogmática Reformada|Herman Bavinck|1921|c|x
Obras|Geerhardus Vos|1949|c|bx
Cristianismo e Liberalismo|J. Gresham Machen|1937|c|ax
`],
['Arminianismo e wesleyanos', `
Declaração de Sentimentos (1608)|Jacó Armínio|1609|a|ds
Disputas|Jacó Armínio|1609|a|dx
Exame do Tratado de Perkins|Jacó Armínio|1609|a|d
Obras|Hugo Grócio|1645|a|x
Obras|Philipp van Limborch|1712|a|x
Obras|John Goodwin|1665|a|s
Escritos sobre liberdade religiosa|Thomas Helwys|1616|a|iz
Sermões|João Wesley|1791|w|tv
Graça Gratuita|João Wesley|1791|w|gs
O Caráter de um Metodista|João Wesley|1791|w|v
Explicação Simples da Perfeição Cristã|João Wesley|1791|w|t
Um Apelo Sincero a Homens de Razão e Religião|João Wesley|1791|w|aq
Diário|João Wesley|1791|w|k
Notas ao Novo Testamento|João Wesley|1791|w|b
Hinos|Carlos Wesley|1788|w|w
Obras|John Fletcher|1785|w|t
Comentário|Adam Clarke|1832|w|b
Institutos Teológicos|Richard Watson|1833|w|x
Diário|Francis Asbury|1816|w|kl
Obras|John Miley|1895|w|x
Obras|William Burt Pope|1903|w|x
Palestras sobre Avivamentos|Charles Finney|1875|a|r
Obras|Phoebe Palmer|1874|w|t
Obras|William Booth|1912|w|q
`],
['Vida cristã e devocionais', `
A Prática da Presença de Deus|Irmão Lourenço|1691|m|ok
Um Sério Chamado a uma Vida Devota|William Law|1761|g|v
Obras|Jeremy Taylor|1667|g|v
O Livro dos Mártires|John Foxe|1587|g|yu
Obras|George Herbert|1633|g|w
Obras|John Donne|1631|g|k
Humildade|Andrew Murray|1917|n|v
Permaneça em Cristo|Andrew Murray|1917|n|v
Com Cristo na Escola de Oração|Andrew Murray|1917|n|o
Poder pela Oração|E. M. Bounds|1913|w|o
O Segredo de uma Vida Cristã Feliz|Hannah Whitall Smith|1911|n|v
Obras|R. A. Torrey|1928|n|v
Obras|D. L. Moody|1899|n|qr
Obras|F. B. Meyer|1929|n|k
Obras|G. Campbell Morgan|1945|n|b
O Maior Bem do Mundo|Henry Drummond|1897|n|v
Obras|George Müller|1898|n|of
Obras|Hudson Taylor|1905|n|q
Obras|Amy Carmichael|1951|n|q
Em Seus Passos|Charles Sheldon|1946|n|vz
Ortodoxia|G. K. Chesterton|1936|n|a
Obras|Dietrich Bonhoeffer|1945|l|vz
Obras|Francisco de Sales|1622|m|k
Obras|François Fénelon|1715|m|k
Obras|Madame Guyon|1717|m|k
Obras|Teresa de Ávila|1582|m|ko
Obras|João da Cruz|1591|m|k
Pensamentos|Blaise Pascal|1662|m|af
`],
['Apologética e estudo bíblico', `
Analogia da Religião|Joseph Butler|1752|g|a
Evidências do Cristianismo|William Paley|1805|g|a
Quem Moveu a Pedra?|Frank Morison|1950|n|ac
História da Igreja Cristã|Philip Schaff|1893|c|y
A Vida e os Tempos de Jesus|Alfred Edersheim|1889|n|cb
Comentários|Carl Friedrich Keil|1888|l|b
Comentários|Franz Delitzsch|1890|l|b
Comentários|Albert Barnes|1870|c|b
Obras|Flávio Josefo|c.100|n|y
Concordância de Strong|James Strong|1894|n|b
Dicionários de Smith e Easton|William Smith e M. G. Easton||n|b
`],
['Em português e do Brasil', `
Bíblia de Almeida (edições antigas)|João Ferreira de Almeida|1691|c|b
Salmos e Hinos (1861)|Robert Kalley|1888|n|w
Diário|Ashbel Simonton|1867|c|qy
Obras|José Manoel da Conceição|1873|c|qy
O Problema Religioso da América Latina|Eduardo Carlos Pereira|1923|c|iy
Sermões|Padre António Vieira|1697|m|bv
Bíblia (tradução de Pereira de Figueiredo)|António Pereira de Figueiredo|1797|m|b
`]
];
export const CATALOGO = [];
GRUPOS.forEach(([grupo, linhas]) => linhas.trim().split('\n').forEach(l => {
  const [titulo, autor, ano, linha, temas] = l.split('|').map(x => x.trim());
  CATALOGO.push({ titulo, autor, tradicao: LINHA[linha] || LINHA.n, temas: [...(temas || '')].map(k => TEMA[k]).filter(Boolean),
    resumo: grupo + (ano ? '. Autor falecido em ' + ano + '.' : '.'), arquivo: '', capaUrl: '', catalogo: true });
}));
