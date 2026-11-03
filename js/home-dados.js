import { MAIS_DEV, MAIS_VERS, MAIS_BANCO } from './home-mais.js';
// Projeto Aster - conteudo da home (devocionais por tema, versiculos do girador e banco do quiz)
const DEV0 = [
{ g: 0, l: "Esperança", t: "Esperança que sustenta", r: "Romanos 15:13", x: "Esperar não é fingir que está tudo bem. É escolher olhar para quem prometeu, mesmo quando o caminho ainda está escuro. A esperança cristã não depende de como o dia amanheceu, mas de quem caminha com você.", q: "Em qual área da sua vida você precisa de uma esperança nova hoje?", p: "Senhor, enche o meu coração de esperança e firma os meus passos. Que eu confie em ti mesmo quando não vejo o caminho completo." },
{ g: 0, l: "Ansiedade", t: "Entregar o peso", r: "Filipenses 4:6-7", x: "A ansiedade quer que você carregue o amanhã inteiro hoje. O convite da Escritura é outro: transformar cada preocupação em conversa com Deus, com gratidão, e receber uma paz que vai além do que conseguimos explicar.", q: "Qual preocupação você pode colocar em oração agora, em uma frase?", p: "Pai, entrego a ti o que me inquieta. Guarda o meu coração e a minha mente em paz." },
{ g: 0, l: "Família", t: "Uma casa de cuidado", r: "Josué 24:15", x: "Servir a Deus em casa começa nas coisas pequenas: uma palavra gentil, uma refeição em paz, um pedido de perdão. O lar não precisa ser perfeito para ser um lugar onde Deus é bem-vindo.", q: "Que gesto simples pode mostrar cuidado a alguém da sua casa hoje?", p: "Senhor, abençoa a minha família. Ensina-nos a falar com amor e a perdoar com generosidade." },
{ g: 0, l: "Gratidão", t: "Contar as bênçãos", r: "1 Tessalonicenses 5:18", x: "Gratidão não nega as dificuldades; ela amplia o olhar. Quando paramos para nomear o que recebemos, o dia ganha outro tamanho e o coração aprende a descansar.", q: "Quais três coisas você pode agradecer neste momento?", p: "Obrigado, Pai, pelo fôlego de hoje e pelas pessoas que cuidam de mim. Ensina-me a ver as tuas mãos nos detalhes." },
{ g: 0, l: "Perdão", t: "Soltar o que pesa", r: "Efésios 4:31-32", x: "Perdoar não é dizer que a dor não importou. É recusar viver preso a ela. O perdão que recebemos de Deus nos ensina a abrir a mão, um passo de cada vez.", q: "Há alguém, ou você mesmo, a quem precisa oferecer perdão?", p: "Senhor, cura as feridas que carrego. Dá-me forças para perdoar como fui perdoado." },
{ g: 0, l: "Consolo", t: "Perto de quem sofre", r: "Salmos 34:18", x: "Na dor, não precisamos de respostas prontas. A Escritura descreve um Deus que se aproxima dos que têm o coração quebrantado. Se hoje o peso é grande, você pode simplesmente descansar nessa presença.", q: "Quem poderia caminhar ao seu lado nesta semana?", p: "Deus de consolo, fica perto de mim. Quando faltarem palavras, sustenta-me com a tua paz." },
{ g: 1, l: "Estou procurando", t: "Sem pressa, sem cobrança", r: "Mateus 7:7-8", x: "Você não precisa ter tudo resolvido para ler esta página. A Bíblia convida quem busca a continuar buscando, com honestidade. Comece pequeno: leia o texto, guarde uma pergunta sua e siga no seu ritmo. Aqui você é bem-vindo.", q: "O que você mais gostaria de entender sobre a fé?", p: "Se existe alguém me ouvindo, quero conhecer a verdade. Mostra-me o próximo passo, no meu tempo." },
{ g: 1, l: "Tenho dúvidas", t: "A dúvida também cabe aqui", r: "Marcos 9:23-24", x: "Um pai, diante de Jesus, disse algo muito humano: creio, mas ajuda a minha falta de fé. A Bíblia não esconde a dúvida; mostra pessoas que perguntaram e foram ouvidas. Perguntar pode ser o começo da confiança.", q: "Qual dúvida você gostaria de levar a alguém de confiança?", p: "Se tu estás aí, ajuda-me a entender. Dá-me coragem para fazer as minhas perguntas." }
];
const VERS0 = [
["O Senhor é o meu pastor; nada me faltará.", "Salmos 23:1"],
["Posso todas as coisas em Cristo, que me fortalece.", "Filipenses 4:13"],
["Esforça-te, e tem bom ânimo; não pasmes, nem te espantes, porque o Senhor teu Deus é contigo, por onde quer que andares.", "Josué 1:9"],
["Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.", "Mateus 11:28"],
["Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento.", "Provérbios 3:5"],
["Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá.", "João 14:27"],
["Levantarei os meus olhos para os montes, de onde vem o meu socorro. O meu socorro vem do Senhor, que fez os céus e a terra.", "Salmos 121:1-2"]
];
const V = 'Complete o versículo', P = 'Quem é o pai?', N = 'Livros e números', Z = 'Personagens';
// [categoria, pergunta, resposta certa, errada 1, errada 2, referencia]
const BANCO0 = [
[V, "O Senhor é o meu _____; nada me faltará.", "pastor", "rei", "juiz", "Salmos 23:1"],
[V, "Posso todas as coisas em _____, que me fortalece.", "Cristo", "Moisés", "Davi", "Filipenses 4:13"],
[V, "Confia no Senhor de todo o teu _____, e não te estribes no teu próprio entendimento.", "coração", "tempo", "caminho", "Provérbios 3:5"],
[V, "Vinde a mim, todos os que estais cansados e _____, e eu vos aliviarei.", "oprimidos", "ricos", "sábios", "Mateus 11:28"],
[V, "Deus é o nosso refúgio e fortaleza, socorro bem presente na _____.", "angústia", "cidade", "guerra", "Salmos 46:1"],
[P, "Quem foi o pai de Isaque?", "Abraão", "Jacó", "Noé", "Gênesis 21:3"],
[P, "Quem foi o pai de Jacó?", "Isaque", "Esaú", "Abraão", "Gênesis 25:26"],
[P, "Quem foi o pai de José, o do Egito?", "Jacó", "Isaque", "Judá", "Gênesis 30:24"],
[P, "Quem foi o pai do rei Salomão?", "Davi", "Saul", "Jessé", "2 Samuel 12:24"],
[P, "Quem foi o pai do rei Davi?", "Jessé", "Saul", "Samuel", "1 Samuel 16:1"],
[P, "Quem foi o pai de João Batista?", "Zacarias", "José", "Simeão", "Lucas 1:13"],
[P, "Quem foi o pai de Sem, Cam e Jafé?", "Noé", "Lameque", "Enoque", "Gênesis 6:10"],
[N, "Quantos livros tem a Bíblia protestante?", "66", "73", "39", "São 39 no Antigo Testamento e 27 no Novo."],
[N, "Quantos livros tem o Antigo Testamento protestante?", "39", "27", "46", "39 + 27 = 66 livros."],
[N, "Quantos livros tem o Novo Testamento?", "27", "22", "39", "De Mateus a Apocalipse."],
[N, "Quantos livros formam o Pentateuco?", "5", "3", "7", "De Gênesis a Deuteronômio."],
[N, "Quantos evangelhos há no Novo Testamento?", "4", "3", "5", "Mateus, Marcos, Lucas e João."],
[N, "Quantos apóstolos Jesus escolheu?", "12", "7", "10", "Marcos 3:14"],
[N, "Qual livro da Bíblia tem mais capítulos?", "Salmos", "Isaías", "Gênesis", "Salmos tem 150 capítulos."],
[N, "Qual é o menor capítulo da Bíblia?", "Salmos 117", "Salmos 23", "Salmos 1", "Tem apenas 2 versículos."],
[N, "Qual é o capítulo mais longo da Bíblia?", "Salmos 119", "Salmos 91", "Gênesis 1", "Tem 176 versículos."],
[N, "Qual livro do Antigo Testamento tem menos versículos?", "Obadias", "Jonas", "Ageu", "Obadias tem 21 versículos."],
[N, "Qual livro do Novo Testamento tem menos versículos?", "2 João", "Judas", "Filemom", "2 João tem 13 versículos."],
[N, "Qual é o primeiro livro da Bíblia?", "Gênesis", "Êxodo", "Mateus", "Gênesis quer dizer origem."],
[N, "Qual é o último livro da Bíblia?", "Apocalipse", "Judas", "Malaquias", "Fecha o Novo Testamento."],
[N, "Qual é o primeiro livro do Novo Testamento?", "Mateus", "Marcos", "Atos", "Abre os quatro evangelhos."],
[N, "Em quantos dias Deus criou os céus e a terra, antes do descanso?", "6", "7", "3", "Gênesis 2:2"],
[Z, "Quem construiu a arca?", "Noé", "Moisés", "Abraão", "Gênesis 6:14"],
[Z, "Quem foi lançado na cova dos leões?", "Daniel", "José", "Elias", "Daniel 6:16"],
[Z, "Quem derrotou o gigante Golias?", "Davi", "Saul", "Sansão", "1 Samuel 17:50"],
[Z, "Quem passou três dias dentro de um grande peixe?", "Jonas", "Pedro", "Paulo", "Jonas 1:17"],
[Z, "Quem Deus enviou para tirar o povo do Egito?", "Moisés", "Josué", "Arão", "Êxodo 3:10"],
[Z, "Em que cidade Jesus nasceu?", "Belém", "Nazaré", "Jerusalém", "Mateus 2:1"],
[Z, "Qual discípulo negou Jesus três vezes?", "Pedro", "João", "Tomé", "Mateus 26:75"]
];
export const DEV = DEV0.concat(MAIS_DEV);
export const VERS = VERS0.concat(MAIS_VERS);
export const BANCO = BANCO0.concat(MAIS_BANCO);
