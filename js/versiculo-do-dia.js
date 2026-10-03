// Projeto Aster – Versículo do dia automático.
// Todo dia, às 6h (horário do leitor), o site passa a mostrar o versículo daquele dia.
// Cada mês tem um tema e cada dia do ano tem um versículo próprio (366, sem repetir).
// O texto vem da Bíblia Almeida (bible-api.com) e fica guardado no aparelho para não buscar de novo.
(function () {
  var HORA_TROCA = 6;
  var TRADUCAO = 'almeida';

  // Temas: jan recomeço e esperança · fev amor · mar fé · abr ressurreição e vida nova · mai gratidão e louvor · jun sabedoria
  //        jul força e coragem · ago paz e descanso · set oração · out perseverança e propósito · nov graça e perdão · dez luz e esperança
  var MESES = [
    'Lamentações 3:22-23|Isaías 43:18-19|2 Coríntios 5:17|Jeremias 29:11|Salmos 37:5|Romanos 15:13|Isaías 40:31|Filipenses 3:13-14|Provérbios 16:3|Salmos 121:1-2|Hebreus 11:1|Salmos 27:1|Romanos 12:2|Isaías 26:3|Salmos 118:24|Josué 1:9|Salmos 119:105|Mateus 6:33|Provérbios 3:5-6|Salmos 23:1-3|Isaías 41:10|1 Tessalonicenses 5:16-18|Salmos 90:12|Colossenses 3:23|Salmos 143:8|Miqueias 6:8|Eclesiastes 3:1|Salmos 32:8|Números 6:24-26|Salmos 16:11|Deuteronômio 31:6',
    'João 3:16|1 João 4:19|1 Coríntios 13:4-5|Romanos 5:8|1 João 4:7-8|João 15:12-13|Efésios 3:17-19|1 Pedro 4:8|Colossenses 3:14|Romanos 8:38-39|Provérbios 17:17|Salmos 136:1|João 13:34-35|1 João 3:18|Gálatas 5:22-23|Romanos 12:9-10|Salmos 103:8|Efésios 5:1-2|1 João 4:16|Mateus 22:37-39|Salmos 36:7|Sofonias 3:17|Jeremias 31:3|1 Coríntios 13:13|Efésios 4:2-3|Provérbios 10:12|Romanos 13:8|Salmos 63:3|1 João 4:11',
    'Hebreus 11:6|Marcos 11:24|2 Coríntios 5:7|Mateus 17:20|Salmos 56:3-4|Romanos 10:17|Provérbios 29:25|Salmos 20:7|Isaías 12:2|Salmos 62:8|Marcos 9:23|Habacuque 3:17-18|Salmos 9:10|Efésios 2:8-9|Tiago 2:17|Salmos 91:1-2|João 14:1|Salmos 112:7|Gálatas 2:20|Lucas 1:37|Naum 1:7|Salmos 28:7|2 Timóteo 1:7|Romanos 4:20-21|João 20:29|Salmos 125:1|Jeremias 17:7-8|Mateus 21:22|Hebreus 12:1-2|Salmos 31:14-15|Provérbios 18:10',
    'João 11:25-26|Lucas 24:5-6|1 Coríntios 15:57|Romanos 6:4|1 Pedro 1:3|João 14:19|Romanos 8:11|Colossenses 3:1-2|Mateus 28:5-6|1 Coríntios 15:20|João 10:10|Apocalipse 1:17-18|Efésios 2:4-5|Filipenses 3:10|Romanos 6:23|Isaías 53:5|João 19:30|1 Pedro 2:24|Gálatas 6:14|Romanos 10:9|2 Timóteo 1:10|Atos 2:24|João 12:24|Salmos 30:5|Isaías 25:8|Efésios 1:19-20|1 Tessalonicenses 4:14|Ezequiel 36:26|Lucas 15:24|2 Coríntios 4:16',
    'Salmos 100:4-5|Salmos 107:1|1 Crônicas 16:34|Salmos 103:1-2|Colossenses 3:15|Salmos 34:1|Salmos 95:1-2|Efésios 5:20|Salmos 138:1|Salmos 150:6|Tiago 1:17|Salmos 118:1|Filipenses 4:6|Salmos 9:1|Hebreus 13:15|Salmos 92:1-2|Salmos 145:1-2|2 Coríntios 9:15|Salmos 57:7|Salmos 136:26|Salmos 116:12|Salmos 111:1|Isaías 25:1|Salmos 66:1-2|Salmos 147:1|Deuteronômio 8:10|Salmos 96:1-2|Salmos 113:3|Salmos 86:12|Apocalipse 4:11|Salmos 146:2',
    'Provérbios 1:7|Tiago 1:5|Provérbios 2:6|Provérbios 4:7|Provérbios 9:10|Salmos 111:10|Provérbios 16:16|Provérbios 11:2|Provérbios 15:1|Provérbios 19:20|Provérbios 22:6|Provérbios 27:17|Provérbios 12:15|Provérbios 13:20|Provérbios 14:12|Provérbios 16:9|Provérbios 18:13|Provérbios 20:5|Provérbios 21:5|Provérbios 24:3-4|Provérbios 25:11|Eclesiastes 4:9-10|Colossenses 3:16|Tiago 3:17|Provérbios 3:13|Provérbios 8:11|Provérbios 17:27|Tiago 1:19|Provérbios 4:23|Provérbios 28:13',
    'Salmos 18:1-2|Isaías 40:29|Efésios 6:10|Salmos 46:1|2 Coríntios 12:9|Neemias 8:10|Salmos 138:3|Êxodo 15:2|Salmos 73:26|Deuteronômio 31:8|1 Crônicas 28:20|Isaías 41:13|Salmos 27:14|Filipenses 4:13|Salmos 118:6|Habacuque 3:19|2 Timóteo 4:17|Salmos 18:32|Isaías 35:4|Zacarias 4:6|Efésios 3:16|Salmos 29:11|Daniel 10:19|Salmos 119:28|Salmos 59:16|1 Coríntios 16:13|Salmos 61:2-3|Êxodo 14:14|2 Samuel 22:33|Colossenses 1:11|Salmos 144:1',
    'João 14:27|Filipenses 4:7|Salmos 4:8|Mateus 11:28-29|Salmos 62:1|Romanos 5:1|Salmos 94:19|João 16:33|Salmos 85:8|Isaías 32:17|Salmos 131:2|Marcos 4:39|Salmos 119:165|Hebreus 4:9-10|Salmos 37:7|Mateus 6:34|Salmos 116:7|2 Tessalonicenses 3:16|Salmos 3:5|Provérbios 3:24|Isaías 30:15|Salmos 55:22|1 Pedro 5:7|Salmos 127:2|Romanos 14:17|Salmos 34:14|Tiago 3:18|Isaías 55:12|Êxodo 33:14|Salmos 46:10|Efésios 2:14',
    'Mateus 6:9-10|Mateus 7:7-8|Jeremias 33:3|1 João 5:14|Tiago 5:16|Salmos 145:18|Lucas 18:1|Romanos 8:26|Salmos 17:6|Daniel 6:10|Mateus 6:6|João 15:7|Salmos 5:3|Efésios 6:18|Salmos 55:17|Atos 4:31|Salmos 66:19-20|Colossenses 4:2|2 Crônicas 7:14|Salmos 141:2|Hebreus 4:16|Salmos 86:5-7|Lucas 22:42|Salmos 25:4-5|Salmos 102:17|Mateus 18:19-20|Salmos 139:23-24|Isaías 65:24|1 Timóteo 2:1|Salmos 130:5',
    'Tiago 1:2-4|Romanos 5:3-4|Hebreus 10:36|Gálatas 6:9|1 Coríntios 15:58|Filipenses 1:6|Efésios 2:10|Provérbios 19:21|Romanos 8:28|2 Timóteo 4:7|1 Coríntios 9:24|Tiago 1:12|Salmos 138:8|Mateus 5:16|Colossenses 3:17|1 Pedro 4:10|Salmos 57:2|Mateus 25:21|Romanos 12:11-12|Apocalipse 2:10|2 Coríntios 4:17-18|Lucas 9:23|Hebreus 6:11-12|Provérbios 4:25-26|Salmos 37:23-24|1 Pedro 5:10|Atos 20:24|Efésios 4:1|Romanos 8:18|2 Pedro 3:18|Tiago 5:11',
    'Tito 2:11|1 João 1:9|Salmos 103:12|Colossenses 3:13|Mateus 6:14-15|Salmos 130:3-4|Miqueias 7:18-19|Isaías 1:18|Romanos 3:23-24|Efésios 4:32|João 1:16-17|Salmos 51:10|Lucas 6:37|Atos 3:19|Romanos 5:20-21|Salmos 32:1-2|Mateus 18:21-22|Hebreus 8:12|Lucas 23:34|Isaías 43:25|Neemias 9:17|2 Pedro 3:9|Romanos 8:1|Tiago 2:13|Salmos 145:8-9|1 Timóteo 1:15|Joel 2:13|Lucas 15:20|2 Timóteo 1:9|Salmos 25:6-7',
    'Isaías 9:2|João 1:5|Isaías 9:6|Lucas 2:10-11|Mateus 1:23|João 8:12|Salmos 119:130|Miqueias 5:2|Lucas 1:46-47|João 1:14|Isaías 60:1|Lucas 2:14|Mateus 5:14|Gálatas 4:4-5|1 João 1:5|Mateus 2:10-11|Isaías 7:14|Efésios 5:8|João 12:46|Lucas 1:78-79|Tito 2:13|Zacarias 9:9|2 Coríntios 4:6|Lucas 2:7|Mateus 2:1-2|Salmos 98:1|Romanos 8:24-25|Apocalipse 21:5|Salmos 121:7-8|Salmos 67:1|Salmos 126:3'
  ].map(function (m) { return m.split('|'); });

  var LIVROS_EN = {'Gênesis':'Genesis','Êxodo':'Exodus','Levítico':'Leviticus','Números':'Numbers','Deuteronômio':'Deuteronomy','Josué':'Joshua','Juízes':'Judges','Rute':'Ruth','1 Samuel':'1 Samuel','2 Samuel':'2 Samuel','1 Reis':'1 Kings','2 Reis':'2 Kings','1 Crônicas':'1 Chronicles','2 Crônicas':'2 Chronicles','Esdras':'Ezra','Neemias':'Nehemiah','Ester':'Esther','Jó':'Job','Salmos':'Psalms','Provérbios':'Proverbs','Eclesiastes':'Ecclesiastes','Cantares':'Song of Solomon','Isaías':'Isaiah','Jeremias':'Jeremiah','Lamentações':'Lamentations','Ezequiel':'Ezekiel','Daniel':'Daniel','Oseias':'Hosea','Joel':'Joel','Amós':'Amos','Obadias':'Obadiah','Jonas':'Jonah','Miqueias':'Micah','Naum':'Nahum','Habacuque':'Habakkuk','Sofonias':'Zephaniah','Ageu':'Haggai','Zacarias':'Zechariah','Malaquias':'Malachi','Mateus':'Matthew','Marcos':'Mark','Lucas':'Luke','João':'John','Atos':'Acts','Romanos':'Romans','1 Coríntios':'1 Corinthians','2 Coríntios':'2 Corinthians','Gálatas':'Galatians','Efésios':'Ephesians','Filipenses':'Philippians','Colossenses':'Colossians','1 Tessalonicenses':'1 Thessalonians','2 Tessalonicenses':'2 Thessalonians','1 Timóteo':'1 Timothy','2 Timóteo':'2 Timothy','Tito':'Titus','Filemom':'Philemon','Hebreus':'Hebrews','Tiago':'James','1 Pedro':'1 Peter','2 Pedro':'2 Peter','1 João':'1 John','2 João':'2 John','3 João':'3 John','Judas':'Jude','Apocalipse':'Revelation'};

  var CHAVE_CACHE = 'aster_versiculo_dia';

  // O "dia" do versículo começa às 6h: antes disso, ainda vale o de ontem.
  function diaDoVersiculo(agora) {
    var d = new Date((agora || new Date()).getTime() - HORA_TROCA * 3600 * 1000);
    return { mes: d.getMonth(), dia: d.getDate(), chave: d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() };
  }

  function referenciaDe(agora) {
    var d = diaDoVersiculo(agora);
    return { ref: MESES[d.mes][d.dia - 1], chave: d.chave };
  }

  function consultaApi(ref) {
    var m = /^(.+) (\d+):(\d+)(?:-(\d+))?$/.exec(ref);
    if (!m || !LIVROS_EN[m[1]]) return null;
    var q = LIVROS_EN[m[1]] + ' ' + m[2] + ':' + m[3] + (m[4] ? '-' + m[4] : '');
    return 'https://bible-api.com/' + q.replace(/ /g, '+') + '?translation=' + TRADUCAO;
  }

  function lerCache() {
    try { return JSON.parse(localStorage.getItem(CHAVE_CACHE) || 'null'); } catch (e) { return null; }
  }
  function salvarCache(o) {
    try { localStorage.setItem(CHAVE_CACHE, JSON.stringify(o)); } catch (e) {}
  }

  function mostrar(ref, texto) {
    var t = document.getElementById('versiculoTexto');
    var r = document.getElementById('versiculoRef');
    if (t) t.textContent = texto ? '\u201C' + texto + '\u201D' : 'Abra a Bíblia para ler este versículo.';
    if (r) r.textContent = ref;
  }

  function atualizar() {
    var h = referenciaDe();
    var cache = lerCache();
    if (cache && cache.chave === h.chave && cache.texto) { mostrar(h.ref, cache.texto); return; }
    mostrar(h.ref, '');
    var t = document.getElementById('versiculoTexto');
    if (t) t.textContent = 'Carregando o versículo de hoje…';
    var url = consultaApi(h.ref);
    if (!url || typeof fetch !== 'function') { mostrar(h.ref, ''); return; }
    fetch(url).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (d) {
      var texto = (d.text || '').replace(/\s+/g, ' ').trim();
      if (!texto) throw 0;
      salvarCache({ chave: h.chave, ref: h.ref, texto: texto });
      mostrar(h.ref, texto);
    }).catch(function () { mostrar(h.ref, ''); });
  }

  // Se a página ficar aberta durante a virada das 6h, troca sozinha.
  function agendarProximaTroca() {
    var agora = new Date();
    var prox = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), HORA_TROCA, 0, 5);
    if (prox <= agora) prox.setDate(prox.getDate() + 1);
    setTimeout(function () { atualizar(); agendarProximaTroca(); }, prox - agora);
  }

  window.AsterVersiculo = { referenciaDe: referenciaDe, consultaApi: consultaApi, meses: MESES, livros: LIVROS_EN };

  if (typeof document !== 'undefined' && document.getElementById) {
    atualizar();
    agendarProximaTroca();
  }
})();
