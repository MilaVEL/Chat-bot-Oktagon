
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

    },
]
bot.setMyCommands(commands);

bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // Проверяем, является ли это первым сообщением от пользователя
    if (msg.text === '/start') {
        bot.sendMessage(chatId, 'Привет, Октагон!');
        sendTime();
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
        connection.execute("SELECT * FROM items", function (error, results) {
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
        connection.execute("DELETE FROM items WHERE id=?", [id], function (error, results) {
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

//QR-код
bot.onText(/^\!qr/, function (msg) {
    console.log(msg);
    var userId = msg.from.id;
    var data = msg.text.substring(3).trim();
    var imageqr = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + data;
    bot.sendMessage(msg.chat.id, "[✏️](" + imageqr + ")Qr code de: " + data, { parse_mode: "Markdown" });
});
//Скриншот сайта
bot.onText(/^\!webscr/, function (msg) {
    console.log(msg);
    var url = msg.text.substring(8).trim();
    var image = "https://api.letsvalidate.com/v1/thumbs/?url=" + url + "&width=1280&height=720";

    var options = {
        parse_mode: "Markdown",
    };
    bot.sendMessage(msg.chat.id, "[📷](" + image + ") Скриншот из сайта: " + url, options);
});

//Получение id пользователя
bot.onText(/.*/, (msg) => {
    const userId = msg.from.id;
    let now = new Date();
    // Преобразование даты в строку ISO
    let dateAsIsoString = now.toISOString();
    // Удаление части после буквы 'T'
    let nowDate = dateAsIsoString.slice(0, 10);
    connection.execute("SELECT * FROM users WHERE id=?", [userId], function (error, results, fields) {
        if (error) {
            console.log("Ошибка при выполнении запроса");
        } else {
            if (results && results.length === 1) {
                connection.execute("UPDATE `users` SET `lastMessage` = ? WHERE `users`.`ID` = ?;", [nowDate, userId], function (error, results, fields) {
                    if (error) {
                        console.log("Ошибка при обновлении пользователя в БД");
                    }
                });

            } else {
                connection.execute("INSERT INTO `users` (`ID`, `lastMessage`) VALUES (?, ?);", [userId, nowDate], function (error, results, fields) {
                    if (error) {
                        console.log("Ошибка при добавлении пользователя в БД");
                    }
                });

            }

        }
    });





});


// Запуск задачи cron каждый день в 13:00 по Москве
const cron = require('cron');
function sendTime() {
    new cron.CronJob('0 13 * * *', // cronTime
        function () {
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

            connection.query("SELECT * FROM users WHERE lastMessage < ?", [twoDaysAgo.toISOString()], function (error, results, fields) {
                if (error) {
                    console.log("Ошибка при выполнении запроса");
                } else {
                    results.forEach((user) => {
                        connection.execute("SELECT * FROM items", function (error, results) {
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
                }
            });
        }, // onTick
        null, // onComplete
        true, // start
        'Europe/Moscow' // timeZone
    );
}





// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    bot.sendMessage(chatId, resp);
});
