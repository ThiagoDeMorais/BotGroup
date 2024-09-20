const botToken = 'x';
const sheetId = 'x';
const appUrl = 'https://script.google.com/macros/s/AKfycbx_64Ql3XnZ-y6cp7z7ryfXgj0ZZ9gDVSXIQjtymPpVWnLi_Ev1OnZt-9DIzoblNa7LiA/exec';

// Função para configurar o webhook
function setWebhook() {
  const url = 'https://api.telegram.org/bot' + botToken + '/setWebhook?url=' + appUrl;
  const response = UrlFetchApp.fetch(url);
  console.log(response.getContentText());
}

// Função para tratar as mensagens recebidas
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const message = data.message || data.callback_query.message;
  const chatId = message.chat.id;
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName('Sheet1');

  if (data.callback_query) {
    handleCallbackQuery(data.callback_query);
  } else if (data.message.text) {
    const textOfMessage = (data.message.text).split("@", 1)[0];
    handleCommand(data, chatId, textOfMessage);
  }
}

// Função para lidar com os comandos
function handleCommand(data, chatId, textOfMessage) {
  if (textOfMessage == "/start") {
    sendMainMenu(chatId);
  } else {
    sendText(chatId, 'Olá, recebi sua mensagem: \n\n' + textOfMessage);
  }
}

// Função para enviar uma mensagem de texto com ou sem teclado inline
function sendText(chatId, text, keyboard = null) {
  const url = "https://api.telegram.org/bot" + botToken + "/sendMessage";
  const payload = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      chat_id: chatId,
      text: text,
      reply_markup: keyboard ? keyboard : {}
    })
  };
  UrlFetchApp.fetch(url, payload);
}

// Função para excluir uma mensagem
function deleteMessage(chatId, messageId) {
  const url = `https://api.telegram.org/bot${botToken}/deleteMessage`;
  const payload = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      chat_id: chatId,
      message_id: messageId
    })
  };
  UrlFetchApp.fetch(url, payload);
}


// Função para extrair múltiplos links e o texto associado de uma célula
function extractTextAndLinksFromCell(cell) {
  const richTextValue = cell.getRichTextValue();
  const textRuns = richTextValue.getRuns();
  let results = [];

  for (let i = 0; i < textRuns.length; i++) {
    const run = textRuns[i];
    const text = run.getText();
    const url = run.getLinkUrl();
    if (url) {
      results.push(`${text}\nLink: ${url}`);
    } else if (text != '') {
      results.push(`${text}`);
    }
  }

  return results.join('\n');
}

// Função para enviar o menu principal
function sendMainMenu(chatId) {
  const keyboard = {
    inline_keyboard: [
      [
        { text: "1 - Controle de Mordida", callback_data: 'menu_controle_mordida_1' },
        { text: "2 - Latidos e Vocalizações", callback_data: 'menu_latidos_vocalizacoes_2' }
      ],
      [
        { text: "3 - XixiCocô", callback_data: 'menu_xixicoco_3' },
        { text: "4 - Ansiedade", callback_data: 'menu_ansiedade_4' }
      ],
      [
        { text: "5 - Posse", callback_data: 'menu_posse_5' },
        { text: "6 - Passeio", callback_data: 'menu_passeio_6' }
      ],
      [
        { text: "7 - ReatividadeAgressividade", callback_data: 'menu_reatividade_7' },
        { text: "8 - Socializacao Pessoa Casa", callback_data: 'menu_socioPC_8' }
      ],
      [
        { text: "9 - Socializacao Cachorro Casa", callback_data: 'menu_socioCC_9' },
        { text: "10 - Socializacao Pessoa Rua", callback_data: 'menu_socioPR_10' }
      ],
      [
        { text: "11 - Socializacao Cachorro Rua", callback_data: 'menu_socioCR_11' }

      ],
      [
        { text: "Sair", callback_data: 'sair' }
      ]
    ]
  };

  sendText(chatId, "Menu Principal:", keyboard);
}

//------------------------------------------------------------------------------------------------------------------




// Função para lidar com as callback queries
function handleCallbackQuery(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;
  const data = callbackQuery.data;

  if (data.startsWith('menu_')) {
    deleteMessage(chatId, messageId);
    handleSubMenu(chatId, data);
  } else if (data.startsWith('element_')) {
    deleteMessage(chatId, messageId);
    handleElementSelection(chatId, data);
  } else if (data === 'sair') {
    deleteMessage(chatId, messageId);
    sendText(chatId, "Saindo do menu.");
  } else if (data === 'voltar') {
    deleteMessage(chatId, messageId);
    sendMainMenu(chatId);
  } else {
    deleteMessage(chatId, messageId)
    handleSelection(chatId, data);
  }
}

