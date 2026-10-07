// Resumos simples das obras do catálogo da Biblioteca (formato: Título|Autor|Resumo).
const norm = s => String(s == null ? '' : s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
const LINHAS = `
Credo Apostólico|Igreja antiga|Resume a fé cristã em poucas frases: Deus Pai, Jesus Cristo, o Espírito Santo, a Igreja e a vida eterna.
Credo Niceno-Constantinopolitano (381)|Igreja antiga|Declara que Jesus é verdadeiro Deus, da mesma natureza do Pai, e confessa o Espírito Santo. É recitado até hoje.
Definição de Calcedônia (451)|Igreja antiga|Explica que Cristo é uma só pessoa com duas naturezas, plenamente Deus e plenamente homem.
Credo Atanasiano|Igreja antiga|Confissão firme sobre a Trindade e a encarnação, que ensina a crer corretamente em quem é Deus e quem é Cristo.
Confissão de Augsburgo (1530)|Filipe Melâncton|Principal confissão luterana: apresenta o que os luteranos creem sobre Deus, o pecado, a salvação pela fé e a Igreja.
Apologia da Confissão de Augsburgo|Filipe Melâncton|Defesa mais detalhada da Confissão de Augsburgo, centrada na justificação pela fé, em resposta às críticas católicas.
Catecismo Menor|Martinho Lutero|Ensino básico da fé para as famílias: Dez Mandamentos, Credo, Pai-Nosso, batismo e ceia, em linguagem simples.
Catecismo Maior|Martinho Lutero|Versão mais completa do catecismo de Lutero, escrita para pastores e pais ensinarem a fé com mais profundidade.
Artigos de Esmalcalde|Martinho Lutero|Lutero resume os pontos da fé em que não podia ceder, como a salvação somente por Cristo.
Fórmula de Concórdia|Teólogos luteranos|Documento que encerrou disputas entre luteranos e firmou a doutrina da tradição sobre lei, evangelho e justificação.
Catecismo de Heidelberg (1563)|Tradição reformada|Catecismo em 129 perguntas sobre o consolo de pertencer a Cristo, dividido em culpa, graça e gratidão.
Confissão Belga (1561)|Tradição reformada|Confissão em 37 artigos escrita por reformados dos Países Baixos para explicar, mesmo sob perseguição, no que criam.
Cânones de Dort (1619)|Tradição reformada|Resposta reformada ao arminianismo, em cinco pontos sobre a corrupção humana, a eleição, a expiação, a graça e a perseverança.
Segunda Confissão Helvética|Tradição reformada|Ampla confissão reformada escrita por Bullinger, adotada por igrejas na Suíça e em vários outros países.
Catecismo de Genebra|João Calvino|Catecismo em perguntas e respostas escrito por Calvino para ensinar a fé às crianças e aos novos cristãos.
Confissão de Westminster (1646)|Assembleia de Westminster|Principal confissão presbiteriana: resume o ensino da Bíblia sobre Deus, o ser humano, a salvação e a Igreja.
Catecismo Maior de Westminster|Assembleia de Westminster|Catecismo em 196 perguntas para ensinar com detalhe a doutrina e a vida cristã, pensado para pastores.
Catecismo Breve de Westminster|Assembleia de Westminster|Catecismo curto de 107 perguntas. A primeira é "Qual é o fim principal do homem?", e a resposta é glorificar a Deus.
Confissão Escocesa|Tradição reformada|Confissão de 1560, escrita por John Knox e outros, que marcou o início da Igreja reformada na Escócia.
Trinta e Nove Artigos|Igreja Anglicana|Declaração de fé da Igreja Anglicana, que fixa sua doutrina entre o catolicismo e as demais igrejas da Reforma.
Livro de Oração Comum|Thomas Cranmer|Livro de orações e cultos em inglês simples, base da vida de oração e do culto anglicano.
Confissão Batista de Londres (1689)|Batistas particulares|Confissão batista que segue a de Westminster e defende o batismo dos que creem e a autonomia da igreja local.
Catecismo de Keach|Benjamin Keach|Catecismo batista em perguntas e respostas, para ensinar a doutrina a crianças e novos membros.
Artigos de Religião (metodistas)|João Wesley|Resumo da doutrina metodista, que Wesley adaptou dos artigos anglicanos para as igrejas da América.
Remonstrância (1610)|Remonstrantes|Documento dos seguidores de Armínio com cinco pontos que rejeitam a predestinação incondicional. Deu origem ao debate de Dort.
Confissão dos Remonstrantes (1621)|Simão Episcópio|Exposição da fé dos remonstrantes (arminianos), com sua visão sobre a graça e a liberdade humana.
Didaquê|Igreja primitiva|Manual cristão dos primeiros séculos sobre a vida moral, o batismo, a oração, a ceia e a organização das igrejas.
Carta aos Coríntios|Clemente de Roma|Carta de um líder de Roma à igreja de Corinto, no fim do século I, pedindo unidade e ordem diante de divisões.
Cartas|Inácio de Antioquia|Sete cartas escritas a caminho do martírio, sobre a unidade da igreja, o bispo e a verdadeira humanidade de Cristo.
Escritos|Policarpo de Esmirna|Carta aos filipenses de um discípulo do apóstolo João, que exorta à vida santa e à firmeza na fé.
Carta a Diogneto|Autor desconhecido|Texto antigo que explica a um pagão quem são os cristãos e por que vivem de modo diferente no mundo.
Apologias|Justino Mártir|Defesas da fé dirigidas a imperadores romanos, que explicam o culto cristão e mostram Cristo como cumprimento das profecias.
Contra as Heresias|Ireneu de Lyon|Defende a fé dos apóstolos contra o gnosticismo e mostra a unidade da Bíblia e do plano de Deus.
Obras|Tertuliano|Escritos do primeiro grande teólogo latino, sobre a Trindade, a defesa da fé e a vida cristã sob perseguição.
Dos Princípios|Orígenes|Primeira teologia sistemática cristã, sobre Deus, o mundo, a liberdade humana e a interpretação da Escritura.
Obras|Cipriano de Cartago|Cartas e tratados de um bispo mártir sobre a unidade da Igreja, a oração e a conduta na perseguição.
História Eclesiástica|Eusébio de Cesareia|Primeira grande história da Igreja, dos apóstolos até o início do século IV, com o relato dos mártires.
Sobre a Encarnação|Atanásio|Explica por que o Filho de Deus se fez homem: para salvar a humanidade do pecado e da morte.
Obras|Basílio de Cesareia|Escritos de um pai da Igreja sobre o Espírito Santo, a vida em comunidade e o cuidado com os pobres.
Homilias|João Crisóstomo|Sermões do "boca de ouro" que explicam a Bíblia versículo a versículo e aplicam o texto à vida diária.
Obras|Jerônimo|Comentários bíblicos e cartas do tradutor da Bíblia para o latim (a Vulgata).
Confissões|Agostinho|Autobiografia em forma de oração: Agostinho conta sua busca e conclui que o coração só descansa em Deus.
A Cidade de Deus|Agostinho|Obra sobre a história, escrita após a queda de Roma, que contrasta a cidade dos homens com a cidade de Deus.
Sobre a Trindade|Agostinho|Tratado em que Agostinho procura entender e explicar como Deus é um só em três pessoas.
Enchiridion|Agostinho|Manual breve sobre a fé, a esperança e o amor, que resume o que o cristão deve crer e viver.
Da Doutrina Cristã|Agostinho|Guia para ler e ensinar a Bíblia, que explica como interpretar a Escritura e comunicar a verdade.
Da Graça e do Livre-Arbítrio|Agostinho|Defende que a vontade humana precisa da graça de Deus para querer e fazer o bem.
Da Predestinação dos Santos|Agostinho|Explica que a fé começa por dom de Deus, que escolhe e chama os que serão salvos.
Da Natureza e da Graça|Agostinho|Resposta a Pelágio: mostra que o pecado feriu o ser humano e que só a graça de Cristo o restaura.
Carta a Demétria|Pelágio|Carta a uma jovem romana que exorta a uma vida santa. Ajuda a entender as ideias de Pelágio, criticadas por Agostinho.
Obras|Gregório Magno|Escritos do papa Gregório sobre o pastoreio e a vida cristã, como a "Regra Pastoral", guia para quem lidera.
Proslógio|Anselmo de Cantuária|Oração-meditação em que Anselmo apresenta seu argumento de que Deus existe, "aquele maior do que o qual nada se pode pensar".
Por que Deus se Fez Homem|Anselmo de Cantuária|Explica por que só alguém que fosse Deus e homem podia pagar a dívida do pecado e salvar a humanidade.
Escritos|Bernardo de Claraval|Sermões e tratados do monge sobre o amor a Deus, a oração e a humildade, de grande influência na Idade Média.
Escritos|Francisco de Assis|Orações, cartas e o "Cântico das Criaturas", que louva a Deus pela criação, de um santo da simplicidade e da pobreza.
Imitação de Cristo|Tomás de Kempis|Clássico devocional que convida a seguir Cristo com humildade, desapego do mundo e vida interior.
Escritos|John Wycliffe|Escritos do pré-reformador inglês, que defendeu a autoridade da Bíblia e sua tradução para o inglês.
Da Igreja|Jan Hus|Obra do reformador tcheco que ensina que Cristo, e não o papa, é a cabeça da Igreja. Por ela foi condenado à fogueira.
Do Livre-Arbítrio|Erasmo de Roterdã|Erasmo defende a liberdade da vontade humana. Lutero respondeu com "Da Vontade Cativa".
95 Teses|Martinho Lutero|Lista de questionamentos à venda de indulgências, afixada em 1517, que deu início à Reforma Protestante.
Da Liberdade Cristã|Martinho Lutero|Pequeno tratado: o cristão é livre de tudo pela fé em Cristo e, por amor, servo de todos.
À Nobreza Cristã|Martinho Lutero|Lutero convoca os nobres alemães a reformar a Igreja e defende que todos os crentes são sacerdotes.
Do Cativeiro Babilônico|Martinho Lutero|Critica o sistema dos sacramentos da Igreja de Roma e mantém só os que se apoiam na Escritura.
Da Vontade Cativa|Martinho Lutero|Resposta a Erasmo: Lutero defende que o ser humano, sem a graça, não pode escolher Deus por si mesmo.
Comentário aos Gálatas|Martinho Lutero|Lutero explica a carta de Paulo e defende que somos justificados pela fé, não pelas obras da lei.
Prefácio aos Romanos|Martinho Lutero|Introdução ao livro de Romanos, em que Lutero resume a fé, a lei, a graça e a justificação.
Conversas à Mesa|Martinho Lutero|Conversas de Lutero com amigos e alunos, anotadas à mesa, sobre fé, vida, família e Igreja.
Sermões|Martinho Lutero|Sermões simples e diretos sobre a Bíblia e a vida cristã, pregados ao povo.
Hinos|Martinho Lutero|Hinos de Lutero para o culto em alemão, como "Castelo Forte é nosso Deus".
Loci Communes|Filipe Melâncton|Primeira teologia sistemática protestante, que organiza por temas a doutrina da Reforma.
Exame do Concílio de Trento|Martin Chemnitz|Análise e resposta luterana, ponto por ponto, às decisões do Concílio de Trento.
Meditações Sagradas|Johann Gerhard|Meditações curtas para a vida devocional, escritas por um dos grandes teólogos luteranos.
Verdadeiro Cristianismo|Johann Arndt|Clássico que enfatiza uma fé viva, de transformação do coração e frutos na vida diária.
Pia Desideria|Philipp Jakob Spener|Propostas para renovar a Igreja pelo estudo bíblico, pequenos grupos e vida piedosa. Origem do pietismo.
Lei e Evangelho|C. F. W. Walther|Palestras sobre como distinguir a lei, que acusa, do evangelho, que consola, na pregação e no cuidado das pessoas.
Hinos|Paul Gerhardt|Hinos devocionais cheios de confiança em Deus, que se tornaram amados nas igrejas de língua alemã.
Institutas da Religião Cristã|João Calvino|Obra principal de Calvino: apresenta de forma organizada a doutrina cristã sobre Deus, Cristo, a salvação e a Igreja.
Comentários bíblicos|João Calvino|Comentários de Calvino à Bíblia, claros e diretos, que explicam o sentido do texto e o aplicam à vida.
Tratado da Ceia|João Calvino|Calvino explica o significado da Ceia do Senhor e como Cristo está presente para quem a recebe com fé.
Sobre a Providência|João Calvino|Calvino trata do cuidado e do governo de Deus sobre todas as coisas e do consolo que isso traz ao cristão.
Obras|Ulrico Zuínglio|Escritos do reformador de Zurique, com foco na autoridade da Bíblia e na simplicidade do culto.
Obras|Martin Bucer|Escritos do reformador de Estrasburgo, sobre a ordem da Igreja, o pastoreio e a unidade entre os protestantes.
Décadas|Heinrich Bullinger|Cinquenta sermões que resumem a doutrina cristã, escritos pelo sucessor de Zuínglio em Zurique.
Obras|John Knox|Escritos do reformador da Escócia, incluindo a história da Reforma em seu país.
Obras|Pedro Mártir Vermigli|Comentários e textos de um teólogo italiano da Reforma, conhecido pelo rigor bíblico.
Obras|Teodoro de Beza|Escritos do sucessor de Calvino em Genebra, que defendeu e organizou a teologia reformada.
Obras|Girolamo Zanchi|Escritos de um teólogo reformado italiano, com destaque para sua defesa da predestinação.
Obras|Zacarias Ursino|Escritos do principal autor do Catecismo de Heidelberg, com explicações da doutrina cristã.
Obras|Francis Turretini|Teologia sistemática em forma de perguntas e respostas, referência da ortodoxia reformada.
Obras|Herman Witsius|Estudo sobre os pactos de Deus com o ser humano, que mostra como a Bíblia se organiza.
Obras|Wilhelmus à Brakel|Obra que une doutrina e vida cristã, para ensinar o crente a viver o que crê.
Obras|William Perkins|Escritos do pai do puritanismo, sobre a pregação, a consciência e a vida de santidade.
A Cana Quebrada|Richard Sibbes|Mostra a ternura de Cristo com os fracos, que não quebra a cana rachada nem apaga a mecha que fumega.
A Joia Rara do Contentamento|Jeremiah Burroughs|Ensina a aprender a estar contente em Deus em todas as circunstâncias, mesmo nas perdas e dificuldades.
A Morte da Morte|John Owen|Defende que Cristo, ao morrer, salvou de fato aqueles por quem morreu, e examina o alcance da expiação.
Mortificação do Pecado|John Owen|Guia prático para combater o pecado que persiste na vida do crente, pelo poder do Espírito.
Corpo de Divindade|Thomas Watson|Explica o Catecismo Breve de Westminster em linguagem acessível, tratando de toda a doutrina cristã.
Obras|Stephen Charnock|Escritos sobre a existência e os atributos de Deus, em meditações profundas sobre quem Ele é.
O Cristão em Armadura Completa|William Gurnall|Comentário sobre a armadura de Deus em Efésios 6, e um guia para a luta espiritual do cristão.
Remédios Preciosos|Thomas Brooks|Mostra as armadilhas do diabo e oferece remédios bíblicos para resistir à tentação.
Obras|John Flavel|Escritos pastorais sobre a providência de Deus e a vida com Cristo, com muitas ilustrações simples.
O Pastor Reformado|Richard Baxter|Chamado e guia para o cuidado pastoral, que convoca os pastores à fidelidade, ao zelo e à humildade.
O Descanso Eterno dos Santos|Richard Baxter|Meditação sobre a esperança do céu e o descanso que Deus reserva aos seus, escrita durante uma doença grave.
Cartas|Samuel Rutherford|Cartas de consolo e amor a Cristo, escritas por um pastor escocês, muitas durante o exílio.
A Vida de Deus na Alma do Homem|Henry Scougal|Pequeno clássico sobre a fé verdadeira como uma vida nova, que une a alma a Deus.
O Peregrino|John Bunyan|Alegoria da jornada do cristão da Cidade da Destruição até a Cidade Celestial, cheia de provas e esperança.
A Guerra Santa|John Bunyan|Alegoria sobre a luta pela cidade de Alma-Humana, atacada pelo mal e libertada por Cristo.
Graça Abundante ao Principal dos Pecadores|John Bunyan|Autobiografia espiritual de Bunyan, que conta suas lutas e como a graça de Deus o alcançou.
Comentário|Matthew Henry|Comentário a toda a Bíblia, devocional e prático, que se tornou um dos mais lidos em língua inglesa.
Obras|Thomas Boston|Escritos pastorais escoceses, entre eles um estudo sobre a condição humana antes e depois da queda.
Hinos|Isaac Watts|Hinos que levaram a Bíblia ao canto da congregação, como "Alegria ao Mundo".
Obras|Philip Doddridge|Escritos devocionais, entre eles um guia sobre como a fé nasce e cresce na alma.
A Liberdade da Vontade|Jonathan Edwards|Tratado sobre a vontade humana, que defende que somos livres para querer o que desejamos, mas movidos pela natureza.
Afeições Religiosas|Jonathan Edwards|Estudo sobre como distinguir a verdadeira fé, que transforma o coração, das emoções sem fruto.
Pecadores nas Mãos de um Deus Irado|Jonathan Edwards|Sermão famoso de 1741 que chama o ouvinte ao arrependimento diante da santidade e da ira de Deus.
Diário|David Brainerd|Diário de um jovem missionário entre os indígenas americanos, que inspirou gerações à oração e à missão.
Sermões|George Whitefield|Sermões do pregador do Grande Despertamento, simples e apaixonados, que chamam à nova vida em Cristo.
Obras|John Gill|Comentário bíblico e teologia sistemática de um pastor batista, de forte tradição reformada.
Cartas e hinos|John Newton|Cartas pastorais e hinos do autor de "Maravilhosa Graça", que fala da graça que o alcançou.
Obras|William Cowper|Poemas e hinos de um poeta cristão, que expressam confiança e dor diante de Deus.
O Evangelho Digno de Toda Aceitação|Andrew Fuller|Defende que o evangelho deve ser pregado a todos, e que todos têm o dever de crer. Impulsionou as missões batistas.
Escritos|William Carey|Defende o dever dos cristãos de levar o evangelho a todas as nações. Inspirou o movimento missionário moderno.
Sermões|Charles Spurgeon|Sermões do "príncipe dos pregadores", centrados em Cristo, claros e cheios de ilustrações.
O Tesouro de Davi|Charles Spurgeon|Comentário devocional aos Salmos, verso a verso, com citações de muitos autores.
Lições aos Meus Alunos|Charles Spurgeon|Conselhos de Spurgeon a estudantes de pastoral, sobre pregação, ministério e vida do pastor.
Manhã e Noite|Charles Spurgeon|Devocionais curtos para cada manhã e cada noite do ano, com um versículo e uma reflexão.
Todo de Graça|Charles Spurgeon|Explicação simples do evangelho, que mostra que a salvação é dom de Deus, recebido pela fé.
Santidade|J. C. Ryle|Estudos sobre a vida santa, a luta contra o pecado e a diferença entre a justificação e a santificação.
Obras|Charles Hodge|Teologia sistemática de um teólogo de Princeton, que explica a doutrina reformada com base na Bíblia.
Obras|A. A. Hodge|Esboços de teologia reformada, claros e organizados, escritos por um professor de Princeton.
Obras|B. B. Warfield|Estudos sobre a inspiração da Bíblia, a pessoa de Cristo e a salvação, em defesa da fé reformada.
Obras|Robert L. Dabney|Teologia sistemática e escritos de um teólogo presbiteriano do sul dos Estados Unidos.
Obras|W. G. T. Shedd|Teologia dogmática de um professor de Nova York, ampla e firme, de linha reformada.
Obras|A. H. Strong|Teologia sistemática batista, muito usada em seminários, que reúne ensino bíblico e reflexão.
Obras|James P. Boyce|Teologia sistemática batista de um fundador do seminário de Louisville, em formato didático.
Obras|Robert Murray M'Cheyne|Cartas, sermões e diário de um jovem pastor escocês, conhecido pela santidade e pelo zelo missionário.
Comentário de Romanos|Robert Haldane|Comentário a Romanos que defende a justificação pela fé e que influenciou um despertamento na Europa.
Obras|Horatius Bonar|Escritos e hinos de um pastor escocês, sobre a vida cristã, a esperança e a santidade.
Obras|Octavius Winslow|Meditações devocionais que consolam e firmam o crente em Cristo, escritas em linguagem calorosa.
Palestras sobre o Calvinismo|Abraham Kuyper|Conferências em que Kuyper mostra como a fé reformada se aplica à vida, à ciência, à arte e à política.
Dogmática Reformada|Herman Bavinck|Teologia sistemática em quatro volumes de um dos maiores teólogos reformados holandeses.
Obras|Geerhardus Vos|Estudos sobre a Bíblia como história da revelação, que deram origem à teologia bíblica reformada.
Cristianismo e Liberalismo|J. Gresham Machen|Defende que o liberalismo teológico é outra religião e que o cristianismo histórico se baseia nos fatos do evangelho.
Declaração de Sentimentos (1608)|Jacó Armínio|Discurso em que Armínio expõe suas ideias sobre a predestinação e a graça, base do pensamento arminiano.
Disputas|Jacó Armínio|Teses de debates de Armínio sobre os principais temas da doutrina cristã, incluindo a graça e a livre vontade.
Exame do Tratado de Perkins|Jacó Armínio|Armínio responde, ponto por ponto, ao texto de Perkins sobre a predestinação e explica onde discorda.
Obras|Hugo Grócio|Escritos de um jurista e teólogo holandês, que defendeu a fé cristã e uma visão da expiação como ato de justiça pública de Deus.
Obras|Philipp van Limborch|Teologia cristã de um líder remonstrante, que organiza a doutrina arminiana de forma sistemática.
Obras|John Goodwin|Defende a redenção universal e a livre graça, em debate com os calvinistas ingleses.
Escritos sobre liberdade religiosa|Thomas Helwys|Um dos primeiros textos ingleses a defender a liberdade de consciência e de culto para todas as pessoas.
Sermões|João Wesley|Sermões padrão do metodismo, com o ensino de Wesley sobre a salvação, a fé e a vida santa.
Graça Gratuita|João Wesley|Sermão em que Wesley defende que a graça de Deus é livre para todos e não depende do mérito humano.
O Caráter de um Metodista|João Wesley|Descreve o cristão que ama a Deus de todo o coração e ao próximo como a si mesmo.
Explicação Simples da Perfeição Cristã|João Wesley|Wesley explica o que entende por perfeição cristã: um coração cheio de amor a Deus e ao próximo.
Um Apelo Sincero a Homens de Razão e Religião|João Wesley|Wesley apresenta a fé cristã a quem duvida e convida à religião do coração e da vida.
Diário|João Wesley|Registro das viagens, pregações e experiências de Wesley, que mostra o nascimento do metodismo.
Notas ao Novo Testamento|João Wesley|Comentário breve ao Novo Testamento, feito para o povo, que explica o texto com clareza.
Hinos|Carlos Wesley|Hinos de Carlos Wesley, que ensinam a teologia metodista em versos.
Obras|John Fletcher|Escritos de um parceiro de Wesley, que defendem a graça de Deus e a vida de obediência.
Comentário|Adam Clarke|Comentário a toda a Bíblia, de linha wesleyana, com notas históricas e linguísticas.
Institutos Teológicos|Richard Watson|Primeira teologia sistemática do metodismo, que organiza a doutrina de Wesley.
Diário|Francis Asbury|Diário do pioneiro metodista na América, com o relato de viagens e do trabalho com as igrejas.
Obras|John Miley|Teologia sistemática metodista, que explica a doutrina arminiana do pecado, da graça e da salvação.
Obras|William Burt Pope|Compêndio de teologia cristã de um teólogo metodista inglês, ampla e de linha wesleyana.
Palestras sobre Avivamentos|Charles Finney|Finney explica como promover avivamentos e a oração, a pregação e o esforço que os acompanham.
Obras|Phoebe Palmer|Escritos de uma pregadora do movimento de santidade, que ensinou um caminho prático para a vida santa.
Obras|William Booth|Escritos do fundador do Exército de Salvação, sobre o evangelho, a pobreza e o cuidado dos necessitados.
A Prática da Presença de Deus|Irmão Lourenço|Pequeno livro de um irmão de cozinha de um convento que aprendeu a viver na presença de Deus em tudo o que fazia.
Um Sério Chamado a uma Vida Devota|William Law|Chama o cristão a viver, em tudo, para Deus: no trabalho, no dinheiro, no tempo e na oração.
Obras|Jeremy Taylor|Escritos de um bispo anglicano sobre a vida santa e a boa morte, com conselhos práticos de devoção.
O Livro dos Mártires|John Foxe|Relato dos cristãos perseguidos e mortos por sua fé, da Igreja antiga à Reforma inglesa.
Obras|George Herbert|Poemas e escritos de um pastor anglicano, simples e profundos, sobre a vida com Deus.
Obras|John Donne|Poemas, meditações e sermões de um pregador inglês, sobre a fé, a morte e o amor de Deus.
Humildade|Andrew Murray|Pequeno livro que mostra que a humildade é a base da vida cristã e a raiz de todas as virtudes.
Permaneça em Cristo|Andrew Murray|Meditações em 31 dias sobre como permanecer em Cristo, como o ramo na videira.
Com Cristo na Escola de Oração|Andrew Murray|Meditações em 31 dias sobre o que Jesus ensinou sobre a oração, com aplicações práticas.
Poder pela Oração|E. M. Bounds|Mostra que a oração é a força do ministério e convoca os pastores a orar com constância.
O Segredo de uma Vida Cristã Feliz|Hannah Whitall Smith|Livro sobre a vida de confiança em Deus e de entrega, que ensina a descansar em Cristo.
Obras|R. A. Torrey|Escritos de um pregador e professor, sobre a oração, a Bíblia e o evangelismo.
Obras|D. L. Moody|Sermões e mensagens do evangelista, simples e diretos, que chamam as pessoas a Cristo.
Obras|F. B. Meyer|Meditações devocionais e biografias bíblicas de um pastor inglês, conhecido pelo calor e pela clareza.
Obras|G. Campbell Morgan|Exposições da Bíblia de um grande pregador inglês, que explica livros inteiros com clareza.
O Maior Bem do Mundo|Henry Drummond|Estudo curto sobre o amor em 1 Coríntios 13, que mostra o amor como o maior dom.
Obras|George Müller|Relatos de um homem que sustentou milhares de órfãos só pela oração e pela fé, sem pedir dinheiro a ninguém.
Obras|Hudson Taylor|Relatos e escritos do missionário que fundou a Missão para o Interior da China e viveu pela fé.
Obras|Amy Carmichael|Escritos de uma missionária que cuidou de crianças na Índia, cheios de devoção e entrega.
Em Seus Passos|Charles Sheldon|Romance em que cristãos decidem, por um ano, perguntar antes de agir: "O que Jesus faria?".
Ortodoxia|G. K. Chesterton|Chesterton conta como chegou à fé cristã e defende que o cristianismo ortodoxo é razoável e libertador.
Obras|Dietrich Bonhoeffer|Escritos do pastor alemão sobre o discipulado, a comunidade cristã e o custo de seguir Jesus.
Obras|Francisco de Sales|Conselhos para viver a devoção no dia a dia, mesmo no meio do trabalho e da família.
Obras|François Fénelon|Cartas de orientação espiritual, que ensinam a confiar em Deus, a vencer o orgulho e a buscar a simplicidade.
Obras|Madame Guyon|Escritos sobre a oração simples e a vida interior, que ensinam a buscar a presença de Deus.
Obras|Teresa de Ávila|Escritos da mística espanhola sobre a oração e o caminho da alma até Deus, como o "Castelo Interior".
Obras|João da Cruz|Poemas e tratados do místico espanhol sobre a noite escura da alma e a união com Deus.
Pensamentos|Blaise Pascal|Anotações do cientista e pensador francês sobre a fé, a razão e a condição humana, em defesa do cristianismo.
Analogia da Religião|Joseph Butler|Defende a fé cristã ao mostrar que as dificuldades da religião se parecem com as da natureza.
Evidências do Cristianismo|William Paley|Reúne razões históricas e racionais para crer no cristianismo, com o argumento famoso do relojoeiro.
Quem Moveu a Pedra?|Frank Morison|Um advogado investiga os fatos da ressurreição de Jesus e conta como a pesquisa mudou sua visão.
História da Igreja Cristã|Philip Schaff|História da Igreja em vários volumes, do tempo dos apóstolos até a Reforma, clara e muito citada.
A Vida e os Tempos de Jesus|Alfred Edersheim|Estudo da vida de Jesus que explica o ambiente judaico e histórico dos Evangelhos.
Comentários|Carl Friedrich Keil|Comentário técnico ao Antigo Testamento, escrito em dupla com Delitzsch, que explica o texto original.
Comentários|Franz Delitzsch|Comentário técnico ao Antigo Testamento, escrito em dupla com Keil, que explica o texto original.
Comentários|Albert Barnes|Notas explicativas à Bíblia, simples e acessíveis, escritas para pastores e leitores comuns.
Obras|Flávio Josefo|Historiador judeu do século I, cujas obras contam a história do povo judeu e a guerra contra Roma.
Concordância de Strong|James Strong|Índice de todas as palavras da Bíblia, com o termo original em hebraico e grego, para estudo.
Dicionários de Smith e Easton|William Smith e M. G. Easton|Dicionários bíblicos que explicam pessoas, lugares, costumes e termos da Bíblia.
Bíblia de Almeida (edições antigas)|João Ferreira de Almeida|Primeira tradução protestante da Bíblia para o português, feita por Almeida a partir dos textos originais.
Salmos e Hinos (1861)|Robert Kalley|Primeiro hinário evangélico em português do Brasil, organizado pelo missionário Robert Kalley.
Diário|Ashbel Simonton|Diário do primeiro missionário presbiteriano no Brasil, que conta o início do trabalho em terras brasileiras.
Obras|José Manoel da Conceição|Escritos do primeiro pastor evangélico brasileiro, um ex-padre que passou a pregar o evangelho.
O Problema Religioso da América Latina|Eduardo Carlos Pereira|Obra de um pastor presbiteriano brasileiro sobre a situação religiosa do Brasil e da América Latina.
Sermões|Padre António Vieira|Sermões do jesuíta português, mestre da língua, que tratam de fé, justiça e da vida em sociedade.
Bíblia (tradução de Pereira de Figueiredo)|António Pereira de Figueiredo|Tradução católica da Bíblia para o português, feita a partir da Vulgata, no século XVIII.
`;
const POR_CHAVE = {}, POR_AUTOR = {}, CONT = {};
LINHAS.trim().split('\n').forEach(l => {
  const p = l.split('|'); if (p.length < 3) return;
  const resumo = p.slice(2).join('|').trim(), a = norm(p[1]);
  POR_CHAVE[norm(p[0]) + '|' + a] = resumo; POR_AUTOR[a] = resumo; CONT[a] = (CONT[a] || 0) + 1;
});
export const TOTAL_RESUMOS = Object.keys(POR_CHAVE).length;
export function resumoDe(titulo, autor) {
  const a = norm(autor), k = norm(titulo) + '|' + a;
  if (POR_CHAVE[k]) return POR_CHAVE[k];
  return CONT[a] === 1 ? POR_AUTOR[a] : '';   // autor com uma só obra: casa mesmo se o título estiver um pouco diferente
}
