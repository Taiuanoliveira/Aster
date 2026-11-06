/* Projeto Aster - Biblia local: livros e textos em data/biblia (sem servico externo) */
(function () {
  var LIVROS = [["Gênesis","Genesis"],["Êxodo","Exodus"],["Levítico","Leviticus"],["Números","Numbers"],["Deuteronômio","Deuteronomy"],["Josué","Joshua"],["Juízes","Judges"],["Rute","Ruth"],["1 Samuel","1 Samuel"],["2 Samuel","2 Samuel"],["1 Reis","1 Kings"],["2 Reis","2 Kings"],["1 Crônicas","1 Chronicles"],["2 Crônicas","2 Chronicles"],["Esdras","Ezra"],["Neemias","Nehemiah"],["Ester","Esther"],["Jó","Job"],["Salmos","Psalms"],["Provérbios","Proverbs"],["Eclesiastes","Ecclesiastes"],["Cantares","Song of Solomon"],["Isaías","Isaiah"],["Jeremias","Jeremiah"],["Lamentações","Lamentations"],["Ezequiel","Ezekiel"],["Daniel","Daniel"],["Oseias","Hosea"],["Joel","Joel"],["Amós","Amos"],["Obadias","Obadiah"],["Jonas","Jonah"],["Miqueias","Micah"],["Naum","Nahum"],["Habacuque","Habakkuk"],["Sofonias","Zephaniah"],["Ageu","Haggai"],["Zacarias","Zechariah"],["Malaquias","Malachi"],["Mateus","Matthew"],["Marcos","Mark"],["Lucas","Luke"],["João","John"],["Atos","Acts"],["Romanos","Romans"],["1 Coríntios","1 Corinthians"],["2 Coríntios","2 Corinthians"],["Gálatas","Galatians"],["Efésios","Ephesians"],["Filipenses","Philippians"],["Colossenses","Colossians"],["1 Tessalonicenses","1 Thessalonians"],["2 Tessalonicenses","2 Thessalonians"],["1 Timóteo","1 Timothy"],["2 Timóteo","2 Timothy"],["Tito","Titus"],["Filemom","Philemon"],["Hebreus","Hebrews"],["Tiago","James"],["1 Pedro","1 Peter"],["2 Pedro","2 Peter"],["1 João","1 John"],["2 João","2 John"],["3 João","3 John"],["Judas","Jude"],["Apocalipse","Revelation"]];
  var cache = {};
  function pegar(url) {
    if (!cache[url]) {
      cache[url] = fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .catch(function (e) { delete cache[url]; throw e; });
    }
    return cache[url];
  }
  function indice() { return pegar('data/biblia/index.json'); }
  function capitulo(vid, livro, cap) {
    var n = ('0' + livro).slice(-2);
    return pegar('data/biblia/' + vid + '/' + n + '.json').then(function (cs) { return cs[cap - 1] || []; });
  }
  function achar(nome) {
    for (var i = 0; i < LIVROS.length; i++) if (LIVROS[i][0] === nome || LIVROS[i][1] === nome) return i;
    return -1;
  }
  // devolve [{n, t}] dos versiculos de uma referencia (ex.: achar('Mateus'), 6, 14, 15)
  function versiculos(vid, nomeLivro, cap, v1, v2) {
    var i = achar(nomeLivro);
    if (i < 0) return Promise.reject(new Error('livro'));
    return capitulo(vid, i, cap).then(function (vs) {
      var a = v1 || 1, b = v2 || (v1 ? v1 : vs.length), out = [];
      for (var v = a; v <= b && v <= vs.length; v++) if (vs[v - 1]) out.push({ n: v, t: vs[v - 1] });
      return out;
    });
  }
  window.AsterBiblia = { livros: LIVROS, indice: indice, capitulo: capitulo, achar: achar, versiculos: versiculos };
})();
