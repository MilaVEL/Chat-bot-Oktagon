const token = require('./token.js'); // Импортируем токен
const TelegramBot = require('node-telegram-bot-api');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });
//Команды
const commands = [

    {

        command: "start",
        description: "Новый диалог"

    },
    {

        command: "help",
        description: "Помощь"

    },
    {
        command: "site",
        description: "Полезный сайт"

    },
    {
        command: "creator",
        description: "Авторы этого бота"

    },
]
bot.setMyCommands(commands);

bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // Проверяем, является ли это первым сообщением от пользователя
    if (msg.text === '/start') {
        bot.sendMessage(chatId, 'Привет, Октагон!');
    }
    else if (msg.text === '/help') {
        bot.sendMessage(chatId, "Раздел помощи\n\n<b>help</b> - основные команды бота\n<b>site</b> - платформа, на которой ты получишь реальный опыт работы в IT\n<b>creator</b> - создатель данного телеграмм бота\n", {
            parse_mode: "HTML"
        });
    }
    else if (msg.text === '/site') {
        bot.sendMessage(chatId, "<a href='https://students.forus.ru/'>Октагон</a>", {
            parse_mode: "HTML"
        });
    }
    else if (msg.text === '/creator') {
        bot.sendMessage(chatId, 'Великанова Мила Евгеньевна');
    }
});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    bot.sendMessage(chatId, resp);
});