// Função para lidar com os submenus
function handleSubMenu(chatId, data) {
  let keyboard, messageText;

  // Armazena a seleção do menu
  const userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty(chatId + "_menu", data);

  switch (data) {
    case 'menu_controle_mordida_1':
      messageText = "Controle de Mordida:";
      keyboard = {
        inline_keyboard: [
          [{ text: "MÓDULO: ADESTRAMENTO HACKER | RITUAL DE INICIAÇÃO\nMÓDULO Bônus: Canse seu Cão SEM se Cansar | Exercícios Lúdicos de Estimulação Cognitiva", callback_data: 'controle_2' }, { text: "Autorregulação\nAlimentação Inteligente\nElementos Da Disciplina", callback_data: 'controle_3' }],
          [{ text: "REGULAÇÃO INTERNA\nMitos sobre Alimentação e Estratégias de Treino", callback_data: 'controle_4' }, { text: "Ciclo Circadiano e Autorregulação\nA Energia Correta Para o Comportamento Esperado", callback_data: 'controle_5' }],
          [{ text: "R+ R- P+ P- RAIZ QUADRADA DE PI\nConhecendo e Utilizando o Estímulo Discriminativo", callback_data: 'controle_6' }],
          [{ text: "Voltar", callback_data: 'voltar' }], [{ text: "Sair", callback_data: 'sair' }]
        ]
      };
      break;

case 'menu_latidos_vocalizacoes_2':
    messageText = "Latidos e Vocalizações:";
    keyboard = {
      inline_keyboard: [
        [{ text: "MÓDULO: ADESTRAMENTO HACKER | RITUAL DE INICIAÇÃO", callback_data: 'latidos_2' }],
        [{ text: "MÓDULO Bônus: Canse seu Cão SEM se Cansar | Exercícios Lúdicos de Estimulação Cognitiva", callback_data: 'latidos_3' }],
        [{ text: "Estratégia de Autorregulação Emocional e Manejo de Ambiente\nAlimentação Inteligente\nElementos da Disciplina e Limites", callback_data: 'latidos_4' }],
        [{ text: "REGULAÇÃO INTERNA\nMitos sobre Alimentação e Estratégias de Treino", callback_data: 'latidos_5' }],
        [{ text: "Ciclo Circadiano e Autorregulação\nA Energia Correta Para o Comportamento Esperado", callback_data: 'latidos_6' }],
        [{ text: "R+ R- P+ P- RAIZ QUADRADA DE PI - SEU CACHORRO ESTÁ TE TREINANDO\nConhecendo e Utilizando o Estímulo Discriminativo", callback_data: 'latidos_7' }],
        [{ text: "Voltar", callback_data: 'voltar' }, { text: "Sair", callback_data: 'sair' }]
      ]
    };
    break;


case 'menu_xixicoco_3':
    messageText = "Xixi e Cocô:";
    keyboard = {
      inline_keyboard: [
        [{ text: "MÓDULO: ADESTRAMENTO HACKER | RITUAL DE INICIAÇÃO", callback_data: 'xixicoco_2' }],
        [{ text: "Exploração Olfativa\nTapete de Forrageio\nPredação | Trouxinhas de Roupas\nElemento Surpresa - Jogo de Esconder\nLiberação com 'ok' - 'busca' - Comando VEM", callback_data: 'xixicoco_3' }],
        [{ text: "Estratégia de Autorregulação Emocional e Manejo de Ambiente\nAlimentação Inteligente\nElementos da Disciplina e Limites\nTreino da Caixa de Transporte", callback_data: 'xixicoco_4' }],
        [{ text: "REGULAÇÃO INTERNA\nMitos sobre Alimentação e Estratégias de Treino", callback_data: 'xixicoco_5' }],
        [{ text: "Ciclo Circadiano e Autorregulação\nA Energia Correta Para o Comportamento Esperado", callback_data: 'xixicoco_6' }],
        [{ text: "R+ R- P+ P- RAIZ QUADRADA DE PI - SEU CACHORRO ESTÁ TE TREINANDO\nConhecendo e Utilizando o Estímulo Discriminativo\nObs.: Superfícies Táteis e Farejo para Evitar Xixi/Cocô", callback_data: 'xixicoco_7' }],
        [{ text: "Voltar", callback_data: 'voltar' }, { text: "Sair", callback_data: 'sair' }]
      ]
    };
    break;



case 'menu_ansiedade_4':
    messageText = "Ansiedade:";
    keyboard = {
      inline_keyboard: [
        [{ text: "MÓDULO: ADESTRAMENTO HACKER | RITUAL DE INICIAÇÃO", callback_data: 'ansiedade_2' }],
        [{ text: "Elemento Surpresa - Jogo de Esconder\nExploração | Caixinhas de Papelão\nPara Roer e Morder - Cascos Recheados\nCabo de Guerra como Recompensa", callback_data: 'ansiedade_3' }],
        [{ text: "Estratégia de Autorregulação Emocional e Manejo de Ambiente", callback_data: 'ansiedade_4' }],
        [{ text: "Alimentação Inteligente\nElementos da Disciplina e Limites\nTreino da Caixa de Transporte\nItens de roer quando sozinho", callback_data: 'ansiedade_5' }],
        [{ text: "REGULAÇÃO INTERNA\nMitos sobre Alimentação e Estratégias de Treino", callback_data: 'ansiedade_6' }],
        [{ text: "Ciclo Circadiano e Autorregulação\nA Energia Correta Para o Comportamento Esperado", callback_data: 'ansiedade_7' }],
        [{ text: "Escala de Recompensas", callback_data: 'ansiedade_8' }],
        [{ text: "PODE OU NÃO PODE FAREJAR NOS PASSEIOS?\nExercício de Colocar Coleira\nPreparação de Condução\nReação Fisiológica ao Nome\nExercício de Tensão de Guia", callback_data: 'ansiedade_9' }],
        [{ text: "MÓDULO Bônus: Canse seu Cão SEM se Cansar\nObs.: Saciedade emocional através das interações", callback_data: 'ansiedade_10' }],
        [{ text: "Voltar", callback_data: 'voltar' }, { text: "Sair", callback_data: 'sair' }]
      ]
    };
    break;


case 'menu_posse_5':
    messageText = "Posse:";
    keyboard = {
      inline_keyboard: [
        [{ text: "MÓDULO: ADESTRAMENTO HACKER | RITUAL DE INICIAÇÃO", callback_data: 'posse_2' }],
        [{ text: "Controle de Mordida - Menção de Pegar - Liberdade de Escolha\nPara Roer e Morder - Cascos Recheados\nCaça-Caçador", callback_data: 'posse_3' }],
        [{ text: "Estratégia de Autorregulação Emocional e Manejo de Ambiente\nAlimentação Inteligente\nOs elementos da Disciplina e os Limites\nTreino da Caixa de Transporte\nItens de roer quando sozinho", callback_data: 'posse_4' }],
        [{ text: "REGULAÇÃO INTERNA\nMitos sobre Alimentação e Estratégias de Treino", callback_data: 'posse_5' }],
        [{ text: "Ciclo Circadiano e Autorregulação\nA Energia Correta Para o Comportamento Esperado", callback_data: 'posse_6' }],
        [{ text: "R+ R- P+ P- RAIZ QUADRADA DE PI - SEU CACHORRO ESTÁ TE TREINANDO\nConhecendo e Utilizando o Estímulo Discriminativo", callback_data: 'posse_7' }],
        [{ text: "Escala de Recompensas", callback_data: 'posse_8' }],
        [{ text: "PODE OU NÃO PODE FAREJAR NOS PASSEIOS?\nExercício de Colocar Coleira\nPreparação de Condução\nReação Fisiológica ao Nome\nExercício de Tensão de Guia", callback_data: 'posse_9' }],
        [{ text: "MÓDULO Bônus: Canse seu Cão SEM se Cansar\nObs.: Saciedade emocional através das interações", callback_data: 'posse_10' }],
        [{ text: "R+ R- P+ P- RAIZ QUADRADA DE PI\nTreino de Campo Visual - Reforço Negativo\nComo Cães Usam Reforço Negativo Para Nos Treinar", callback_data: 'posse_11' }],
        [{ text: "Voltar", callback_data: 'voltar' }, { text: "Sair", callback_data: 'sair' }]
      ]
    };
    break;


case 'menu_passeio_6':
    messageText = "Passeio:";
    keyboard = {
      inline_keyboard: [
        [{ text: "Elemento Surpresa - Jogo de Esconder\nTreino Lúdico - Sessão Livre\nExploração - Caixinhas de Papelão\nConsciência Corporal", callback_data: 'passeio_2' }],
        [{ text: "Como ensinar o cão a gostar de Cabo de Guerra e usar esse jogo como recompensa\nConsciência Corporal 'Cumprimenta' (Suricato)\nEnsinando a Correr\nCaça-Caçador", callback_data: 'passeio_3' }],
        [{ text: "Estratégia de Autorregulação Emocional e Manejo de Ambiente\nAlimentação Inteligente\nDisciplina e Limites\nTreino da Caixa de Transporte", callback_data: 'passeio_4' }],
        [{ text: "REGULAÇÃO INTERNA\nMitos sobre Alimentação e Estratégias de Treino", callback_data: 'passeio_5' }],
        [{ text: "Ciclo Circadiano e Autorregulação\nA Energia Correta Para o Comportamento Esperado", callback_data: 'passeio_6' }],
        [{ text: "R+ R- P+ P- RAIZ QUADRADA DE PI - SEU CACHORRO ESTÁ TE TREINANDO\nConhecendo e Utilizando o Estímulo Discriminativo", callback_data: 'passeio_7' }],
        [{ text: "Escala de Recompensas", callback_data: 'passeio_8' }],
        [{ text: "PASSEIO COMO SE FAZ\nPODE OU NÃO PODE FAREJAR NOS PASSEIOS?\nExercício de Colocar Coleira\nPreparação de Condução", callback_data: 'passeio_9' }],
        [{ text: "Reação Fisiológica ao Nome - Generalização Ambiental\nExercício de Tensão de Guia", callback_data: 'passeio_10' }],
        [{ text: "MÓDULO Bônus: Canse seu Cão SEM se Cansar | Exercícios Lúdicos de Estimulação Cognitiva", callback_data: 'passeio_11' }],
        [{ text: "R+ R- P+ P- RAIZ QUADRADA DE PI - SEU CACHORRO ESTÁ TE TREINANDO\nTreino de Campo Visual - Reforço Negativo", callback_data: 'passeio_12' }],
        [{ text: "Condução com Guia Retrátil ou com Guia Longa\nCOMO USAR A GUIA RETRÁTIL PARA RESOLVER A REATIVIDADE NOS PASSEIOS", callback_data: 'passeio_13' }],
        [{ text: "Protocolos de Socialização: QUER UM CACHORRO SOCIÁVEL? NÃO SOCIALIZE!", callback_data: 'passeio_14' }],
        [{ text: "Exposição gradual a coleira e guia durante os jogos\nPASSEIO COMO SE FAZ", callback_data: 'passeio_15' }],
        [{ text: "Exposição Gradual a novos ambientes", callback_data: 'passeio_16' }],
        [{ text: "Generalização da Reação Fisiológica ao Nome\nCachorro que Atende ao Nome COM VONTADE!", callback_data: 'passeio_17' }],
        [{ text: "Ansiedade de Separação\nComando Fica Saindo do Campo Visual", callback_data: 'passeio_18' }],
        [{ text: "Voltar", callback_data: 'voltar' }, { text: "Sair", callback_data: 'sair' }]
      ]
    };
    break;


case 'menu_reatividade_7':
    messageText = "Reatividade:";
    keyboard = {
      inline_keyboard: [
        [{ text: "MÓDULO: ADESTRAMENTO HACKER | RITUAL DE INICIAÇÃO", callback_data: 'reatividade_2' }],
        [{ text: "MÓDULO Bônus: Canse seu Cão SEM se Cansar | Exercícios Lúdicos de Estimulação Cognitiva\nRecomendações Específicas principalmente as de exorcismo (ensinar a correr)\nManejo de Toque como Ensinar seu Cão a se “Autoacalmar”\nIndução para Introdução da Massagem e Relaxamento\nComo ensinar o cão a gostar de cabo de guerra e usar esse jogo como recompensa", callback_data: 'reatividade_3' }],
        [{ text: "Estratégia de Autorregulação Emocional e Manejo de Ambiente\nAlimentação Inteligente\nOs elementos da Disciplina e os Limites\nTreino da Caixa de Transporte\nTreino da Caixa de Transporte (Itens de roer quando estiver sozinho, como chifres e cascos)", callback_data: 'reatividade_4' }],
        [{ text: "REGULAÇÃO INTERNA\nMitos sobre Alimentação e Estratégias de Treino", callback_data: 'reatividade_5' }],
        [{ text: "Ciclo Circadiano e Autorregulação\nA Energia Correta Para o Comportamento Esperado", callback_data: 'reatividade_6' }],
        [{ text: "R+ R- P+ P- RAIZ QUADRADA DE PI - SEU CACHORRO ESTÁ TE TREINANDO\nConhecendo e Utilizando o Estímulo Discriminativo", callback_data: 'reatividade_7' }],
        [{ text: "Escala de Recompensas\nZona de Recompensa", callback_data: 'reatividade_8' }],
        [{ text: "PASSEIO COMO SE FAZ\nPODE OU NÃO PODE FAREJAR NOS PASSEIOS?\nExercício de Colocar Coleira\nPreparação de Condução\nReação Fisiológica ao Nome - Generalização Ambiental\nExercício de Tensão de Guia\nObservação: Qualidade de Passeio com exposição gradual, associação positiva e planejamento de tempo de permanência de condução alternado com intervalos curtos de repouso", callback_data: 'reatividade_9' }],
        [{ text: "MÓDULO Bônus: Canse seu Cão SEM se Cansar | Exercícios Lúdicos de Estimulação Cognitiva\nObs.: Saciedade emocional através das interações\nObs.2: evite interações NÃO planejadas na rua", callback_data: 'reatividade_10' }],
        [{ text: "R+ R- P+ P- RAIZ QUADRADA DE PI - SEU CACHORRO ESTÁ TE TREINANDO\nTreino de Campo Visual - Reforço Negativo\nCOMO CÃES USAM REFORÇO NEGATIVO PARA NOS TREINAR\nCondução com Guia Retrátil ou com Guia Longa\nCOMO USAR A GUIA RETRÁTIL PARA RESOLVER A REATIVIDADE NOS PASSEIOS\nAdestramento de Cães Reativos\nTreino de Controle de Reatividade - Cães Latindo no Portão - Equilíbrio dos Sentidos\nENSINANDO CACHORRO A PASSEAR SEM PUXAR E SEM REATIVIDADE\nTREINO DE PASSEIO - CONSCIÊNCIA DE CORPO, ELIMINAÇÃO DE ATAQUE DE PÂNICO E REDUÇÃO DE REATIVIDADE\nResolvendo passo a passo a REATIVIDADE entre cães e a socialização\nAtivação de Neurônios-Espelho\nTreino de Assimilação Social", callback_data: 'reatividade_11' }],
        [{ text: "Protocolos de Socialização: QUER UM CACHORRO SOCIÁVEL? NÃO SOCIALIZE!", callback_data: 'reatividade_12' }],
        [{ text: "Exposição gradual a coleira e guia durante os jogos e condicionante para momentos de alimentação\nAdestramento de Cães Reativos\nAutocontrole na Chegada de Casa - Cães Reativos\nComportamentos de Autorregulação e Conexão", callback_data: 'reatividade_13' }],
        [{ text: "Habituação com equipamento dentro de casa simulando passeio e aumentando gradativamente as distrações no ambiente\nCondução Circular e Mudança de Direção", callback_data: 'reatividade_14' }],
        [{ text: "Dessensibilização e Exposição aos equipamentos de passeio\nR+ R- P+ P- RAIZ QUADRADA DE PI\nSEU CACHORRO ESTÁ TE TREINANDO", callback_data: 'reatividade_15' }],
        [{ text: "Treinos de indução do 'senta' e permanência no 'fica' em pontos estratégicos\nConstrução do Comando Senta, Aplicação e NÃO Aplicação\nLiberação com 'ok' do comando 'senta'\nIntrodução da Substituição de Recompensas ‘Senta’\nAutocontrole em Elevadores\nHabituação com o Carro\nProblemas de Adaptação no Carro e em Ambientes Fechados", callback_data: 'reatividade_16' }],
        [{ text: "Exposição Gradual a novos ambientes", callback_data: 'reatividade_17' }],
        [{ text: "Generalização da Reação Fisiológica ao Nome\nCachorro que Atende ao Nome COM VONTADE!\nENSINANDO SEU CÃO A ATENDER QUANDO CHAMADO - REAÇÃO FISIOLÓGICA AO NOME", callback_data: 'reatividade_18' }],
        [{ text: "Ansiedade de Separação\nComando Fica Saindo do Campo Visual\nElemento Surpresa - Jogo de Esconder", callback_data: 'reatividade_19' }],
        [{ text: "Exercício de Tensão de Guia\nTreino do comando 'Deixa' com Tensão de Guia\nTensão de Guia para Obter Recompensa\nO caminho mais longo", callback_data: 'reatividade_20' }],
        [{ text: "Treino de Contato Visual durante a caminhada\nConstrução de Gatilho Visual | Construção do Contato Visual\nContato Visual com Voz\nCONTATO VISUAL E REFERENCIAL HUMANO", callback_data: 'reatividade_21' }],
        [{ text: "Treino de Permanência no Campo Visual (R-)\nMarcador Negativo - Construção e Aplicação\nComo e Quando Utilizar o Marcador Negativo", callback_data: 'reatividade_22' }],
        [{ text: "Detox Social", callback_data: 'reatividade_23' }],
        [{ text: "Voltar", callback_data: 'voltar' }, { text: "Sair", callback_data: 'sair' }]
      ]
    };
    break;

    case 'menu_socioPC_8':
    messageText = "Socialização Pessoas Casa";
    keyboard = {
      inline_keyboard: [
        [{ text: "MÓDULO: ADESTRAMENTO HACKER | RITUAL DE INICIAÇÃO", callback_data: 'socioPC_2' }],
        [{ text: "MÓDULO Bônus: Canse seu Cão SEM se Cansar | Exercícios Lúdicos de Estimulação Cognitiva\nRecomendações Específicas principalmente as de exorcismo (ensinar a correr)\nManejo de Toque como Ensinar seu Cão a se “Autoacalmar”\nIndução para Introdução da Massagem e Relaxamento\nComo ensinar o cão a gostar de cabo de guerra e usar esse jogo como recompensa", callback_data: 'socioPC_3' }],
        [{ text: "Estratégia de Autorregulação Emocional e Manejo de Ambiente\nAlimentação Inteligente\nOs elementos da Disciplina e os Limites\nTreino da Caixa de Transporte\nTreino da Caixa de Transporte (Itens de roer quando estiver sozinho, como chifres e cascos)", callback_data: 'socioPC_4' }],
        [{ text: "REGULAÇÃO INTERNA\nMitos sobre Alimentação e Estratégias de Treino", callback_data: 'socioPC_5' }],
        [{ text: "Ciclo Circadiano e Autorregulação\nA Energia Correta Para o Comportamento Esperado", callback_data: 'socioPC_6' }],
        [{ text: "R+ R- P+ P- RAIZ QUADRADA DE PI - SEU CACHORRO ESTÁ TE TREINANDO\nConhecendo e Utilizando o Estímulo Discriminativo", callback_data: 'socioPC_7' }],
        [{ text: "Escala de Recompensas\nA Substituição das Recompensas de Comida por Outras Mais Desejadas", callback_data: 'socioPC_8' }],
        [{ text: "PASSEIO COMO SE FAZ\nPODE OU NÃO PODE FAREJAR NOS PASSEIOS?\nExercício de Colocar Coleira\nPreparação de Condução\nReação Fisiológica ao Nome - Generalização Ambiental\nExercício de Tensão de Guia\nObservação: Qualidade de Passeio com exposição gradual, associação positiva e planejamento de tempo de permanência de condução alternado com intervalos curtos de repouso", callback_data: 'socioPC_9' }],
        [{ text: "MÓDULO Bônus: Canse seu Cão SEM se Cansar | Exercícios Lúdicos de Estimulação Cognitiva\nObs.: Saciedade emocional através das interações\nObs.2: evite interações NÃO planejadas na rua", callback_data: 'socioPC_10' }],
        [{ text: "EXPOSIÇÃO E PREPARAÇÃO SOCIAL DE ADULTOS E FILHOTES\nR+ R- P+ P- RAIZ QUADRADA DE PI - SEU CACHORRO ESTÁ TE TREINANDO\nTreino de Campo Visual - Reforço Negativo\nCOMO CÃES USAM REFORÇO NEGATIVO PARA NOS TREINAR\nQUER UM CACHORRO SOCIÁVEL? NÃO SOCIALIZE!\nProtocolo de Socialização com Filhotes\nLimites de Exposição Social", callback_data: 'socioPC_11' }],
        [{ text: "Protocolos de Socialização Específicos: Protocolo de Socialização com Filhotes", callback_data: 'socioPC_12' }],
        [{ text: "Exposição gradual a coleira e guia durante os jogos e condicionante para momentos de alimentação\nAdestramento de Cães Reativos\nAutocontrole na Chegada de Casa - Cães Reativos\nComportamentos de Autorregulação e Conexão", callback_data: 'socioPC_13' }],
        [{ text: "Habituação com equipamento dentro de casa simulando passeio e aumentando gradativamente as distrações no ambiente\nCondução Circular e Mudança de Direção", callback_data: 'socioPC_14' }],
        [{ text: "Dessensibilização e Exposição aos equipamentos de passeio\nR+ R- P+ P- RAIZ QUADRADA DE PI\nSEU CACHORRO ESTÁ TE TREINANDO", callback_data: 'socioPC_15' }],
        [{ text: "Treinos de indução do 'senta' e permanência no 'fica' em pontos estratégicos\nConstrução do Comando Senta, Aplicação e NÃO Aplicação\nLiberação com 'ok' do comando 'senta'\nIntrodução da Substituição de Recompensas 'Senta'\nAutocontrole em Elevadores\nHabituação com o Carro\nProblemas de Adaptação no Carro e em Ambientes Fechados", callback_data: 'socioPC_16' }],
        [{ text: "Exposição Gradual a novos ambientes com cães", callback_data: 'socioPC_17' }],
        [{ text: "Generalização da Reação Fisiológica ao Nome\nCachorro que Atende ao Nome COM VONTADE!\nENSINANDO SEU CÃO A ATENDER QUANDO CHAMADO - REAÇÃO FISIOLÓGICA AO NOME", callback_data: 'socioPC_18' }],
        [{ text: "Ansiedade de Separação\nComando Fica Saindo do Campo Visual\nElemento Surpresa - Jogo de Esconder", callback_data: 'socioPC_19' }],
        [{ text: "Exercício de Tensão de Guia\nTreino do comando 'Deixa' com Tensão de Guia\nTensão de Guia para Obter Recompensa\nO caminho mais longo", callback_data: 'socioPC_20' }],
        [{ text: "Treino de Contato Visual (no sentido de buscar orientação dos tutores quanto à possibilidade de interação ou não)\nTreino de Contato Visual durante a caminhada\nConstrução de Gatilho Visual\nConstrução do Contato Visual\nContato Visual com Voz\nCONTATO VISUAL E REFERENCIAL HUMANO", callback_data: 'socioPC_21' }],
        [{ text: "Treino de Permanência no Campo Visual (R-)\nCondução com Mudança de Direção", callback_data: 'socioPC_23' }],
        [{ text: "Detox Social + Interações Sociais Planejadas", callback_data: 'socioPC_23' }],
        [{ text: "Voltar", callback_data: 'voltar' }, { text: "Sair", callback_data: 'sair' }]
      ]
    };
    break;

    case 'menu_socioCC_9':
    messageText = "Socialização Cachorros Casa:";
    keyboard = {
      inline_keyboard: [
        [{ text: "MÓDULO: ADESTRAMENTO HACKER | RITUAL DE INICIAÇÃO", callback_data: 'socioCC_1' }],
        [{ text: "Elemento Surpresa - Jogo de Esconder\nTreino Lúdico - Sessão Livre\nExploração - Caixinhas de Papelão\nConsciência Corporal\nComo ensinar o cão a gostar de cabo de guerra e usar esse jogo como recompensa\nConsciência Corporal 'Cumprimenta' (Suricato)\nEnsinando a Correr\nCaça-Caçador", callback_data: 'socioCC_2' }],
        [{ text: "Manejo de ambiente - Intercale períodos de interação com períodos de separação dos cães\nUma média de 3 a 5 minutos de interação equivale a uma média de 1 a 3 minutos de intervalo\nDurante os intervalos aumente a distância entre os cães e recompense com comida para valorizar a permanência do cão ao seu lado ou próximo de você.", callback_data: 'socioCC_3' }],
        [{ text: "REGULAÇÃO INTERNA\nMitos sobre Alimentação e Estratégias de Treino", callback_data: 'socioCC_4' }],
        [{ text: "Ciclo Circadiano e Autorregulação\nA Energia Correta Para o Comportamento Esperado", callback_data: 'socioCC_5' }],
        [{ text: "R+ R- P+ P- RAIZ QUADRADA DE PI - SEU CACHORRO ESTÁ TE TREINANDO\nConhecendo e Utilizando o Estímulo Discriminativo\nDependendo da fase de vida pode e deve ser utilizado coleira e guia durante todo o tempo de permanência das visitas em casa simulando o contexto de socialização que deve acontecer tanto em casa quanto na rua.", callback_data: 'socioCC_6' }],
        [{ text: "Escala de Recompensas\nA Substituição das Recompensas de Comida por Outras Mais Desejadas\n[observação: Socialização, escala de recompensa, condicionamento]", callback_data: 'socioCC_7' }],
        [{ text: "PASSEIO COMO SE FAZ\nPODE OU NÃO PODE FAREJAR NOS PASSEIOS?\nExercício de Colocar Coleira\nPreparação de Condução\nReação Fisiológica ao Nome - Generalização Ambiental\nExercício de Tensão de Guia\nObservação: Qualidade de Passeio com exposição gradual, associação positiva e planejamento de tempo de permanência de condução alternado com intervalos curtos de repouso", callback_data: 'socioCC_8' }],
        [{ text: "MÓDULO Bônus: Canse seu Cão SEM se Cansar | Exercícios Lúdicos de Estimulação Cognitiva\nObs.: Saciedade emocional através das interações\nObs.2: evite interações NÃO planejadas na rua", callback_data: 'socioCC_9' }],
        [{ text: "EXPOSIÇÃO E PREPARAÇÃO SOCIAL DE ADULTOS E FILHOTES\nR+ R- P+ P- RAIZ QUADRADA DE PI - SEU CACHORRO ESTÁ TE TREINANDO\nManejo de Ambiente\nQUER UM CACHORRO SOCIÁVEL? NÃO SOCIALIZE!\nProtocolo de Socialização com Filhotes\nLimites de Exposição Social\nPROTOCOLO DE SOCIALIZAÇÃO NA PRÁTICA | A ETAPA YIN & YANG", callback_data: 'socioCC_10' }],
        [{ text: "Protocolos de Socialização Específicos: Protocolo de Socialização com Filhotes\n+ Lúdico ANTES da interação\n+ interação supervisada e intervalada (3 a 5 min de interação, alternado com 3 a 5 de pausa)\n+ Manejo de ambiente\n+ recursos disponíveis para interação\nDois Cães na Mesma Casa\nTreino Lúdico - Dois (ou mais) Cães Juntos - Sessão Livre", callback_data: 'socioCC_11' }],
        [{ text: "Exposição gradual a coleira e guia durante os jogos e condicionante para momentos de alimentação\nComportamentos de Autorregulação e Conexão\nExercício de Colocar Coleira\nDessensibilização a Estímulos", callback_data: 'socioCC_12' }],
        [{ text: "Habituação com equipamento dentro de casa simulando passeio e aumentando gradativamente as distrações no ambiente\nCondução Circular e Mudança de Direção", callback_data: 'socioCC_13' }],
        [{ text: "Dessensibilização e Exposição aos equipamentos de passeio\nR+ R- P+ P- RAIZ QUADRADA DE PI\nSEU CACHORRO ESTÁ TE TREINANDO", callback_data: 'socioCC_14' }],
        [{ text: "Treinos de indução do 'senta' e permanência no 'fica' em pontos estratégicos\nConstrução do Comando Senta, Aplicação e NÃO Aplicação\nLiberação com 'ok' do comando 'senta'\nIntrodução da Substituição de Recompensas 'Senta'\nAutocontrole em Elevadores\nHabituação com o Carro\nProblemas de Adaptação no Carro e em Ambientes Fechados", callback_data: 'socioCC_15' }],
        [{ text: "Exposição Gradual a novos ambientes", callback_data: 'socioCC_16' }],
        [{ text: "Generalização da Reação Fisiológica ao Nome até os 5 meses\nCachorro que Atende ao Nome COM VONTADE!\nENSINANDO SEU CÃO A ATENDER QUANDO CHAMADO - REAÇÃO FISIOLÓGICA AO NOME", callback_data: 'socioCC_17' }],
        [{ text: "Ansiedade de Separação\nComando Fica Saindo do Campo Visual\nElemento Surpresa - Jogo de Esconder", callback_data: 'socioCC_18' }],
        [{ text: "Exercício de Tensão de Guia\nTreino do comando 'Deixa' com Tensão de Guia\nTensão de Guia para Obter Recompensa\nO caminho mais longo", callback_data: 'socioCC_19' }],
        [{ text: "Treino de Contato Visual (no sentido de buscar orientação dos tutores quanto à possibilidade de interação ou não)\nTreino de Contato Visual durante a caminhada\nConstrução de Gatilho Visual\nConstrução do Contato Visual\nContato Visual com Voz\nCONTATO VISUAL E REFERENCIAL HUMANO", callback_data: 'socioCC_20' }],
        [{ text: "Treino de Permanência no Campo Visual (R-)\nCondução com Mudança de Direção", callback_data: 'socioCC_21' }],
        [{ text: "Detox Social + Interações Sociais Planejadas", callback_data: 'socioCC_22' }],
        [{ text: "Voltar", callback_data: 'voltar' }, { text: "Sair", callback_data: 'sair' }]
      ]
    };
    break;

case 'menu_socioPR_10':
    messageText = "Socialização Pessoas Rua:";
    keyboard = {
      inline_keyboard: [
        [{ text: "MÓDULO: ADESTRAMENTO HACKER | RITUAL DE INICIAÇÃO", callback_data: 'socioPR_1' }],
        [{ text: "MÓDULO Bônus: Canse seu Cão SEM se Cansar | Exercícios Lúdicos de Estimulação Cognitiva\nEnsinar a correr\nManejo de toque\nComo Ensinar seu Cão a se 'Autoacalmar'\nIndução para Introdução da Massagem e Relaxamento\nComo ensinar o cão a gostar de cabo de guerra e usar esse jogo como recompensa", callback_data: 'socioPR_2' }],
        [{ text: "Estratégia de Autorregulação Emocional e Manejo de Ambiente\nAlimentação Inteligente\nOs elementos da Disciplina e os Limites\nTreino da Caixa de Transporte\nTreino da Caixa de Transporte (Itens de roer quando estiver sozinho, como chifres e cascos)", callback_data: 'socioPR_3' }],
        [{ text: "REGULAÇÃO INTERNA\nMitos sobre Alimentação e Estratégias de Treino", callback_data: 'socioPR_4' }],
        [{ text: "Ciclo Circadiano e Autorregulação\nA Energia Correta Para o Comportamento Esperado", callback_data: 'socioPR_5' }],
        [{ text: "R+ R- P+ P- RAIZ QUADRADA DE PI - SEU CACHORRO ESTÁ TE TREINANDO\nConhecendo e Utilizando o Estímulo Discriminativo", callback_data: 'socioPR_6' }],
        [{ text: "Escala de Recompensas\nA Substituição das Recompensas de Comida por Outras Mais Desejadas\n[observação: Socialização, escala de recompensa, condicionamento]", callback_data: 'socioPR_7' }],
        [{ text: "PASSEIO COMO SE FAZ\nPODE OU NÃO PODE FAREJAR NOS PASSEIOS?\nExercício de Colocar Coleira\nPreparação de Condução\nReação Fisiológica ao Nome - Generalização Ambiental\nExercício de Tensão de Guia\nObservação: Qualidade de Passeio com exposição gradual, associação positiva e planejamento de tempo de permanência de condução alternado com intervalos curtos de repouso", callback_data: 'socioPR_8' }],
        [{ text: "PROTOCOLO DE SOCIALIZAÇÃO NA PRÁTICA\nA ETAPA YIN & YANG\nEXPOSIÇÃO E PREPARAÇÃO SOCIAL DE ADULTOS E FILHOTES\nR+ R- P+ P- RAIZ QUADRADA DE PI - SEU CACHORRO ESTÁ TE TREINANDO\nTreino de Campo Visual - Reforço Negativo\nCOMO CÃES USAM REFORÇO NEGATIVO PARA NOS TREINAR\nQUER UM CACHORRO SOCIÁVEL? NÃO SOCIALIZE!\nProtocolo de Socialização com Filhotes\nLimites de Exposição Social", callback_data: 'socioPR_9' }],
        [{ text: "Protocolos de Socialização Específicos: QUER UM CACHORRO SOCIÁVEL? NÃO SOCIALIZE!\nAULA 24 - TREINO DE CONSISTÊNCIA E VALORIZAÇÃO DE COMPORTAMENTO PARA INTERAÇÃO (OU NÃO) COM PESSOAS", callback_data: 'socioPR_10' }],
        [{ text: "Exposição gradual a coleira e guia durante os jogos e condicionante para momentos de alimentação\nComportamentos de Autorregulação e Conexão\nExercício de Colocar Coleira\nDessensibilização a Estímulos\nSituações de Manejo e Autocontrole", callback_data: 'socioPR_11' }],
        [{ text: "Habituação com equipamento dentro casa simulando passeio e aumentando gradativamente as distrações no ambiente\nCondução Circular e Mudança de Direção", callback_data: 'socioPR_12' }],
        [{ text: "Dessensibilização e Exposição aos equipamentos de passeio\nR+ R- P+ P- RAIZ QUADRADA DE PI\nSEU CACHORRO ESTÁ TE TREINANDO", callback_data: 'socioPR_13' }],
        [{ text: "Treinos de indução do 'senta' e permanência no 'fica' em pontos estratégicos\nConstrução do Comando Senta, Aplicação e NÃO Aplicação\nLiberação com 'ok' do comando 'senta'\nIntrodução da Substituição de Recompensas 'Senta'\nAutocontrole em Elevadores\nHabituação com o Carro\nProblemas de Adaptação no Carro e em Ambientes Fechados", callback_data: 'socioPR_14' }],
        [{ text: "Exposição Gradual a novos ambientes", callback_data: 'socioPR_15' }],
        [{ text: "Generalização da Reação Fisiológica ao Nome até os 5 meses\nReação Fisiológica ao Nome - Generalização Ambiental\nReação Fisiológica ao Nome durante o Passeio\nCachorro que Atende ao Nome COM VONTADE!\nENSINANDO SEU CÃO A ATENDER QUANDO CHAMADO - REAÇÃO FISIOLÓGICA AO NOME", callback_data: 'socioPR_16' }],
        [{ text: "Ansiedade de Separação\nComando Fica Saindo do Campo Visual\nElemento Surpresa - Jogo de Esconder", callback_data: 'socioPR_17' }],
        [{ text: "Exercício de Tensão de Guia\nTreino do comando 'Deixa' com Tensão de Guia\nTensão de Guia para Obter Recompensa\nO caminho mais longo", callback_data: 'socioPR_18' }],
        [{ text: "Treino de Contato Visual (no sentido de buscar orientação dos tutores quanto à possibilidade de interação ou não)\nTreino de Contato Visual durante a caminhada\nConstrução de Gatilho Visual\nConstrução do Contato Visual\nContato Visual com Voz\nCONTATO VISUAL E REFERENCIAL HUMANO", callback_data: 'socioPR_19' }],
        [{ text: "Treino de Permanência no Campo Visual (R-)\nCondução com Mudança de Direção", callback_data: 'socioPR_20' }],
        [{ text: "Detox Social + Interações Sociais Planejadas", callback_data: 'socioPR_21' }],
        [{ text: "Protocolo de Socialização Yin & Yang", callback_data: 'socioPR_22' }],
        [{ text: "Voltar", callback_data: 'voltar' }, { text: "Sair", callback_data: 'sair' }]
      ]
    };
    break;

case 'menu_socioCR_11':
    messageText = "Socialização Cachorros Rua:";
    keyboard = {
      inline_keyboard: [
        [{ text: "MÓDULO: ADESTRAMENTO HACKER | RITUAL DE INICIAÇÃO", callback_data: 'socioCR_1' }],
        [{ text: "MÓDULO Bônus: Canse seu Cão SEM se Cansar | Exercícios Lúdicos de Estimulação Cognitiva\nEnsinar a correr\nManejo de toque\nComo Ensinar seu Cão a se 'Autoacalmar'\nIndução para Introdução da Massagem e Relaxamento\nComo ensinar o cão a gostar de cabo de guerra e usar esse jogo como recompensa", callback_data: 'socioCR_2' }],
        [{ text: "Estratégia de Autorregulação Emocional e Manejo de Ambiente\nAlimentação Inteligente\nOs elementos da Disciplina e os Limites\nTreino da Caixa de Transporte\nTreino da Caixa de Transporte (Itens de roer quando estiver sozinho, como chifres e cascos)", callback_data: 'socioCR_3' }],
        [{ text: "REGULAÇÃO INTERNA\nMitos sobre Alimentação e Estratégias de Treino", callback_data: 'socioCR_4' }],
        [{ text: "Ciclo Circadiano e Autorregulação\nA Energia Correta Para o Comportamento Esperado", callback_data: 'socioCR_5' }],
        [{ text: "R+ R- P+ P- RAIZ QUADRADA DE PI - SEU CACHORRO ESTÁ TE TREINANDO\nConhecendo e Utilizando o Estímulo Discriminativo", callback_data: 'socioCR_6' }],
        [{ text: "Escala de Recompensas\nA Substituição das Recompensas de Comida por Outras Mais Desejadas\n[observação: Socialização, escala de recompensa, condicionamento]", callback_data: 'socioCR_7' }],
        [{ text: "PASSEIO COMO SE FAZ\nPODE OU NÃO PODE FAREJAR NOS PASSEIOS?\nExercício de Colocar Coleira\nPreparação de Condução\nReação Fisiológica ao Nome - Generalização Ambiental\nExercício de Tensão de Guia\nObservação: Qualidade de Passeio com exposição gradual, associação positiva e planejamento de tempo de permanência de condução alternado com intervalos curtos de repouso", callback_data: 'socioCR_8' }],
        [{ text: "EXPOSIÇÃO E PREPARAÇÃO SOCIAL DE ADULTOS E FILHOTES\nR+ R- P+ P- RAIZ QUADRADA DE PI - SEU CACHORRO ESTÁ TE TREINANDO\nTreino de Campo Visual - Reforço Negativo\nCOMO CÃES USAM REFORÇO NEGATIVO PARA NOS TREINAR\nQUER UM CACHORRO SOCIÁVEL? NÃO SOCIALIZE!\nProtocolo de Socialização com Filhotes\nLimites de Exposição Social\nProtocolos de Socialização com Cães Adultos\nPROTOCOLO DE SOCIALIZAÇÃO NA PRÁTICA\nA ETAPA YIN & YANG\nProtocolos de Socialização com Cães e Com Pessoas em Ambientes Externos\nProtocolo de Socialização na Prática\nAtivação de Neurônios-Espelho", callback_data: 'socioCR_9' }],
        [{ text: "Protocolos de Socialização Específicos: QUER UM CACHORRO SOCIÁVEL? NÃO SOCIALIZE!\nProtocolo de Socialização na Prática\nLinguagem Corporal Canina\nAnálise de Linguagem Corporal e Utilização de Recompensas\nPROTOCOLO DE SOCIALIZAÇÃO NA PRÁTICA -A ETAPA YIN & YANG\nProtocolos de Socialização com Cães e Com Pessoas em Ambientes Externos\nRotina de Cumprimentar Cães na Rua", callback_data: 'socioCR_10' }],
        [{ text: "Exposição gradual a coleira e guia durante os jogos e condicionante para momentos de alimentação\nComportamentos de Autorregulação e Conexão\nExercício de Colocar Coleira\nDessensibilização a Estímulos\nSituações de Manejo e Autocontrole\nÉ POSSÍVEL SOCIALIZAR SEM CACHORRO IDEAL PRA AJUDAR?\nComo evoluir nos treinos de socialização", callback_data: 'socioCR_11' }],
        [{ text: "Habituação com equipamento dentro casa simulando passeio e aumentando gradativamente as distrações no ambiente\nCondução Circular e Mudança de Direção", callback_data: 'socioCR_12' }],
        [{ text: "Dessensibilização e Exposição aos equipamentos de passeio\nR+ R- P+ P- RAIZ QUADRADA DE PI\nSEU CACHORRO ESTÁ TE TREINANDO", callback_data: 'socioCR_13' }],
        [{ text: "Treinos de indução do 'senta' e permanência no 'fica' em pontos estratégicos\nConstrução do Comando Senta, Aplicação e NÃO Aplicação\nLiberação com 'ok' do comando 'senta'\nIntrodução da Substituição de Recompensas 'Senta'\nAutocontrole em Elevadores\nHabituação com o Carro\nProblemas de Adaptação no Carro e em Ambientes Fechados", callback_data: 'socioCR_14' }],
        [{ text: "Exposição Gradual a novos ambientes", callback_data: 'socioCR_15' }],
        [{ text: "Generalização da Reação Fisiológica ao Nome até os 5 meses\nReação Fisiológica ao Nome - Generalização Ambiental\nReação Fisiológica ao Nome durante o Passeio\nCachorro que Atende ao Nome COM VONTADE!\nENSINANDO SEU CÃO A ATENDER QUANDO CHAMADO - REAÇÃO FISIOLÓGICA AO NOME", callback_data: 'socioCR_16' }],
        [{ text: "Ansiedade de Separação\nComando Fica Saindo do Campo Visual\nElemento Surpresa - Jogo de Esconder", callback_data: 'socioCR_17' }],
        [{ text: "Exercício de Tensão de Guia\nTreino do comando 'Deixa' com Tensão de Guia\nTensão de Guia para Obter Recompensa\nO caminho mais longo\n'Deixa' Absoluto", callback_data: 'socioCR_18' }],
        [{ text: "Treino de Contato Visual (no sentido de buscar orientação dos tutores quanto à possibilidade de interação ou não)\nTreino de Contato Visual durante a caminhada\nConstrução de Gatilho Visual\nConstrução do Contato Visual\nContato Visual com Voz\nCONTATO VISUAL E REFERENCIAL HUMANO", callback_data: 'socioCR_19' }],
        [{ text: "Treino de Permanência no Campo Visual (R-)\nCondução com Mudança de Direção", callback_data: 'socioCR_20' }],
        [{ text: "Detox Social + Interações Sociais Planejadas", callback_data: 'socioCR_21' }],
        [{ text: "Protocolo de Socialização Cão a Cão\nProtocolo de Socialização Yin & Yang", callback_data: 'socioCR_22' }],
        [{ text: "Voltar", callback_data: 'voltar' }, { text: "Sair", callback_data: 'sair' }]
      ]
    };
    break;

    default:
      messageText = "Escolha inválida.";
      keyboard = { inline_keyboard: [] };
      break;
  }

  sendText(chatId, messageText, keyboard);
}


