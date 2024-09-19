const botToken = 'x';
const sheetId = 'x';
const appUrl = 'x';

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
      [{ text: "1-Controle de Mordida", callback_data: 'menu_controle_mordida_1' }, { text: "2-Latidos e Vocalizações", callback_data: 'menu_latidos_vocalizacoes_2' }],
      [{ text: "Sair", callback_data: 'sair' }]
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
          [{ text: "controle1", callback_data: 'controle_1' }, { text: "controle2", callback_data: 'controle_2' }],
          [{ text: "Voltar", callback_data: 'voltar' }], [{ text: "Sair", callback_data: 'sair' }]
        ]
      };
      break;

    case 'menu_latidos_vocalizacoes_2':
      messageText = "Latidos e Vocalizações:";
      keyboard = {
        inline_keyboard: [
          [{ text: "latido1", callback_data: 'latido_1' }, { text: "latido2", callback_data: 'latido_2' }],
          [{ text: "Voltar", callback_data: 'voltar' }], [{ text: "Sair", callback_data: 'sair' }]
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
  const elements = cellValue.split(',');

  // Se a célula contém mais de um elemento, cria um menu dinâmico
  if (elements.length > 1) {
    const keyboard = {
      inline_keyboard: elements.map((element, index) => [{ text: element.trim(), callback_data: `element_${row}_${column}_${index}` }])
    };
    sendText(chatId, "Escolha um elemento:", keyboard);
  } else {
    // Se houver apenas um elemento, exibe o resultado diretamente
    sendText(chatId, `Resultado: ${elements[0]}`);
  }
}

// Função para tratar o item selecionado no menu mais profundo
function handleElementSelection(chatId, selection) {
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName('Sheet1');
  
  // Extrai a linha, coluna e índice do elemento da seleção
  const [_, row, column, elementIndex] = selection.split('_');
  
  // Obtém o valor da célula
  const cell = sheet.getRange(row, column);
  const cellValue = cell.getValue();
  
  // Divide os elementos e obtém o elemento selecionado
  const elements = cellValue.split(',');
  const selectedElement = elements[elementIndex].trim();
  
  // Exibe o elemento selecionado e interrompe a recursão
  sendText(chatId, `Você selecionou: ${selectedElement}`);
}

