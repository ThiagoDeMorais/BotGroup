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
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName('Página1');
  
  if (data.callback_query) {
    handleCallbackQuery(data.callback_query);
  } else if (data.message.text) {
    const textOfMessage = (data.message.text).split("@", 1)[0];
    handleCommand(chatId, textOfMessage);
  }

  sheet.appendRow([new Date(), JSON.stringify(data)]);
}

// Função para lidar com os comandos
function handleCommand(chatId, textOfMessage) {
  if (textOfMessage == "/start") {
    sendMainMenu(chatId);
  } else {
    sendText(chatId, 'Olá, recebi sua mensagem: \n\n' + textOfMessage);
  }
}

// Função para enviar o menu principal
function sendMainMenu(chatId) {
  const keyboard = {
    inline_keyboard: [
      [
        { text: "1-Controle de Mordida", callback_data: 'menu_controle_mordida' }
      ],
      [
        { text: "2-Latidos e Vocalizações", callback_data: 'menu_latidos_vocalizacoes' }
      ],
      [
        { text: "3-Xixi e cocô no lugar certo", callback_data: 'menu_xixi_coco' }
      ],
      [
        { text: "4 - Sair", callback_data: 'sair' }
      ]
    ]
  };

  sendTextWithKeyboard(chatId, "Menu Principal:", keyboard);
}

// Função para lidar com as callback queries
function handleCallbackQuery(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data.startsWith('menu_')) {
    handleSubMenu(chatId, data);
  } else if (data === 'sair') {
    sendText(chatId, "Saindo do menu.");
  } else {
    handleSelection(chatId, data);
  }
}

// Função para lidar com os submenus
function handleSubMenu(chatId, data) {
  let keyboard, messageText;

  switch (data) {
    case 'menu_controle_mordida':
      messageText = "Controle de Mordida:";
      keyboard = {
        inline_keyboard: [
          [{ text: "a - controle1", callback_data: 'controle1' }],
          [{ text: "b - controle2", callback_data: 'controle2' }],
          [{ text: "c - sair", callback_data: 'sair' }]
        ]
      };
      break;

    case 'menu_latidos_vocalizacoes':
      messageText = "Latidos e Vocalizações:";
      keyboard = {
        inline_keyboard: [
          [{ text: "a - latido1", callback_data: 'latido1' }],
          [{ text: "b - latido2", callback_data: 'latido2' }],
          [{ text: "c - sair", callback_data: 'sair' }]
        ]
      };
      break;

    case 'menu_xixi_coco':
      messageText = "Xixi e cocô no lugar certo:";
      keyboard = {
        inline_keyboard: [
          [{ text: "a - xixi1", callback_data: 'xixi1' }],
          [{ text: "b - xixi2", callback_data: 'xixi2' }],
          [{ text: "c - sair", callback_data: 'sair' }]
        ]
      };
      break;

    default:
      messageText = "Escolha inválida.";
      keyboard = { inline_keyboard: [] };
      break;
  }

  sendTextWithKeyboard(chatId, messageText, keyboard);
}

// Função para enviar uma mensagem de texto com teclado inline
function sendTextWithKeyboard(chatId, text, keyboard) {
  const url = "https://api.telegram.org/bot" + botToken + "/sendMessage";
  const payload = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      chat_id: chatId,
      text: text,
      reply_markup: keyboard
    })
  };
  UrlFetchApp.fetch(url, payload);
}

// Função para enviar uma mensagem de texto
function sendText(chatId, text) {
  const url = "https://api.telegram.org/bot" + botToken + "/sendMessage";
  const payload = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      chat_id: chatId,
      text: text
    })
  };
  UrlFetchApp.fetch(url, payload);
}

// Função para enviar um documento
function sendDocument(chatId, fileId) {
  const url = "https://api.telegram.org/bot" + botToken + "/sendDocument";
  const payload = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      chat_id: chatId,
      document: fileId
    })
  };
  UrlFetchApp.fetch(url, payload);
}

// Função para salvar a ID do arquivo
function saveFileId(chatId, fileId) {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty("file_id_" + chatId, fileId);
}

// Função para obter a ID do arquivo salvo
function getFileId(chatId) {
  const scriptProperties = PropertiesService.getScriptProperties();
  return scriptProperties.getProperty("file_id_" + chatId);
}

// Função para lidar com a seleção dos controles
function handleSelection(chatId, selection) {
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName('Página1');
  const range = sheet.getRange("B8:L9");
  let response_of_bot;

  if (selection == 'controle1') {
    const cell = range.getCell(1, 1);
    response_of_bot = extractLinksFromCell(cell);
  } else if (selection == 'controle2') {
    const cell = range.getCell(2, 1);
    response_of_bot = extractLinksFromCell(cell);
  } else if (selection == 'latido1') {
    const cell = range.getCell(1, 2);
    response_of_bot = extractLinksFromCell(cell);
  } else if (selection == 'latido2') {
    const cell = range.getCell(2, 2);
    response_of_bot = extractLinksFromCell(cell);
  } else if (selection == 'xixi1') {
    const cell = range.getCell(1, 3);
    response_of_bot = extractLinksFromCell(cell);
  } else if (selection == 'xixi2') {
    const cell = range.getCell(2, 3);
    response_of_bot = extractLinksFromCell(cell);
  } else {
    response_of_bot = 'Escolha inválida.';
  }

  sendText(chatId, response_of_bot);
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
      results.push(`Texto: ${text}\nLink: ${url}`);
    }
  }

  return results.join('\n\n');
}
