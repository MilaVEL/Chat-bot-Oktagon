const { connection, bot } = require('./token.js'); // Импортируем токен

connection.connect(function (err) {
    if (err) {
        return console.error("Ошибка: " + err.message);
    }
    else {
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});

//Команды
const commands = [

    {

        command: "/start",
        description: "Новый диалог"

    },
    {

        command: "/help",
        description: "Помощь"

    },
    {
        command: "/site",
        description: "Полезный сайт"

    },
    {
        command: "/creator",
        description: "Авторы этого бота"

    }
]
bot.setMyCommands(commands);


bot.onText(/\/start/, (msg, match) => {

    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Привет, Октагон!');
});

bot.onText(/\/help/, (msg, match) => {

    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Раздел помощи\n\n<b>help</b> - основные команды бота\n<b>site</b> - платформа, на которой ты получишь реальный опыт работы в IT\n<b>creator</b> - создатель данного телеграмм бота\n\n<b>randomItem</b> - случайный объект из базы данных\n<b>deleteItem</b> - удалить объект из базы данных\n<b>getItemByID</b> - найти объект из базы данных\n", {
        parse_mode: "HTML"
    });
});

bot.onText(/\/site/, (msg, match) => {

    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `https://students.forus.ru/`, {
        parse_mode: "HTML"
    });
});

bot.onText(/\/creator/, (msg, match) => {

    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Великанова Мила Евгеньевна');
});

bot.onText(/\/randomItem/, (msg, match) => {

    const chatId = msg.chat.id;
    connection.execute("SELECT * FROM items", function (error, results, fields) {
        if (error) {
            bot.sendMessage(chatId, "Ошибка при выполнении запроса");
        } else {
            max = results.length;
            min = 1;
            const index = Math.floor(Math.random() * (max - min + 1)) + min;
            const item = results[index];
            bot.sendMessage(chatId, `(${item.id}) - ${item.name}: ${item.descript}`);
        }
    });
});

bot.onText(/\/deleteItem (.+)/, (msg, match) => {

    const chatId = msg.chat.id;
    const itemId = match[1]; // the captured "whatever"

    connection.execute("DELETE FROM items WHERE id=?", [itemId], function (error, results, fields) {
        if (error) {
            bot.sendMessage(chatId, "Ошибка при удалении элемента");
        } else {
            if (results.affectedRows > 0) {
                bot.sendMessage(chatId, "Удачно");
            } else {
                bot.sendMessage(chatId, "Ошибка");
            }
        }
    });
});

bot.onText(/\/getItemByID (.+)/, (msg, match) => {

    const chatId = msg.chat.id;
    const itemId = match[1];

    connection.execute("SELECT * FROM items WHERE id=?", [itemId], function (error, results, fields) {
        if (error) {
            bot.sendMessage(chatId, "Ошибка при выполнении запроса");
        } else {
            if (results && results.length === 1) {
                const item = results[0];
                bot.sendMessage(chatId, `(${item.id}) - ${item.name}: ${item.descript}`);
            }
        }
    });
});


// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    bot.sendMessage(chatId, resp);
});