// Função para lidar com a seleção do submenu
function handleSelection(chatId, selection) {
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName('Sheet1');
  const userProperties = PropertiesService.getUserProperties();

  // Obtém o menu anterior selecionado
  const previousMenu = userProperties.getProperty(chatId + "_menu");

  // Determina a linha e coluna com base na seleção e no menu anterior
  let row, column;
  column = parseInt(previousMenu.split('_').pop()); // Pega o número da coluna a partir do menu anterior
  row = selection.split('_')[1];  // Extrai o número após o '_', que indica a linha

  const cell = sheet.getRange(row, column);
  const cellValue = cell.getValue();

  // Divide os elementos da célula separados por vírgula
  const elements = cellValue.split(';');

  // Se a célula contém mais de um elemento, cria um menu dinâmico
  if (elements.length > 0) {
    const keyboard = {
      inline_keyboard: elements.map((element, index) => [{ text: element.trim(), callback_data: `element_${row}_${column}_${index}` }])
    };
    sendText(chatId, "Escolha um elemento:", keyboard);

    // Remove o teclado do submenu após a escolha
    deleteMessage(chatId, selection.message.message_id);
  }
}


// Função para tratar o item selecionado no menu mais profundo
function handleElementSelection(chatId, selection) {
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName('Sheet1');

  // Extrai a linha, coluna e índice do elemento da seleção
  const [_, row, column, elementIndex] = selection.split('_');

  // Obtém o Rich Text e os links da célula
  const cell = sheet.getRange(row, column);
  const richTextContent = extractTextAndLinksFromCell(cell);

  // Divide os elementos extraídos por linha (considerando quebra de linha como separador)
  const elements = richTextContent.split(';');

  // Seleciona o elemento baseado no índice fornecido pela seleção do usuário
  const selectedElement = elements[elementIndex].trim();

  // Exibe o elemento selecionado com o texto e os links correspondentes
  sendText(chatId, `Você selecionou:\n${selectedElement}`);
}

