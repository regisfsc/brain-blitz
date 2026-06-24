export interface Flashcard {
  id: string;
  front: string;
  back: string;
  imageSearchTerm: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint: string;
  imageSearchTerm: string;
  svgDiagram?: string;
  source: string;
}

export interface StudySession {
  subject: string;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  isOfflineFallback?: boolean;
}

export const fallbackSessions: { [key: string]: StudySession } = {
  eletrodinamica: {
    subject: "Física: Eletrodinâmica",
    isOfflineFallback: true,
    flashcards: [
      {
        id: "fc_el_1",
        front: "O que mede a Intensidade da Corrente Elétrica ($I$)?",
        back: "Mede a quantidade líquida de carga elétrica (em Coulombs) que atravessa a secção transversal de um condutor por unidade de tempo (segundos). Sua unidade no SI é o Ampere ($1 A = 1 C/s$).",
        imageSearchTerm: "electric current flow through conductor wire"
      },
      {
        id: "fc_el_2",
        front: "Qual o conceito de Diferença de Potencial (d.d.p. ou $U$)?",
        back: "Também chamada de tensão ou voltagem, é a energia necessária para mover uma carga elétrica entre dois pontos. Representa o 'empurrão' que os elétrons recebem do gerador para formar a corrente. Unidade no SI: Volt ($V$).",
        imageSearchTerm: "voltage electric potential battery force"
      },
      {
        id: "fc_el_3",
        front: "O que é Resistência Elétrica ($R$) e qual sua lei básica?",
        back: "É a oposição que os átomos de um condutor oferecem à passagem de elétrons livres. Regulada pela Primeira Lei de Ohm: $R = U / I$. Sendo medida em Ohms ($Ω$).",
        imageSearchTerm: "electrical resistor circuit resistance"
      },
      {
        id: "fc_el_4",
        front: "O que dita a Segunda Lei de Ohm?",
        back: "Estabelece que a resistência de um fio uniforme depende de suas dimensões físicas e do material: $R = ρ · L / A$, onde $ρ$ (rô) é a resistividade do material, $L$ é o comprimento do fio e $A$ é a área de secção transversal.",
        imageSearchTerm: "wire length and cross sectional area resistance geometry"
      },
      {
        id: "fc_el_5",
        front: "Como calcular a Potência Elétrica ($P$) dissipada por um resistor?",
        back: "A potência mede a rapidez com que a energia elétrica é convertida em calor (efeito Joule). Pode ser calculada pelas fórmulas: $P = U · I$, $P = R · I²$ ou $P = U² / R$. Unidade no SI: Watt ($W$).",
        imageSearchTerm: "joule heating lightbulb resistor power dissipation"
      },
      {
        id: "fc_el_6",
        front: "Como funcionam as associações de resistores em Série e Paralelo?",
        back: "Em Série: a corrente $I$ é igual em todos; somamos as resistências ($R_{eq} = R_1 + R_2$). Em Paralelo: a tensão $U$ é igual para todos; somamos os inversos ($1/R_{eq} = 1/R_1 + 1/R_2$).",
        imageSearchTerm: "series and parallel resistors circuit schematic"
      }
    ],
    quiz: [
      {
        id: "q_el_1",
        question: "Um chuveiro elétrico ligado em $110 V$ consome uma corrente de $20 A$. Qual é a potência elétrica dissipada por esse aparelho?",
        options: [
          "5,5 W",
          "1100 W",
          "2200 W",
          "220 W",
          "4400 W"
        ],
        correctAnswer: 2,
        explanation: "Utilizando a fórmula da potência elétrica: $P = U · I$. Substituindo os valores conhecidos, temos $P = 110 V · 20 A = 2200 W$. Portanto, a potência é de 2200 Watts.",
        hint: "A relação mais direta que conecta tensão ($U$), corrente ($I$) e potência ($P$) é o produto delas.",
        imageSearchTerm: "shower electric connection water heater",
        source: "Tipo ENEM"
      },
      {
        id: "q_el_2",
        question: "Dois resistores de valores $10 Ω$ e $30 Ω$ são associados em série e conectados a uma fonte de $120 V$. Qual é a corrente que percorre o circuito?",
        options: [
          "12 A",
          "4 A",
          "3 A",
          "8 A",
          "6 A"
        ],
        correctAnswer: 2,
        explanation: "Como a associação está em série, a resistência equivalente é a soma simples: $R_{eq} = 10 Ω + 30 Ω = 40 Ω$. Agora aplicamos a Primeira Lei de Ohm: $U = R_{eq} · I → 120 V = 40 Ω · I → I = 3 A$.",
        hint: "Primeiro encontre a oposição total (série) somando os valores, depois use $U = R · I$.",
        imageSearchTerm: "pure series resistors circuit schematic diagram",
        source: "Tipo FUVEST"
      },
      {
        id: "q_el_3",
        question: "Três lâmpadas idênticas estão associadas em paralelo em uma rede elétrica residencial sob d.d.p. constante de $127 V$. Se uma das lâmpadas queimar, o que acontece com a luminosidade e com a corrente elétrica nas outras duas?",
        options: [
          "As outras duas apagam pois o circuito é interrompido.",
          "A corrente nas outras duas dobra e a intensidade luminosa delas aumenta muito.",
          "A d.d.p. nelas cai pela metade de forma a manter a corrente total inalterada.",
          "Elas continuam funcionando normalmente com o mesmo brilho, mas a corrente total fornecida pela rede diminui.",
          "O circuito entra em curto-circuito devido ao desbalanceamento das impedâncias elétricas."
        ],
        correctAnswer: 3,
        explanation: "Em uma associação em paralelo, cada ramal é independente e recebe a mesma tensão ($127 V$). Se uma lâmpada queima, as outras mantêm a d.d.p. constante de $127 V$ e, como suas resistências individuais são iguais, as respectivas correntes individuais permanecem idênticas, preservando seu brilho. Contudo, a corrente total retirada da fonte (que é a soma das ramificadas) diminui pelo corte do canal queimado.",
        hint: "Lembre-se das instalações residenciais: as tomadas e luzes operam harmonicamente de forma independente.",
        imageSearchTerm: "parallel home sockets lightbulbs circuit diagram",
        source: "Tipo ENEM"
      },
      {
        id: "q_el_4",
        question: "Um filamento cilíndrico de cobre possui resistência $R$. Um engenheiro desenvolve uma nova fiação de mesmo material, porém com o triplo do comprimento ($L' = 3L$) e o dobro do diâmetro ($d' = 2d$). Qual será a nova resistência elétrica $R'$ em função de $R$?",
        options: [
          "R' = 6 R",
          "R' = 3/2 R",
          "R' = 3/4 R",
          "R' = 12 R",
          "R' = 4/3 R"
        ],
        correctAnswer: 2,
        explanation: "Aplicando a Segunda Lei de Ohm: $R = ρ · L / A$. A área da secção cilíndrica depende do raio quadrado: $A = π · r²$ ou $A = π · d² / 4$. Ao dobrar o diâmetro, a área aumenta 4 vezes ($A' = 4A$). Logo, a nova resistência é: $R' = ρ · (3L) / (4A) = 3/4 · (ρ · L / A) = 3/4 R$.",
        hint: "A área cresce com o quadrado do diâmetro. Cuidado para não dividir apenas por 2!",
        imageSearchTerm: "cylindrical wire thickness length resistance comparison",
        source: "Tipo UNICAMP"
      },
      {
        id: "q_el_5",
        question: "O chuveiro elétrico de uma residência opera com potência de $4400 W$ quando ligado na posição 'Inverno'. Sabendo que o aparelho é utilizado por um período diário acumulado de 30 minutos, qual o consumo de energia elétrica em kWh ao final de um mês de 30 dias?",
        options: [
          "132 kWh",
          "66 kWh",
          "1320 kWh",
          "44 kWh",
          "2,2 kWh"
        ],
        correctAnswer: 1,
        explanation: "Consumo diário: tempo de funcionamento $T_d = 0,5 h$. Energia por dia: $E_d = P · T_d = 4,4 kW · 0,5 h = 2,2 kWh$. Em um mês de 30 dias: $E_{total} = 2,2 kWh/dia · 30 dias = 66 kWh$.",
        hint: "Energia é potência (em kW) multiplicada pelo tempo de uso acumulado medido em horas (h).",
        imageSearchTerm: "electricity bill energy consumption usage meter",
        source: "Tipo ENEM"
      },
      {
        id: "q_el_6",
        question: "Qual dispositivo de segurança elétrica é projetado para desarmar ou fundir, interrompendo a passagem de energia quando a corrente de um circuito ultrapassa um limite máximo de segurança?",
        options: [
          "Amperímetro",
          "Disjuntor ou fusível",
          "Voltímetro",
          "Reostato linear",
          "Gerador químico de f.e.m."
        ],
        correctAnswer: 1,
        explanation: "Os fusíveis e disjuntores são dispositivos que atuam na proteção dos circuitos. O fusível possui um filamento de baixo ponto de fusão que derrete sob superaquecimento (efeito Joule extenuante) quando a corrente limite é ultrapassada. O disjuntor atua de modo eletromagnético ou bimetálico desarmando a chave.",
        hint: "Sua função primária não é medir nem repassar energia, mas sim impedir correntes exorbitantes e incêndios.",
        imageSearchTerm: "fuse and miniature thermal circuit breaker",
        source: "Tipo ENEM"
      },
      {
        id: "q_el_7",
        question: "Deseja-se medir a corrente e a diferença de potencial em um resistor instalado em um circuito. Como devem ser conectados os aparelhos Amperímetro (A) e Voltímetro (V) em relação a esse resistor?",
        options: [
          "Amperímetro em paralelo e Voltímetro em série.",
          "Ambos acoplados em paralelo.",
          "Ambos acoplados em série.",
          "Amperímetro em série e Voltímetro em paralelo.",
          "Amperímetro direto nos bornes da bateria e Voltímetro aterrado no polo nulo."
        ],
        correctAnswer: 3,
        explanation: "O Amperímetro possui resistência interna quase nula e deve ser ligado em série para medir plenamente todo o fluxo (corrente) que atravessa o componente; se fosse ligado em paralelo geraria curto-circuito. O Voltímetro possui resistência altíssima (ideal de infinito) para não sugar energia e deve ser colocado em paralelo, captando a diferença de potencial entre os extremos do caminho de queda.",
        hint: "O medidor de fluxo deve ser atravessado (série) e o de diferença deve 'abraçar' as extremidades (paralelo).",
        imageSearchTerm: "correct connection of ammeter and voltmeter in circuit schema",
        source: "Tipo FUVEST"
      },
      {
        id: "q_el_8",
        question: "Um gerador de força eletromotriz $E = 12 V$ possui uma resistência interna $r = 1 Ω$. Se ele estiver conectado em série com um circuito externo de resistência total $R = 5 Ω$, qual será a chamada 'tensão útil' ($U$) entregue nos terminais do gerador?",
        options: [
          "12 V",
          "10 V",
          "2 V",
          "6 V",
          "8 V"
        ],
        correctAnswer: 1,
        explanation: "A corrente total do circuito é dada pela Lei de Pouillet: $I = E / (R + r) = 12 V / (5 Ω + 1 Ω) = 2 A$. A tensão útil que sai dos bornes do gerador é dada por: $U = E - r · I → U = 12 V - (1 Ω · 2 A) = 10 V$.",
        hint: "Parte da tensão gerada é engolida internamente na resistência do próprio gerador. Use $U = E - r · I$.",
        imageSearchTerm: "internal resistance generator modeling circuit",
        source: "Tipo UNESP"
      },
      {
        id: "q_el_9",
        question: "Em uma pilha comum recarregável que informa $2500 mAh$, essa unidade (miliampere-hora) representa fisicamente qual grandeza associada à operação elétrica?",
        options: [
          "A corrente elétrica máxima instantânea que a pilha consegue drenar.",
          "A potência energética consumida no ato da transferência.",
          "A quantidade de carga elétrica líquida que ela é capaz de armazenar.",
          "A tensão equivalente produzida nos polos químicos da eletrólise.",
          "A resistência ôhmica equivalente da solução eletrolítica."
        ],
        correctAnswer: 2,
        explanation: "A corrente é o quociente de carga pelo tempo ($I = Q / T → Q = I · T$). Portanto, o Ampere-hora ($Ah$) representa o produto de corrente por tempo, o que descreve a carga elétrica total armazenada na bateria química ($2500 mAh = 2,5 A · 3600 s = 9000 C$).",
        hint: "Dica: converta 'miliampere' (corrente) vezes 'hora' (tempo). Essa fórmula resulta em carga.",
        imageSearchTerm: "rechargeable AA battery capacity label close up",
        source: "Tipo ENEM"
      },
      {
        id: "q_el_10",
        question: "Se você colocar dois resistores idênticos de valor $R$ associados em paralelo, qual é o valor numérico da resistência equivalente desse conjunto?",
        options: [
          "2 R",
          "R / 2",
          "R²",
          "R / 4",
          "R"
        ],
        correctAnswer: 1,
        explanation: "Aplicando a regra de paralelos para resistores idênticos: divide-se o valor de um deles pelo número total de resistores idênticos em paralelo. $R_{eq} = R / N = R / 2$. Via fórmula clássica de inversos: $1/R_{eq} = 1/R + 1/R = 2/R → R_{eq} = R/2$.",
        hint: "Ao estabelecer vias alternativas paralelas idênticas, a resistência global do conduto cai pela metade.",
        imageSearchTerm: "two identical resistors associated in parallel",
        source: "Tipo ENEM"
      }
    ]
  },
  citologia: {
    subject: "Biologia: Citobio e Organelas",
    isOfflineFallback: true,
    flashcards: [
      {
        id: "fc_bio_1",
        front: "Qual a função do Núcleo Celular?",
        back: "Armazena e protege o genoma (DNA) nas células eucariontes. Controla todo o metabolismo celular e coordena a síntese proteica por meio da transcrição de RNA mensageiro.",
        imageSearchTerm: "cell nucleus genetic material and nucleolus"
      },
      {
        id: "fc_bio_2",
        front: "O que faz a Mitocôndria e qual sua origem evolutiva?",
        back: "Responsável pela respiração celular aeróbica, gerando ATP (energia). Possui DNA circular próprio e ribossomo vestigial, sustentando a teoria de endossimbiose bacteriana.",
        imageSearchTerm: "mitochondrion internal structure textbook diagram"
      },
      {
        id: "fc_bio_3",
        front: "Qual o papel do Complexo de Golgi?",
        back: "Atua no processamento, empacotamento, secreção e endereçamento de glicoproteínas e lipídeos. Também dá origem ao acromossomo nos espermatozoides e aos lisossomos.",
        imageSearchTerm: "golgi apparatus vesicles synthesis secretion schema"
      },
      {
        id: "fc_bio_4",
        front: "Diferença entre Retículo Organizado Liso (Não Granular) e Rugoso (Granular):",
        back: "Rugoso: possui ribossomos aderidos à membrana; sintetiza proteínas destinadas à exportação celular. Liso: sem ribossomos; sintetiza lipídeos (hormônios esteroides) e realiza a desintoxicação de drogas nos hepatócitos.",
        imageSearchTerm: "smooth and rough endoplasmic reticulum detail"
      },
      {
        id: "fc_bio_5",
        front: "O que são Lisossomos e Peroxissomos?",
        back: "Lisossomos: vesículas repletas de enzimas digestivas ácidas que promovem a digestão intracelular (autofagia e heterofagia). Peroxissomos: vesículas digestivas ricas em catalase, enzimas destinadas à degradação de água oxigenada ($H₂O₂$) e oxidação de ácidos graxos.",
        imageSearchTerm: "lysosome and peroxisome degradation pathway sketch"
      },
      {
        id: "fc_bio_6",
        front: "Qual o papel dos Ribossomos e Centríolos?",
        back: "Ribossomos: complexos macromoleculares livres no citoplasma ou aderidos à carioteca/retículo; realizam a síntese biológica de cadeias polipeptídicas (proteínas). Centríolos: formados por microtúbulos; organizam o fuso de mitose e formam cílios e flagelos celulares.",
        imageSearchTerm: "ribosome protein synthesis translation model"
      }
    ],
    quiz: [
      {
        id: "q_bio_1",
        question: "Células musculares esqueléticas (miócitos) necessitam de constante e massiva energia mecânica para executar a contração corporal rápida. Qual organela celular é encontrada em quantidade extremamente elevada nessas células?",
        options: [
          "Lisossomos",
          "Mitocôndrias",
          "Complexo de Golgi",
          "Ribossomos livres",
          "Peroxissomos"
        ],
        correctAnswer: 1,
        explanation: "As mitocôndrias operam a respiração celular aeróbica e sintetizam as moléculas energéticas de ATP necessárias para alimentar molecularmente a bomba de cálcio e o deslizamento dos filamentos proteicos de actina e miosina das miofibrilas.",
        hint: "Pense na grande usina que gera a energia mecânica do tônus e movimento.",
        imageSearchTerm: "muscle fiber mitochondrial distribution cellular density",
        source: "Tipo ENEM"
      },
      {
        id: "q_bio_2",
        question: "Após a ingestão crônica de bebidas alcoólicas e automedicação excessiva contendo sedativos, o fígado passa por uma adaptação metabólica, aumentando as defesas de biotransformação toxicológica. Qual organela celular se desenvolve massivamente nos hepatócitos para tolerar e degradar essas toxinas?",
        options: [
          "Retículo Endoplasmático Rugoso",
          "Retículo Endoplasmático Liso",
          "Lisossomos ácidos",
          "Cloroplastos vegetais",
          "Ribossomos citoplasmáticos"
        ],
        correctAnswer: 1,
        explanation: "O Retículo Endoplasmático Liso (não-granular) é responsável direto pela degradação e desintoxicação de substâncias exógenas perigosas, como álcoois e fármacos lipossolúveis cotidianos, além de sintetizar fosfolipídeos que compõem membranas.",
        hint: "Esta organela tubular realiza síntese lipídica e desintoxicação, agindo livre de ribossomos vinculados.",
        imageSearchTerm: "hepatocyte smooth endoplasmic reticulum expansion diagram",
        source: "Tipo FUVEST"
      },
      {
        id: "q_bio_3",
        question: "A silicose é uma doença pulmonar ocupacional grave na qual trabalhadores de pedreiras inalam micropartículas cristalinas de sílica. No compartimento pulmonar, os macrófagos englobam a sílica, mas os cristais perfuram as membranas das vesículas digestivas internas, jogando enzimas ácidas direto no citoplasma. Esse processo autodestrutivo ocorre pela ruptura de quais organelas?",
        options: [
          "Ribossomos",
          "Mitocôndrias",
          "Lisossomos",
          "Peroxissomos",
          "Complexo Golgi"
        ],
        correctAnswer: 2,
        explanation: "Os lisossomos são sacos membranosos que abrigam enzimas hidrolíticas para digestão intracelular ácida. Ao se romperem devido a traumas mecânicos como perfuração por sílica, as amilasas e proteases acidificantes vazam para o citosol hígido celular, iniciando a digestão e morte desordenada do macrófago (autólise indesejada), culminando em fibrose.",
        hint: "Organela contendo pH ácido extremo incumbida de digerir dejetos ou fagocitoses alheias.",
        imageSearchTerm: "macrophage phagocytosis silica lysosome rupture schema",
        source: "Tipo UNICAMP"
      },
      {
        id: "q_bio_4",
        question: "Durante o período gestacional, os hormônios sexuais progesterona e testosterona, formados à base de colesterol nas gônadas, são secretados continuamente no sangue do feto. Qual organela está intimamente associada a essa alta taxa de síntese lipídica esteroidal?",
        options: [
          "Complexo de Golgi",
          "Retículo Endoplasmático Liso",
          "Ribossomos",
          "Vácuolos vegetais",
          "Nucléolo central"
        ],
        correctAnswer: 1,
        explanation: "Hormônios esteroides são derivados lipídicos baseados em colesterol. O local primordial de biosíntese de lipídeos, hormônios sexuais esteroidais e armazenamento celular de íons cálcio é o Retículo Endoplasmático Liso.",
        hint: "A organela tubular que trabalha sem ribossomos e catalisa lipídeos é o Retículo...",
        imageSearchTerm: "steroid producing hormone cells reticulum",
        source: "Tipo ENEM"
      },
      {
        id: "q_bio_5",
        question: "Qual característica mitocondrial sustenta de maneira inquestionável a celebrada 'Teoria da Endossimbiose' postulada por Lynn Margulis?",
        options: [
          "Presença de dupla membrana e capacidade de sintetizar lipídios estruturais.",
          "Genoma circular próprio desprovido de histonas e ribossomos homólogos aos de procariontes.",
          "Capacidade de realizar ciclose citoplasmática e síntese de glicose livre.",
          "Presença de carioteca interna contendo poros de troca ativa de proteínas nucleares.",
          "Possibilidade de quebrar moléculas de glicose sem duto aeróbico no citosol."
        ],
        correctAnswer: 1,
        explanation: "As mitocôndrias e os cloroplastos carregam DNA circular próprio idêntico ao de bactérias de vida livre, sem histonas atreladas, e contam com ribossomos próprios $70S$ similares aos bacterianos, além de possuírem duas membranas compatíveis com processo de fagocitose.",
        hint: "Pense na genética molecular própria mantida e herdada exclusivamente de forma materna.",
        imageSearchTerm: "symbiosis bacterial capture organelle evolution",
        source: "Tipo ENEM"
      },
      {
        id: "q_bio_6",
        question: "O acromossomo é uma estrutura vesicular presente no topo dos espermatozoides de mamíferos que contém enzimas digestivas como a hialuronidase. Sua função é perfurar a zona pelúcida do ovócito na fertilização. Esse acromossomo se origina de qual organela celular progenitora?",
        options: [
          "Mitocôndrias",
          "Ribossomos acoplados",
          "Complexo de Golgi",
          "Centríolos polares",
          "Peroxissomos reativos"
        ],
        correctAnswer: 2,
        explanation: "O Complexo de Golgi sintetiza e empacota carboidratos e glicoproteínas, formando vesículas secretoras. Durante a espermiogênese, as cisternas golgienses fundem suas secreções, criando a grande vesícula que encabeça e blinda o espermatozoide (o acromossomo).",
        hint: "É a organela secretora encarregada de destinar e empacotar produtos de exportação.",
        imageSearchTerm: "spermiogenesis golgi forming acrosome head",
        source: "Tipo FUVEST"
      },
      {
        id: "q_bio_7",
        question: "Células secretoras de anticorpos (plasmócitos) excretam massas proteicas de imunoglobulinas continuamente em resposta a invasões microbianas. Essas células maduras apresentam alto grau de desenvolvimento de qual organela celular?",
        options: [
          "Retículo Endoplasmático Rugoso",
          "Lisossomos digestivos",
          "Vácuolos hídricos",
          "Citoesqueleto flexível",
          "Peroxissomos oxidantes"
        ],
        correctAnswer: 0,
        explanation: "Os plasmócitos produzem e exportam enormes cotas de imunoglobulinas (proteínas solúveis de defesa). Proteínas endereçadas para fora do corpo celular são obrigatoriamente produzidas nos ribossomos presentes no Retículo Endoplasmático Rugoso (Granular), de onde trafegam ao Golgi.",
        hint: "As imunoglobulinas são glicoproteínas. Cuidado, o retículo liso trabalha com gordura, não com cadeias proteicas.",
        imageSearchTerm: "plasma cell immunoglobulins secretion rough reticulum",
        source: "Tipo ENEM"
      },
      {
        id: "q_bio_8",
        question: "O peroxissomo neutraliza e converte o radical tóxico de peróxido de hidrogênio ($H₂O₂$) formado no metabolismo celular humano, transformando-o em subprodutos inofensivos. Qual enzima catalisadora atua nesse milissegundo de conversão molecular celular?",
        options: [
          "Hialuronidase",
          "Amilase salivar",
          "Catalase",
          "Lipase pancreática",
          "DNA polimerase"
        ],
        correctAnswer: 2,
        explanation: "Os peroxissomos são abundantes de Catalase, uma enzima específica capaz de dismutar rapidamente o peróxido de hidrogênio (um radical danoso) em água líquida purificada ($H₂O$) e gás oxigênio inerte ($O₂$).",
        hint: "Essa enzima protege as bases do DNA do estresse oxidativo severo.",
        imageSearchTerm: "catalase hydrogen peroxide reaction formula",
        source: "Tipo UNESP"
      },
      {
        id: "q_bio_9",
        question: "Qual elemento do citoesqueleto celular é estruturado com base em polímeros de actina e miosina, sendo responsável direto pelas contrações musculares, formação do anel de citocinese nas divisões e dobras de ciclose?",
        options: [
          "Microtúbulos",
          "Filamentos intermediários",
          "Microfilamentos de actina",
          "Lâmina nuclear rígida",
          "Microtúbulos polares de tubulina"
        ],
        correctAnswer: 2,
        explanation: "Os microfilamentos são polímeros helicoidais formados pela proteína globular actina. Atuam ao lado da miosina estruturando a rigidez da membrana, movimento de ciclose (fluxo citoplasmático) e constrição na estrangulação divisória mitótica (citocinese).",
        hint: "Músculos dependem de actina e miosina. Procure a estrutura biológica associada a esses microfilamentos proteicos.",
        imageSearchTerm: "actin microfilaments cellular cortex layout",
        source: "Tipo UNICAMP"
      },
      {
        id: "q_bio_10",
        question: "Nas células que contam com núcleo delimitado, onde os ribossomos têm suas subunidades ribossômicas pré-montadas de forma molecular acelerada a partir de sequências de RNA ribossômico associadas?",
        options: [
          "Fuso mitótico",
          "Nucléolo",
          "Corpo de Cajal",
          "Citoplasma externo",
          "Lúmen golgiense"
        ],
        correctAnswer: 1,
        explanation: "O nucléolo é uma região ultra-densa, não delimitada por membranas localizada no cerne nuclear celular. Ele centraliza as alças organizadoras nucleolares do DNA que transcrevem e processam freneticamente os RNAs ribossomais ($RNAr$) agregados com proteínas para formar as subunidades ribossômicas de tradução.",
        hint: "É a mancha escura de alta atividade no núcleo das células eucarióticas saudáveis.",
        imageSearchTerm: "electron micrograph of nucleolus within nucleus region",
        source: "Tipo ENEM"
      }
    ]
  },
  estequiometria: {
    subject: "Química: Estequiometria",
    isOfflineFallback: true,
    flashcards: [
      {
        id: "fc_qm_1",
        front: "O que é o Mol e qual o valor da Constante de Avogadro?",
        back: "Mol é a quantidade de matéria equivalente a $6,02 · 10²³$ entidades elementares (átomos, íons ou moléculas). É a unidade de grandeza química básica no SI.",
        imageSearchTerm: "avogadro constant atoms quantity mole representation"
      },
      {
        id: "fc_qm_2",
        front: "Que leis ponderais fundamentam os cálculos estequiométricos?",
        back: "Lei de Lavoisier: conservação das massas em recipientes lacrados: 'Na natureza nada se cria, tudo se transforma'. Lei de Proust: proporções fixas e constantes de massas reagentes.",
        imageSearchTerm: "lavoisier mass balance chemical conservation scale"
      },
      {
        id: "fc_qm_3",
        front: "O que define o Reagente Limitante e o em Excesso?",
        back: "Limitante: é o reagente que se esgota primeiro e dita quanto produto será gerado. Excesso: é aquele que sobra e não reage por falta de companheiros químicos.",
        imageSearchTerm: "limiting and excess reactant molecular analogy"
      },
      {
        id: "fc_qm_4",
        front: "Qual o conceito de Pureza ($P$) química em um reagente?",
        back: "Percentual em massa do material puro efetivo dentro de uma amostra comercial impura. Apenas a porção limpa e pura do reagente reage estequiometricamente: $m_{pura} = m_{amostra} · P$.",
        imageSearchTerm: "chemical purity percentage active ingredient mass"
      },
      {
        id: "fc_qm_5",
        front: "O que é o Rendimento ($R$) de uma reação e como calculá-lo?",
        back: "Massa ou volume realmente produzido em relação ao esperado teoricamente (100%). Calculado por: $R = m_{real} / m_{teorica} · 100$. Sempre alterado por fatores de perdas práticas.",
        imageSearchTerm: "percent yield laboratory chemical reaction conversion"
      },
      {
        id: "fc_qm_6",
        front: "Qual o volume molar de qualquer Gás Ideal nas CNTP?",
        back: "Nas Condições Normais de Temperatura e Pressão ($T = 0 °C = 273 K$; $P = 1 atm$), um mol de qualquer gás ideal ocupa exatamente o volume de $22,4 L$.",
        imageSearchTerm: "molar volume comparison gas cylinder liters cntp"
      }
    ],
    quiz: [
      {
        id: "q_qm_1",
        question: "Dada a reação de combustão completa do propano: $C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O$. Se queimarmos completamente $2 mol$ de propano, quantas moléculas de gás carbônico ($CO₂$) serão lançadas na atmosfera? (Considere a constante de Avogadro como $6 · 10²³$ molec/mol)",
        options: [
          "6 · 10²³",
          "12 · 10²³",
          "18 · 10²³",
          "36 · 10²³",
          "24 · 10²³"
        ],
        correctAnswer: 3,
        explanation: "Pela estequiometria da reação química balanceada, cada $1 mol$ de propano reage gerando $3 mol$ de $CO₂$. Logo, ao reagir $2 mol$ de propano geraremos $6 mol$ de $CO₂$. Multiplicando pelo fator da constante de Avogadro: $6 mol · 6 · 10²³ = 36 · 10²³$ moléculas.",
        hint: "A proporção é de 1 para 3. Então para 2 mols de reagente nascem 6 mols extras de produto. Multiplique pelo número de Avogadro.",
        imageSearchTerm: "propane cylinder combustion release of carbon dioxide molecule",
        source: "Tipo ENEM"
      },
      {
        id: "q_qm_2",
        question: "Qual massa de água líquida ($H₂O$) é obtida pela combustão estequiométrica de $10 g$ de gás hidrogênio ($H₂$) com excesso de gás oxigênio ($O₂$)? Reação: $2 H₂ + O₂ → 2 H₂O$ (Massas molares: $H = 1 g/mol$, $O = 16 g/mol$)",
        options: [
          "10 g",
          "18 g",
          "90 g",
          "180 g",
          "50 g"
        ],
        correctAnswer: 2,
        explanation: "Massa molar de $H₂ = 2 g/mol$, $H₂O = 18 g/mol$. Pela proporção balanceada: $2 mol$ de $H₂$ ($4 g$) formam $2 mol$ de $H₂O$ ($36 g$). Se $4 g$ de $H₂$ produzem $36 g$ de $H₂O$, então $10 g$ produzirão: $x = (10 g · 36 g) / 4 g = 90 g$ de água.",
        hint: "Construa uma regra de três direta correlacionando massas molares de $2 H₂ = 4 g$ e $2 H₂O = 36 g$.",
        imageSearchTerm: "hydrogen fuel oxygen clean combustion water vapor",
        source: "Tipo ENEM"
      },
      {
        id: "q_qm_3",
        question: "Um lote comercial de carbonato de cálcio ($CaCO₃$) com peso de $200 g$ e pureza de $80\\%$ é completamente calcinado gerando cal e gás carbônico: $CaCO₃ → CaO + CO₂$. Qual massa pura estrutural de óxido de cálcio ($CaO$) será formada ao final da reação? (Massas molares: $Ca = 40$, $C = 12$, $O = 16$)",
        options: [
          "112 g",
          "200 g",
          "160 g",
          "89,6 g",
          "56 g"
        ],
        correctAnswer: 3,
        explanation: "1) Extrair a massa de reagente puro: $200 g · 0,80 = 160 g$ de $CaCO₃$ puro. 2) Reação estequiométrica de decomposição térmica: $CaCO₃ (100 g/mol) → CaO (56 g/mol) + CO₂$. 3) Regra de três: se $100 g$ de carbonato rendem $56 g$ de óxido de cálcio, $160 g$ do sal renderão $x$. $x = (160 · 56) / 100 = 89,6 g$.",
        hint: "Primeiro aplique os 80% de pureza sobre a massa bruta de 200g. Use essa fração limpa para os cálculos da calcinagem carbonatada.",
        imageSearchTerm: "limestone rocks calcium oxide industrial furnace thermal decomposition",
        source: "Tipo FUVEST"
      },
      {
        id: "q_qm_4",
        question: "Trabalhando sob condições ideais industriais, um reator alimenta a reação de síntese da amônia: $N₂ + 3 H₂ → 2 NH₃$. Se misturarmos $2 mol$ de nitrogênio ($N₂$) com $12 mol$ de hidrogênio ($H₂$), qual reagente será o limitante e quantos mols de amônia se obterá?",
        options: [
          "O nitrogênio ($N₂$) é o reagente limitante, rendendo 4 mols de amônia.",
          "O hidrogênio ($H₂$) é o reagente limitante, rendendo 8 mols de amônia.",
          "Não há reagentes em excesso, rendendo 14 mols de amônia.",
          "O nitrogênio ($N₂$) é o reagente limitante, rendendo 8 mols de amônia.",
          "O hidrogênio ($H₂$) é o reagente em excesso, mas restabelece o equilíbrio produzindo 6 mols de amônia."
        ],
        correctAnswer: 0,
        explanation: "Pelo balanço estequiométrico, $1 mol$ de $N₂$ requer $3 mol$ de $H₂$. Logo, para consumir totalmente $2 mol$ de $N₂$, seriam necessários apenas $6 mol$ de $H₂$ ($2 · 3$). Como temos $12 mol$ de $H₂$, esse gás está em excesso e o $N₂$ é o limitante, delimitando rigidamente a geração de amônia: $2 mol$ de $N₂$ produzem $4 mol$ de $NH₃$.",
        hint: "Compare a proporção original de 1 para 3 com o que foi fornecido pelo enunciado.",
        imageSearchTerm: "haber bosch ammonia synthesis reactor cycle",
        source: "Tipo UNICAMP"
      },
      {
        id: "q_qm_5",
        question: "Na metalurgia do ferro, o óxido de ferro (III) reage com monóxido de carbono redutor gerando metal fundido: $Fe₂O₃ + 3 CO → 2 Fe + 3 CO₂$. Ao carregar $160 kg$ de $Fe₂O₃$ puro e prever extração teórica de ferro metálico, a pesagem real ao final apontou apenas $84 kg$ de metal puro devido a entupimento de dutos. Qual o rendimento químico real deste processo? (Massas molares de $Fe₂O₃ = 160 g/mol$ e $Fe = 56 g/mol$)",
        options: [
          "52%",
          "75%",
          "80%",
          "100%",
          "90%"
        ],
        correctAnswer: 1,
        explanation: "Pela estequiometria balanceada: $160 g$ (ou $160 kg$) de $Fe₂O₃$ geram teoricamente $2 mol$ de $Fe$, o que equivale a $112 g$ (ou $112 kg$) de ferro puro. No entanto, o processo rendeu concretamente apenas $84 kg$. O rendimento percentual é calculado por: $R = 84 / 112 · 100 = 75\\%$.",
        hint: "Equacione o total teórico esperado (112kg para 100%) em oposição às perdas na metalurgia prática (84kg).",
        imageSearchTerm: "molten pig iron flowing blast furnace metallurgy",
        source: "Tipo ENEM"
      },
      {
        id: "q_qm_6",
        question: "O airbag automotivo infla em frações de segundo por causa da decomposição térmica de azida de sódio ($NaN₃$), que desencadeia uma violenta liberação de gás nitrogênio puro ($N₂$): $2 NaN₃(s) → 2 Na(s) + 3 N₂(g)$. Qual é o volume aproximado de gás nitrogênio liberado nas CNTP quando reagem completamente $130 g$ de azida de sódio? (Massa molar da azida $NaN₃ = 65 g/mol$, Volume Molar nas CNTP = $22,4 L/mol$)",
        options: [
          "22,4 L",
          "44,8 L",
          "67,2 L",
          "11,2 L",
          "65 L"
        ],
        correctAnswer: 2,
        explanation: "Mols de $NaN₃ = 130 g / 65 g/mol = 2 mol$. Pela proporção direta da equação química balanceada: $2 mol$ de $NaN₃(s)$ liberam $3 mol$ de $N₂(g)$. Sabemos que o volume molar gasoso ideal de cada mol nas CNTP é de $22,4 L$. Portanto, para $3 mol$ liberados de gás, teremos: $3 · 22,4 L/mol = 67,2 L$.",
        hint: "Primeiro encontre que 130g de azida equivalem exatamente a 2 mols. Olhe a relação da estequiometria direta para o balão inflável.",
        imageSearchTerm: "automotive airbag inflation safety mechanism crash test",
        source: "Tipo ENEM"
      },
      {
        id: "q_qm_7",
        question: "Um automóvel inovador consome etanol líquido ($C₂H₅OH$) de densidade d = $0,8 g/mL$. Se queimarmos em reação de combustão completa ($C₂H₅OH + 3 O₂ → 2 CO₂ + 3 H₂O$) uma amostra contendo exatamente $115 mL$ do combustível, qual o número de mols de gás oxigênio ($O₂$) necessário para consumir plenamente essa cota? (Dica: utilize a densidade e massa molar do álcool de $46 g/mol$)",
        options: [
          "2 mols",
          "4 mols",
          "6 mols",
          "5 mols",
          "3 mols"
        ],
        correctAnswer: 2,
        explanation: "1) Encontrar a massa correspondente de álcool usando a densidade fornecida: $m = d · V = 0,8 g/mL · 115 mL = 92 g$ de etanol líquido. 2) Calcular o número de mols contido nessa massa: $n = 92 g / 46 g/mol = 2 mols$ de etanol. 3) Pela proporção da queima balanceada da combustão, cada $1 mol$ de combustível demanda $3 mols$ de oxigênio gasoso. Logo, para consumir os $2 mols$, demandamos: $2 · 3 = 6 mols$ de $O₂$.",
        hint: "Primeiro relacione densidade e volume para pesagem em gramas. Depois divida por 46 para achar os mols do reagente principal.",
        imageSearchTerm: "bioethanol combustion green energy car engine cylinder",
        source: "Tipo UNESP"
      },
      {
        id: "q_qm_8",
        question: "Durante um experimento de laboratório de Química Geral, adiciona-se zinco particulado a uma solução aquosa concentrada de ácido clorídrico ($HCl$) em excesso, liberando cloreto de zinco e gás hidrogênio espontaneamente: $Zn(s) + 2 HCl(aq) → ZnCl₂(aq) + H₂(g)$. Sabendo que $130 g$ de Zinco metálico com pureza de $50\\%$ reagem, qual é a massa teórica de $ZnCl₂$ sintetizada ao final? (Massa molar de $Zn = 65 g/mol$, de $ZnCl₂ = 136 g/mol$)",
        options: [
          "136 g",
          "272 g",
          "68 g",
          "130 g",
          "100 g"
        ],
        correctAnswer: 2,
        explanation: "1) Aplicar a pureza de 50% sobre os 130g de Zn total: apenas $65 g$ de Zn puro efetivamente reagirão. 2) Sabendo que $65 g$ de Zn equivale exatamente a $1 mol$ ($Massa molar = 65 g/mol$). 3) Pelo balanceamento industrial estequiométrico, $1 mol$ de Zn metálico produz exatamente $1 mol$ de sal ($ZnCl₂$). A massa contada de $1 mol$ de cloreto de zinco é de $136 g$. Portanto, a massa teórica é de 136g do sal.",
        hint: "Metade de 130g é 65g, que coincide com a massa de um mol de Zinco do laboratório comercial.",
        imageSearchTerm: "zinc plates dissolving in hydrochloric acid transparent beaker",
        source: "Tipo ENEM"
      },
      {
        id: "q_qm_9",
        question: "As chamadas 'Leis Ponderais' da química clássica moldaram o entendimento atomista moderno e os cálculos de conversão. Quem é o cientista consagrado que postulou a 'Lei das Proporções Definidas', a qual prevê que os elementos constituintes de um composto químico estão restritos a razões massivas constantes?",
        options: [
          "Antoine Lavoisier",
          "Amedeo Avogadro",
          "Joseph Proust",
          "John Dalton",
          "Dmitri Mendeleev"
        ],
        correctAnswer: 2,
        explanation: "Joseph Louis Proust estabeleceu a consagrada Lei das Proporções Definidas no século XVIII, provando experimentalmente que a composição de uma substância composta pura é invariável e suas massas de componentes reagem seguindo frações fixas constantes.",
        hint: "É a lei que complementa a de Lavoisier nos cadernos de pesagem experimental clássica.",
        imageSearchTerm: "proust classic chemistry laboratory scales equipment portrait",
        source: "Tipo FUVEST"
      },
      {
        id: "q_qm_10",
        question: "Nas CNTP (0 °C, 1 atm), qual o volume total bruto ocupado por um balão flexível de borracha que contém exatamente $11 g$ de gás carbônico gaseificado ($CO₂$)? (Massas molares: $C = 12$, $O = 16$; volume molar gasoso ideal = $22,4 L/mol$)",
        options: [
          "22,4 L",
          "5,6 L",
          "11,2 L",
          "44 L",
          "8,8 L"
        ],
        correctAnswer: 1,
        explanation: "A massa molar de $CO₂$ é dada por: $12 + (16 · 2) = 44 g/mol$. Calculamos o número de mols contido na amostra do balão inflado: $n = 11 g / 44 g/mol = 0,25 mol$. Multiplicando pelo volume estipulado ideal nas CNTP de $22,4 L$, temos: $V = 0,25 mol · 22,4 L/mol = 5,6 L$.",
        hint: "Encontre que 11g de gás formam 1/4 (0,25) de um mol completo. Calcule a quarta parte do volume padrão.",
        imageSearchTerm: "green flexible rubber balloon volume gas measurement lab",
        source: "Tipo ENEM"
      }
    ]
  },
  mecanica: {
    subject: "Física: Mecânica e Cinemática",
    isOfflineFallback: true,
    flashcards: [
      {
        id: "fc_mec_1",
        front: "O que caracteriza o Movimento Retilíneo Uniforme (MRU)?",
        back: "No MRU, a trajetória é uma reta e a velocidade é constante e diferente de zero. A aceleração é nula ($a = 0$). A equação horária de posição é descrita por: $S = S₀ + v · t$.",
        imageSearchTerm: "constant velocity car moving straight road vector infographic"
      },
      {
        id: "fc_mec_2",
        front: "O que caracteriza o Movimento Retilíneo Uniformemente Variado (MRUV)?",
        back: "A velocidade varia de forma uniforme com o tempo devido a uma aceleração constante diferente de zero ($a = $ cte). Equações: $v = v₀ + a · t$ e $S = S₀ + v₀ · t + (a · t²) / 2$.",
        imageSearchTerm: "motorcycle accelerating constantly speedometer increasing"
      },
      {
        id: "fc_mec_3",
        front: "Qual é a Equação de Torricelli e quando ela deve ser empregada?",
        back: "A fórmula é: $v² = v₀² + 2 · a · ΔS$. Deve ser empregada sempre que o problema não fornecer nem solicitar o intervalo de tempo ($t$) de movimento.",
        imageSearchTerm: "car braking sharply distance measurement skid marks"
      },
      {
        id: "fc_mec_4",
        front: "Qual a diferença conceitual entre Velocidade Média e Instantânea?",
        back: "Velocidade Média avalia a distância global dividida pelo tempo decorrido ($v_m = ΔS / Δt$). Velocidade Instantânea é o valor medido em um exato milionésimo de segundo pelo velocímetro.",
        imageSearchTerm: "speedometer needle high precision dashboard screen"
      },
      {
        id: "fc_mec_5",
        front: "Como interpretar os gráficos de Posição ($S × t$) no MRU e MRUV?",
        back: "No MRU: o gráfico forma uma reta inclinada cuja tangente fornece a velocidade. No MRUV: o gráfico forma uma parábola cuja concavidade indica a aceleração (concava para cima = aceleração positiva).",
        imageSearchTerm: "parabola and linear position time graphs dashboard"
      },
      {
        id: "fc_mec_6",
        front: "Qual propriedade gráfica possui a área sob a curva no diagrama de Velocidade ($v × t$)?",
        back: "A área geométrica delimitada sob o gráfico de velocidade versus o tempo decorrido é numericamente idêntica ao deslocamento espacial realizado pelo móvel ($Area \approx ΔS$).",
        imageSearchTerm: "integral area under curve velocity time graph diagram"
      }
    ],
    quiz: [
      {
        id: "q_mec_1",
        question: "Um carro trafega por uma estrada retilínea com velocidade constante de $72 km/h$. Qual a distância percorrida por esse veículo em metros ao final de 10 minutos?",
        options: [
          "720 m",
          "12000 m",
          "7200 m",
          "43200 m",
          "1200 m"
        ],
        correctAnswer: 1,
        explanation: "Primeiro convertemos a velocidade para o SI: $72 km/h = 72 / 3,6 = 20 m/s$. O tempo gasto é de 10 minutos, o que equivale a $10 · 60 = 600 s$. Aplicando a equação de distância do MRU: $d = v · t = 20 m/s · 600 s = 12000 m$.",
        hint: "Não esqueça de converter a cota de 72 km/h para metros por segundo dividindo por 3,6 e o tempo para segundos.",
        imageSearchTerm: "straight highway road speedometer 72 kilometers per hour",
        source: "Tipo ENEM"
      },
      {
        id: "q_mec_2",
        question: "Um ciclista desloca-se em Movimento Retilíneo Uniforme (MRU) obedecendo à seguinte função horária da posição: $S = -20 + 5 · t$ (com unidades adotadas no SI). Qual a posição espacial do ciclista no exato instante $t = 8 s$?",
        options: [
          "40 m",
          "20 m",
          "0 m",
          "5 m",
          "10 m"
        ],
        correctAnswer: 1,
        explanation: "Substituindo o instante de tempo de $t = 8 s$ direto na função horária dada pelo enunciado, temos: $S(8) = -20 + 5 · 8 = -20 + 40 = 20 m$.",
        hint: "Apenas insira o valor 8 no termo de tempo t e resolva a operação de multiplicação primeiro.",
        imageSearchTerm: "cyclist on road cycling track measuring distance meter",
        source: "Tipo ENEM"
      },
      {
        id: "q_mec_3",
        question: "Partindo do repouso, uma motocicleta de teste acelera de forma constante à razão de $3 m/s²$ ao longo de uma pista reta. Qual será a sua velocidade escalar instantânea após transcorrer um tempo de $6 s$ de aceleração?",
        options: [
          "18 m/s",
          "2 m/s",
          "9 m/s",
          "12 m/s",
          "36 m/s"
        ],
        correctAnswer: 0,
        explanation: "Partindo do repouso, a velocidade inicial é zero ($v_0 = 0$). Pela equação de velocidade do MRUV: $v = v_0 + a · t = 0 + 3 · 6 = 18 m/s$.",
        hint: "Utilize a clássica equação horária da velocidade: v vovó ainda tenta ($v = v_0 + a · t$).",
        imageSearchTerm: "sport motorcycle cockpit view fast acceleration",
        source: "Tipo FUVEST"
      },
      {
        id: "q_mec_4",
        question: "Um atleta de elite inicia uma corrida em pista sob velocidade de $2 m/s$ e acelera de modo constante à razão de $1,5 m/s²$ durante $4 s$. Qual a distância total percorrida pelo corredor nesse intervalo de aceleração?",
        options: [
          "14 m",
          "8 m",
          "12 m",
          "20 m",
          "10 m"
        ],
        correctAnswer: 3,
        explanation: "A distância percorrida no MRUV é dada pela equação da posição: $ΔS = v_0 · t + (a · t²) / 2$. Substituindo os valores conhecidos do atleta: $ΔS = 2 · 4 + (1,5 · 4²) / 2 = 8 + (1,5 · 16) / 2 = 8 + 12 = 20 m$.",
        hint: "Lembre-se da equação de deslocamento do MRUV. O termo quadrático do tempo é crucial para a distância proporcional.",
        imageSearchTerm: "runner starting block track field training",
        source: "Tipo UNICAMP"
      },
      {
        id: "q_mec_5",
        question: "Uma composição ferroviária de carga de $100 m$ de comprimento total trafega com velocidade retilínea constante de $15 m/s$. Quanto tempo ela gasta para atravessar completamente uma ponte linear de $50 m$ de extensão?",
        options: [
          "10 s",
          "6,67 s",
          "3,33 s",
          "5 s",
          "15 s"
        ],
        correctAnswer: 0,
        explanation: "Para atravessar a ponte em sua totalidade, a traseira do trem deve passar o ponto final da ponte. Logo, o deslocamento total necessário é o comprimento do trem somado à extensão da ponte: $S = 100 m + 50 m = 150 m$. Com $v = 15 m/s$ constante no MRU: $t = S / v = 150 / 15 = 10 s$.",
        hint: "Pense que o trem precisa cobrir o seu próprio comprimento além da extensão total do duto da ponte.",
        imageSearchTerm: "cargo train crossing steel truss railway bridge",
        source: "Tipo ENEM"
      },
      {
        id: "q_mec_6",
        question: "Um automóvel avista um obstáculo à sua frente e aciona de imediato os freios, gerando desaceleração uniforme de $-5 m/s²$ até a parada completa. Sabendo que sua velocidade inicial no momento exato do impacto visual era de $20 m/s$ ($72 km/h$), qual a distância em metros percorrida pelo veículo durante o ato da frenagem?",
        options: [
          "40 m",
          "10 m",
          "20 m",
          "8 m",
          "50 m"
        ],
        correctAnswer: 0,
        explanation: "Como o tempo não foi fornecido pelo enunciado, aplicamos a clássica Equação de Torricelli: $v² = v₀² + 2 · a · ΔS$. No momento da parada a velocidade final é nula ($v = 0$). Substituindo os termos: $0 = 20² + 2 · (-5) · ΔS → 0 = 400 - 10 · ΔS → 10 · ΔS = 400 → ΔS = 40 m$.",
        hint: "O tempo não é fornecido e nem solicitado pela questão. É um sinal de que a equação clássica de Torricelli ajudará diretamente.",
        imageSearchTerm: "car braking dry asphalt street emergency stop",
        source: "Tipo ENEM"
      },
      {
        id: "q_mec_7",
        question: "O velocímetro de monitoramento orbital de um ônibus espacial indica o expressivo valor de $32400 km/h$ na órbita de aproximação terrestre. Em termos de unidades padrão recomendadas pelo Sistema Internacional (SI), essa velocidade escalar equivale a quanto?",
        options: [
          "9000 m/s",
          "32400 m/s",
          "90 m/s",
          "324 m/s",
          "1000 m/s"
        ],
        correctAnswer: 0,
        explanation: "A conversão padrão internacional de quilômetros por hora ($km/h$) para metros por segundo ($m/s$) consiste em realizar a divisão simples da velocidade pelo fator numérico de $3,6$. Efetuando a conta fornecida: $32400 / 3,6 = 9000 m/s$.",
        hint: "Divida a velocidade escalar fornecida pelo fator de conversão de unidades que vale exatamente 3,6.",
        imageSearchTerm: "space shuttle orbiting blue planet earth",
        source: "Tipo UNESP"
      },
      {
        id: "q_mec_8",
        question: "Um carro trafega a estáveis $30 m/s$ de velocidade em uma avenida quando aciona o freio, gerando desaceleração contínua e equilibrada até atingir a imobilidade completa, levando exatamente $5 s$. Qual foi o valor absoluto da aceleração e do retardamento imposto aos freios do veículo?",
        options: [
          "150 m/s²",
          "6 m/s²",
          "5 m/s²",
          "10 m/s²",
          "12 m/s²"
        ],
        correctAnswer: 1,
        explanation: "A variação de velocidade é dada por: $Δv = v - v_0 = 0 - 30 = -30 m/s$. Aplicando o conceito fundamental da taxa de aceleração no tempo: $a = Δv / Δt = -30 / 5 = -6 m/s²$. O valor em módulo absoluto para a desaceleração resultante é de $6 m/s²$.",
        hint: "A aceleração mede de quanto em quanto a velocidade variou a cada segundo decorrido no ato da desaceleração.",
        imageSearchTerm: "dashboard clock telemetry speedometer stop brakes",
        source: "Tipo ENEM"
      },
      {
        id: "q_mec_9",
        question: "Ao estudar o diagrama de Posição versus Tempo ($S × t$) de uma partícula móvel em testes laboratoriais, um estudante registra que o gráfico traçado é representado por uma reta horizontal de inclinação nula paralela ao eixo cronológico das abscissas. O que se deduz fisicamente sobre o estado de movimento dessa partícula?",
        options: [
          "Sua velocidade é constante e diferente de zero.",
          "A partícula está sob aceleração máxima e positiva.",
          "A partícula está estacionária em repouso absoluto.",
          "O movimento descrito é circular uniforme acelerado.",
          "A aceleração é parabólica e constante."
        ],
        correctAnswer: 2,
        explanation: "Uma linha horizontal paralela ao eixo do tempo indica que, à medida que os segundos avançam, a coordenada de posição ($S$) da partícula permanece fixa e inalterada no mesmo valor. Portanto, a partícula está parada, ou seja, em repouso estático.",
        hint: "Se a posição espacial monitorada não sobe e nem desce com o passar do relógio, o corpo está...",
        imageSearchTerm: "laboratory student plotting scientific data flat graph",
        source: "Tipo FUVEST"
      },
      {
        id: "q_mec_10",
        question: "Um projétil é disparado verticalmente para cima a partir do solo com velocidade escalar de $50 m/s$. Desprezando perdas por atrito do ar e considerando aceleração da gravidade local constante $g = 10 m/s²$, qual a altura máxima atingida pelo objeto?",
        options: [
          "125 m",
          "500 m",
          "250 m",
          "50 m",
          "100 m"
        ],
        correctAnswer: 0,
        explanation: "No ponto culminante de altura máxima (ponto de inversão), a velocidade do projétil é zero ($v = 0$). Aplicando a Equação de Torricelli adaptada para gravidade: $v² = v_0² - 2 · g · h_{max} → 0 = 50² - 2 · 10 · h_{max} → 0 = 2500 - 20 · h_{max} → 20 · h_{max} = 2500 → h_{max} = 125 m$.",
        hint: "Equacione o instante de inversão de sentido no pico máximo onde a velocidade momentaneamente zera. Use Torricelli.",
        imageSearchTerm: "vertical rocket launch projectile high altitude peak",
        source: "Tipo ENEM"
      }
    ]
  },
  energia_mecanica: {
    subject: "Física: Trabalho e Energia Mecânica",
    isOfflineFallback: true,
    flashcards: [
      {
        id: "fc_en_1",
        front: "O que define a Energia Cinética ($E_c$) e qual sua fórmula?",
        back: "É a energia associada ao estado de movimento de um corpo. Calculada por: $E_c = \\frac{m · v²}{2}$, onde $m$ é a massa em kg e $v$ é a velocidade em m/s. Unidade no SI: Joule ($J$).",
        imageSearchTerm: "kinetic energy motion sports fast runner"
      },
      {
        id: "fc_en_2",
        front: "O que é Trabalho ($W$) de uma força constante?",
        back: "É a medida da energia transferida por uma força a um objeto ao longo de um deslocamento. Calculado por: $W = F · d · cos(θ)$, onde $θ$ é o ângulo entre a linha da força e a direção do movimento.",
        imageSearchTerm: "work force pulling weight displacement angle"
      },
      {
        id: "fc_en_3",
        front: "Como se define a Energia Potencial Gravitacional ($E_{pg}$)?",
        back: "É a energia armazenada devido à posição de altura de um corpo em relação a uma referência em um campo gravitacional estável. Fórmula clássica: $E_{pg} = m · g · h$.",
        imageSearchTerm: "gravitational potential energy heavy boulder on cliff edge"
      },
      {
        id: "fc_en_4",
        front: "Qual o conceito de Energia Potencial Elástica ($E_{pe}$)?",
        back: "É a energia armazenada em um material ou elemento perfeitamente elástico (como uma mola comprimida/esticada) deformado por uma distância $x$. Equação matemática: $E_{pe} = \\frac{k · x²}{2}$.",
        imageSearchTerm: "coiled metal spring compressed potential energy elastic"
      },
      {
        id: "fc_en_5",
        front: "O que afirma o Princípio da Conservação de Energia Mecânica?",
        back: "Em sistemas conservativos (onde atuam apenas forças conservativas, sem atritos ou perdas térmicas), a Energia Mecânica total ($E_m = E_c + E_p$) permanece absolutamente constante ao longo de todo o tempo.",
        imageSearchTerm: "roller coaster loop conversion potential kinetic energy physics"
      },
      {
        id: "fc_en_6",
        front: "O que mede a Potência Mecânica ($P$) e qual sua relação com velocidade?",
        back: "Mede o quão rápido um determinado trabalho é executado: $P = \\frac{W}{\\Delta t}$. Para forças constantes no sentido do movimento espacial, pode ser deduzida como: $P = F · v$. Unidade no SI: Watt ($W = J/s$).",
        imageSearchTerm: "fast powerful engine industrial turbine power measurement watt"
      }
    ],
    quiz: [
      {
        id: "q_en_1",
        question: "Um bloco de cimento de massa $5 kg$ é arrastado horizontalmente por uma força constante de $20 N$ paralela ao sentido do deslocamento por uma distância total de $8 m$. Qual o trabalho líquido realizado por essa força sobre o bloco?",
        options: [
          "40 J",
          "160 J",
          "100 J",
          "80 J",
          "200 J"
        ],
        correctAnswer: 1,
        explanation: "Pela definição clássica de trabalho mecânico linear: $W = F · d · cos(θ)$. Como a força age paralela e no mesmo sentido do movimento horizontal, o ângulo é zero e $cos(0°) = 1$. Portanto, $W = 20 N · 8 m · 1 = 160 J$.",
        hint: "A força atua de forma direta no sentido do movimento espacial. Realize a multiplicação direta entre a força e o deslocamento.",
        imageSearchTerm: "worker pulling heavy block concrete rope floor",
        source: "Tipo ENEM"
      },
      {
        id: "q_en_2",
        question: "Um atleta olímpico com massa total estável de $80 kg$ corre pela pista reta com uma velocidade escalar constante de $5 m/s$. Qual a energia cinética total associada ao seu movimento corporal?",
        options: [
          "200 J",
          "400 J",
          "1000 J",
          "2000 J",
          "4000 J"
        ],
        correctAnswer: 2,
        explanation: "A energia de movimento cinética é dada pela fórmula fundamental da cinemática de massas: $E_c = \\frac{m · v²}{2}$. Substituindo os valores conhecidos do atleta: $E_c = \\frac{80 · 5²}{2} = 40 · 25 = 1000 J$.",
        hint: "Primeiro eleve o valor da velocidade escalar ao quadrado antes de multiplicar pela massa do corredor.",
        imageSearchTerm: "sprinter running fast speed race track",
        source: "Tipo ENEM"
      },
      {
        id: "q_en_3",
        question: "Uma pesada caixa de ferramentas com massa de $10 kg$ é elevada verticalmente à mão de forma lenta e regular até uma prateleira a uma altura de $6 m$ do solo. Sendo $g = 10 m/s²$, qual a variação absoluta da energia potencial gravitacional da caixa?",
        options: [
          "60 J",
          "100 J",
          "600 J",
          "300 J",
          "1200 J"
        ],
        correctAnswer: 2,
        explanation: "A energia potencial gravitacional que se acumula no topo é dada pelo trabalho contra a gravidade local: $E_{pg} = m · g · h$. Efetuando o produto das grandezas: $E_{pg} = 10 · 10 · 6 = 600 J$.",
        hint: "A posição elevada armazena trabalho gravitacional proporcional à massa, aceleração local e altura.",
        imageSearchTerm: "toolbox stored on high wooden shelf warehouse",
        source: "Tipo ENEM"
      },
      {
        id: "q_en_4",
        question: "Um fruto maduro de massa de $0,2 kg$ despenca livremente de uma alta goiabeira a partir do repouso de uma altura inicial de $5 m$. Desprezando qualquer consideração de perdas térmicas ou resistência do ar, e adotando $g = 10 m/s²$, qual a velocidade aproximada do objeto ao atingir o solo?",
        options: [
          "5 m/s",
          "10 m/s",
          "15 m/s",
          "20 m/s",
          "2 m/s"
        ],
        correctAnswer: 1,
        explanation: "Pela conservação absoluta da energia mecânica em queda livre pura, a energia potencial do topo é inteiramente convertida em energia cinética na base: $m · g · h = \\frac{m · v²}{2}$. Simplificando as massas: $g · h = \\frac{v²}{2} \\implies v = \\sqrt{2 · g · h}$. Calculando com os valores fornecidos: $v = \\sqrt{2 · 10 · 5} = \\sqrt{100} = 10 m/s$.",
        hint: "Pense na equivalência de energia conservativa. Use a clássica relação direta onde a velocidade de impacto de queda livre depende de $\sqrt{2 · g · h}$.",
        imageSearchTerm: "apple fruit falling down tree branch under gravity",
        source: "Tipo FUVEST"
      },
      {
        id: "q_en_5",
        question: "Um moderno elevador elétrico predial consome energia realizando trabalho mecânico bruto estimado em $12000 J$ no decorrer de um intervalo cronológico de exatos $1 minuto$. Qual a potência média útil dissipada por esse elevador?",
        options: [
          "12000 W",
          "120 W",
          "200 W",
          "2000 W",
          "600 W"
        ],
        correctAnswer: 2,
        explanation: "Antes de aplicar a fórmula de taxa temporal, devemos converter o termo cronológico fornecido para o padrão oficial do SI: $1 min = 60 s$. A potência útil média é definida por: $P = \\frac{W}{\\Delta t} = \\frac{12000 J}{60 s} = 200 W$.",
        hint: "A unidade Watts corresponde a Joules por segundo. Converta o valor de minutos para segundos antes da divisão.",
        imageSearchTerm: "freight elevator hoisting system cables",
        source: "Tipo UNICAMP"
      },
      {
        id: "q_en_6",
        question: "Uma mola helicoidal de aço de constante elástica calibrada em $k = 400 N/m$ é esmagada linearmente por uma cota física decimal de $0,2 m$. Qual a energia potencial elástica acumulada nessa mola devido ao esforço de compressão?",
        options: [
          "8 J",
          "16 J",
          "40 J",
          "80 J",
          "4 J"
        ],
        correctAnswer: 0,
        explanation: "A lei clássica para armazenamento elétrico armazena potencial de molas segundo: $E_{pe} = \\frac{k · x²}{2}$. Resolvendo a equação com as grandezas numéricas do problema: $E_{pe} = \\frac{400 · (0,2)²}{2} = 200 · 0,04 = 8 J$.",
        hint: "Cuidado: elabore a conta multiplicando a mola deformada ao quadrado ($0,2 · 0,2 = 0,04$) pelas forças elásticas normais.",
        imageSearchTerm: "heavy steel spring tightly compressed mechanical part",
        source: "Tipo ENEM"
      },
      {
        id: "q_en_7",
        question: "Um carro compacto híbrido de massa total de $1000 kg$ acelera estavelmente de $10 m/s$ para uma velocidade de $20 m/s$ sob pista reta plana. Qual o trabalho global resultante exigido do motor elétrico para propiciar essa aceleração de impulso?",
        options: [
          "150000 J",
          "50000 J",
          "100000 J",
          "200000 J",
          "300000 J"
        ],
        correctAnswer: 0,
        explanation: "Utilizamos o Teorema do Trabalho e Energia Cinética ($W = \\Delta E_c$), no qual o trabalho das forças resultantes é numericamente igual à expansão de movimento: $W = E_{cf} - E_{ci} = \\frac{m · v_f²}{2} - \\frac{m · v_i²}{2}$. Substituindo: $W = \\frac{1000 · 20²}{2} - \\frac{1000 · 10²}{2} = 500 · 400 - 500 · 100 = 200000 - 50000 = 150000 J$.",
        hint: "O trabalho motor é a diferença direta entre as energias cinéticas finais e iniciais do automóvel.",
        imageSearchTerm: "electric vehicle wheels spinning acceleration",
        source: "Tipo ENEM"
      },
      {
        id: "q_en_8",
        question: "Um mergulhador saltador de massa de $70 kg$ salta de um trampolim fixo posicionado a uma altura vertical de $10 m$ em direção ao espelho de água. Qual o trabalho útil específico realizado pela força peso durante a descida total até o impacto aquático? (Considere a gravidade constante $g = 10 m/s²$)",
        options: [
          "7000 J",
          "-7000 J",
          "700 J",
          "3500 J",
          "0 J"
        ],
        correctAnswer: 0,
        explanation: "Sendo o movimento de descida, a gravidade age diretamente a favor do deslocamento vertical, resultando em um trabalho motor positivo útil: $W_P = + m · g · h$. Substituindo os dados: $W_P = 70 kg · 10 m/s² · 10 m = 7000 J$.",
        hint: "Como o mergulhador cai no sentido favorável do campo gravitacional, o trabalho acumulado peso deve ser estritamente positivo.",
        imageSearchTerm: "high diver athlete mid-air jumping down platform",
        source: "Tipo ENEM"
      },
      {
        id: "q_en_9",
        question: "Um destemido jovem com seu skate desliza e entra em uma rampa semicircular de $1,0 m$ de desnível vertical de altura com velocidade inicial de rampa de $4 m/s$. Desconsiderando possíveis perdas térmicas ou atritos da roda, e adotando $g = 10 m/s²$, qual será o valor de sua velocidade na base mais baixa da rampa?",
        options: [
          "6 m/s",
          "8 m/s",
          "5,2 m/s",
          "4,5 m/s",
          "32 m/s"
        ],
        correctAnswer: 0,
        explanation: "Pela lei de conservação estrita: $E_{m, base} = E_{m, topo} \\implies E_{c, base} = E_{c, topo} + E_{pg, topo} \\implies \\frac{m · v_{base}²}{2} = \\frac{m · v_{topo}²}{2} + m · g · h$. Cancelando a massa: \\frac{v_{base}²}{2} = \\frac{4²}{2} + 10 · 1 \\implies \\frac{v_{base}²}{2} = 8 + 10 = 18 \\implies v_{base}² = 36 \\implies v_{base} = 6 m/s$.",
        hint: "A velocidade na base depende da soma da velocidade inicial com a aceleração ganha na queda por gravidade.",
        imageSearchTerm: "skateboarder trick down curved pipe ramp",
        source: "Tipo UNESP"
      },
      {
        id: "q_en_10",
        question: "Um bloco de metal de $2 kg$ desliza sobre piso horizontal de asfalto sob velocidade inicial de $10 m/s$. Sob ação exclusiva da força de atrito dinâmico reverso, o bloco diminui seu movimento até estacionar em repouso absoluto. Qual o trabalho negativo imposto pelo atrito dinâmico?",
        options: [
          "-100 J",
          "-200 J",
          "100 J",
          "50 J",
          "-50 J"
        ],
        correctAnswer: 0,
        explanation: "O trabalho da resultante dissipadora é igual à redução de sua energia de movimento: $W_{atrito} = \\Delta E_c = E_{c,final} - E_{c,inicial}$. Como o bloco para no fim, $E_{cf} = 0$. Logo, $W_{atrito} = 0 - \\frac{2 · 10²}{2} = -100 J$. O valor negativo denota que o sistema retira energia em forma de calor disperso.",
        hint: "Como o atrito atua de forma opositora ao sentido do deslocamento, ele obrigatoriamente produz um trabalho resistente e negativo.",
        imageSearchTerm: "sliding blocks sliding friction stop rough paper",
        source: "Tipo ENEM"
      }
    ]
  },
  geometria: {
    subject: "Matemática: Geometria",
    isOfflineFallback: true,
    flashcards: [
      {
        id: "fc_geo_1",
        front: "Qual é a fórmula da Área de um Círculo e o significado de seus termos?",
        back: "A área de um círculo é dada por $A = \\pi · r²$, onde $\\pi$ (Pi) é aproximadamente $3,1416$ e $r$ é o raio (distância do centro à extremidade).",
        imageSearchTerm: "circle geometry radius area diagram"
      },
      {
        id: "fc_geo_2",
        front: "O que estabelece o Teorema de Pitágoras?",
        back: "Em qualquer triângulo retângulo, a soma dos quadrados dos catetos é igual ao quadrado da hipotenusa: $a² + b² = c²$, onde $c$ é o lado oposto ao ângulo reto.",
        imageSearchTerm: "right triangle pythagorean theorem hypotenuse"
      },
      {
        id: "fc_geo_3",
        front: "Como se calcula a Área de um Triângulo qualquer?",
        back: "A área básica de um triângulo é calculada por $A = \\frac{b · h}{2}$, multiplicando a base ($b$) pela altura ($h$) e dividindo o resultado por dois.",
        imageSearchTerm: "triangle base height measurement geometry"
      },
      {
        id: "fc_geo_4",
        front: "Qual é a fórmula do Volume de um Cilindro?",
        back: "O volume de um cilindro é calculado multiplicando a área da base circular pela altura: $V = \\pi · r² · h$.",
        imageSearchTerm: "cylinder volume base area height 3d geometry"
      },
      {
        id: "fc_geo_5",
        front: "Como calcular a Soma dos Ângulos Internos de um polígono convexo de $n$ lados?",
        back: "A soma dos ângulos internos de um polígono de $n$ lados é dada pela fórmula: $S = (n - 2) · 180°$. Para um triângulo ($n=3$) é $180°$, e para um quadrilátero ($n=4$) é $360°$.",
        imageSearchTerm: "convex polygon interior angles geometry"
      },
      {
        id: "fc_geo_6",
        front: "Qual é a diferença entre Relações Métricas e Trigonométricas no triângulo retângulo?",
        back: "Relações Métricas envolvem projeções e lados (ex: $h² = m · n$). Relações Trigonométricas envolvem ângulos agudos e razões de lados: Seno (cateto oposto/hipotenusa), Cosseno (cateto adjacente/hipotenusa) e Tangente (cateto oposto/cateto adjacente).",
        imageSearchTerm: "trigonometry ratios sine cosine tangent triangle"
      }
    ],
    quiz: [
      {
        id: "q_geo_1",
        question: "Uma piscina redonda infantil possui raio igual a $3 m$. Desejando-se cobrir o fundo da piscina com uma lona, qual deve ser a área aproximada dessa lona? (Considere $\\pi = 3,14$)",
        options: [
          "9,42 m²",
          "28,26 m²",
          "18,84 m²",
          "56,52 m²",
          "14,13 m²"
        ],
        correctAnswer: 1,
        explanation: "A área do fundo da piscina é a área do círculo correspondente: $A = \\pi · r²$. Substituindo os valores conhecidos: $A = 3,14 · 3² = 3,14 · 9 = 28,26 m²$.",
        hint: "Use a fórmula da área do círculo $A = \\pi · r²$ com $r = 3$ e $\\pi = 3,14$.",
        imageSearchTerm: "round kids swimming pool blue cover",
        source: "Tipo ENEM"
      },
      {
        id: "q_geo_2",
        question: "Para escorar um muro vertical de $4 m$ de altura, apoia-se uma viga de metal reta com uma extremidade no topo do muro e a outra no chão, a uma distância horizontal de $3 m$ da base do muro. Qual é o comprimento mínimo dessa viga?",
        options: [
          "5 m",
          "7 m",
          "12 m",
          "4,5 m",
          "6 m"
        ],
        correctAnswer: 0,
        explanation: "O muro vertical, o chão plano e a viga inclinada formam um triângulo retângulo perfeito. Aplicamos o Teorema de Pitágoras: $viga² = altura² + distancia² \\implies viga² = 4² + 3² = 16 + 9 = 25 \\implies viga = \\sqrt{25} = 5 m$.",
        hint: "Aplique o famoso triângulo retângulo de catetos 3 e 4. A hipotenusa será o comprimento da viga.",
        imageSearchTerm: "leaning support beam wall construction physics",
        source: "Tipo FUVEST"
      },
      {
        id: "q_geo_3",
        question: "Um terrain em formato trapezoidal possui bases medindo $12 m$ e $8 m$, e a distância perpendicular entre essas bases (altura) é de $6 m$. Qual é a área total deste terreno para fins tributários?",
        options: [
          "120 m²",
          "60 m²",
          "48 m²",
          "96 m²",
          "80 m²"
        ],
        correctAnswer: 1,
        explanation: "A área de um trapézio é dada por: $A = \\frac{(B + b) · h}{2}$. Substituindo as bases $B=12$, $b=8$ e altura $h=6$, temos: $A = \\frac{(12 + 8) · 6}{2} = \\frac{20 · 6}{2} = 60 m²$.",
        hint: "A soma das bases vezes a altura, tudo dividido por dois, dá a área exata do trapézio.",
        imageSearchTerm: "trapezoid land shape architectural plan",
        source: "Tipo ENEM"
      },
      {
        id: "q_geo_4",
        question: "Um reservatório de água tem formato cilíndrico reto, com raio da base igual a $2 m$ e altura de $5 m$. Qual é a capacidade máxima aproximada de água que esse tanque consegue armazenar em litros? (Adote $\\pi = 3,14$ e lembre que $1 m³ = 1000 litros$)",
        options: [
          "10.000 litros",
          "31.400 litros",
          "62.800 litros",
          "15.700 litros",
          "20.000 litros"
        ],
        correctAnswer: 2,
        explanation: "Primeiro calculamos o volume em metros cúbicos: $V = \\pi · r² · h = 3,14 · 2² · 5 = 3,14 · 4 · 5 = 62,8 m³$. Como $1 m³ = 1000 L$, a capacidade total é $62,8 · 1000 = 62.800 litros$.",
        hint: "Encontre o volume multiplicando a área circular da base pela altura vertical, depois converta metros cúbicos para litros.",
        imageSearchTerm: "cylindrical water storage tank big reservoir",
        source: "Tipo ENEM"
      },
      {
        id: "q_geo_5",
        question: "Deseja-se construir um canteiro regular de flores no formato de um hexágono regular convexo. Qual é a soma das medidas de todos os ângulos internos desse canteiro?",
        options: [
          "360°",
          "540°",
          "720°",
          "900°",
          "1080°"
        ],
        correctAnswer: 2,
        explanation: "A soma dos ângulos internos de um polígono de $n$ lados é dada por $S_i = (n - 2) · 180°$. Para um hexágono ($n = 6$), temos: $S_i = (6 - 2) · 180° = 4 · 180° = 720°$.",
        hint: "Substitua $n = 6$ na fórmula geral da soma dos ângulos internos dos polígonos regulares.",
        imageSearchTerm: "regular hexagon layout garden scheme",
        source: "Tipo UNESP"
      },
      {
        id: "q_geo_6",
        question: "Um arquiteto projetou uma rampa de acesso que faz um ângulo de $30°$ com o plano horizontal do chão. Se o topo da rampa está a uma altura vertical de $1,5 m$, qual deve ser a extensão linear do corrimão que acompanha toda a subida inclinada da rampa? (Dado: sen(30°) = 0,5)",
        options: [
          "3,0 m",
          "1,5 m",
          "4,5 m",
          "2,0 m",
          "2,6 m"
        ],
        correctAnswer: 0,
        explanation: "A rampa projeta um triângulo retângulo onde a hipotenusa é a rampa (e o corrimão) e a altura oposta ao ângulo de $30°$ é $1,5 m$. Usando o seno: sen(30°) = cateto_oposto / hipotenusa $\\implies$ 0,5 = 1,5 / hipotenusa $\\implies$ hipotenusa = 1,5 / 0,5 = 3,0 m.",
        hint: "O seno relaciona o cateto oposto à hipotenusa. A hipotenusa inclinada deve ser o dobro da altura oposta se o ângulo for $30°$.",
        imageSearchTerm: "wheelchair ramp incline handrail angle trigonometry",
        source: "Tipo ENEM"
      },
      {
        id: "q_geo_7",
        question: "Qual é o volume de uma pirâmide regular de base quadrada, sabendo que a aresta de sua base mede $6 m$ e sua altura é de $4 m$?",
        options: [
          "144 m³",
          "48 m³",
          "36 m³",
          "72 m³",
          "24 m³"
        ],
        correctAnswer: 1,
        explanation: "O volume de qualquer pirâmide é a terça parte da área da base multiplicada pela altura: $V = \\frac{Area\\_da\\_base · h}{3}$. A base é um quadrado de lado $6 m$, então sua área é $A_b = 6² = 36 m²$. Logo, $V = \\frac{36 · 4}{3} = 12 · 4 = 48 m³$.",
        hint: "Lembre-se que o volume de pirâmides e cones sempre é dividido por 3 em relação a prismas de mesma base e altura.",
        imageSearchTerm: "square pyramid architectural geometric rendering",
        source: "Tipo UNICAMP"
      },
      {
        id: "q_geo_8",
        question: "Uma caixa de papelão no formato de paralelepípedo retorretângulo possui as seguintes dimensões: $50 cm$ de comprimento, $30 cm$ de largura e $20 cm$ de altura. Qual é a área total de papelão necessária para confeccionar as faces externas dessa caixa fechada?",
        options: [
          "30.000 cm²",
          "6.200 cm²",
          "3.100 cm²",
          "12.400 cm²",
          "5.000 cm²"
        ],
        correctAnswer: 1,
        explanation: "A área total de um paralelepípedo de dimensões $a$, $b$ e $c$ é dada por: $A_t = 2(ab + ac + bc)$. Substituindo $a=50$, $b=30$ e $c=20$: $A_t = 2(50 · 30 + 50 · 20 + 30 · 20) = 2(1500 + 1000 + 600) = 2 · 3100 = 6200 cm²$.",
        hint: "Calcule a soma das áreas das seis faces retangulares da caixa, que são iguais duas a duas.",
        imageSearchTerm: "rectangular cardboard box unfolded flat net diagram",
        source: "Tipo ENEM"
      },
      {
        id: "q_geo_9",
        question: "Em uma circunferência de diâmetro igual a $10 cm$, inscreve-se um quadrado. Qual é o perímetro total aproximado desse quadrado?",
        options: [
          "40 cm",
          "20\\sqrt{2} cm",
          "10\\sqrt{2} cm",
          "28,28 cm",
          "B e D estão corretas"
        ],
        correctAnswer: 4,
        explanation: "A diagonal do quadrado inscrito equivale ao diâmetro da circunferência, ou seja, $d = 10 cm$. Sendo o lado do quadrado $l$, sabemos que a diagonal é $d = l\\sqrt{2} \\implies 10 = l\\sqrt{2} \\implies l = \\frac{10}{\\sqrt{2}} = 5\\sqrt{2} cm$. O perímetro do quadrado é $4 · l = 4 · 5\\sqrt{2} = 20\\sqrt{2} cm$. Numericamente, $20 · 1,414 = 28,28 cm$. Portanto, tanto a opção B ($20\\sqrt{2}$ cm) quanto a D (28,28 cm) estão corretas, tornando a alternativa E a resposta certa.",
        hint: "A diagonal do quadrado é igual ao diâmetro de 10cm. Encontre o lado e multiplique por 4 para ter o perímetro total.",
        imageSearchTerm: "square inscribed in circle diagram",
        source: "Tipo FUVEST"
      },
      {
        id: "q_geo_10",
        question: "Um cone circular reto tem altura de $12 cm$ e raio da base medindo $5 cm$. Qual é a área lateral desse cone? (Considere $\\pi = 3,14$ e lembre que a área lateral é dada por $A_l = \\pi · r · g$, onde $g$ é a geratriz)",
        options: [
          "204,1 cm²",
          "188,4 cm²",
          "94,2 cm²",
          "314,0 cm²",
          "157,0 cm²"
        ],
        correctAnswer: 0,
        explanation: "Primeiro encontramos a geratriz ($g$) usando o triângulo retângulo interno: $g² = h² + r² \\implies g² = 12² + 5² = 144 + 25 = 169 \\implies g = 13 cm$. Agora calculamos a área lateral: $A_l = \\pi · r · g = 3,14 · 5 · 13 = 3,14 · 65 = 204,1 cm²$.",
        hint: "Encontre a geratriz inclinada usando o teorema de Pitágoras com o raio de 5cm e altura de 12cm, depois aplique na fórmula da área lateral.",
        imageSearchTerm: "cone slant height geometry diagram",
        source: "Tipo ENEM"
      }
    ]
  }
};

