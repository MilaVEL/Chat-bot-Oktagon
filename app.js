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

bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // Проверяем, является ли это первым сообщением от пользователя
    if (msg.text === '/start') {
        bot.sendMessage(chatId, 'Привет, Октагон!');
    }
    else if (msg.text === '/help') {
        bot.sendMessage(chatId, "Раздел помощи\n\n<b>help</b> - основные команды бота\n<b>site</b> - платформа, на которой ты получишь реальный опыт работы в IT\n<b>creator</b> - создатель данного телеграмм бота\n\n<b>randomItem</b> - случайный объект из базы данных\n<b>deleteItem</b> - удалить объект из базы данных\n<b>getItemByID</b> - найти объект из базы данных\n", {
            parse_mode: "HTML"
        });
    }
    else if (msg.text === '/site') {
        bot.sendMessage(chatId, `https://students.forus.ru/`, {
            parse_mode: "HTML"
        });
    }
    else if (msg.text === '/creator') {
        bot.sendMessage(chatId, 'Великанова Мила Евгеньевна');
    }
    else if (msg.text === '/randomItem') {
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
    }
    //Чтобы удалить элемент нужно написать /deleteItem <ID>
    else if (msg.text.includes('/deleteItem')) {
        const id = parseInt(msg.text.split(' ')[1]); // Получаем ID элемента для удаления из команды
        connection.execute("DELETE FROM items WHERE id=?", [id], function (error, results, fields) {
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
    }
    else if (msg.text.includes('/getItemByID')) {
        const id = parseInt(msg.text.split(' ')[1]); // Получаем ID элемента для удаления из команды
        connection.execute("SELECT * FROM items WHERE id=?", [id], function (error, results, fields) {
            if (error) {
                bot.sendMessage(chatId, "Ошибка при выполнении запроса");
            } else {
                if (results && results.length === 1) {
                    const item = results[0];
                    bot.sendMessage(chatId, `(${item.id}) - ${item.name}: ${item.descript}`);
                }
            }
        });
    }
});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    bot.sendMessage(chatId, resp);
});
