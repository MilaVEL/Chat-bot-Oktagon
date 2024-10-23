const { bot, api } = require('./token.js'); // Импортируем токен
const request = require('request');

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

        command: "/weather",
        description: "Погода"

    },
    {

        command: "/motivation",
        description: "Взбодриться"

    },
]
bot.setMyCommands(commands);


// Matches "/echo [whatever]"
bot.onText(/\/start/, (msg, match) => {
    bot.sendMessage(msg.chat.id, `Привет, @${msg.chat.username}!`);
});

// Matches "/echo [whatever]"
bot.onText(/\/weather/, (msg) => {
    getWeather(msg.text, text => {
        bot.sendMessage(msg.chat.id, text);
    });

});

bot.onText(/\/motivation/, (msg, match) => {
    bot.sendMessage(msg.chat.id, getMotivation());

});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (msg.text === '/help') {
        bot.sendMessage(chatId, "Раздел помощи\n\n<b>help</b> - основные команды бота\n<b>weather</b> - узнать погоду в Улан-Удэ\n<b>motivation</b> - прочитать борящую цитату от бота\n", {
            parse_mode: "HTML"
        });
    }
});



// Запуск задачи cron каждый день в 4:00 по Москве (в 9:00 в Улан-УДэ)
const cron = require('cron');
function sendTime() {
    new cron.CronJob('0 4 * * *', // cronTime
        function () {
            bot.sendMessage(msg.chat.id, getMotivation());
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

function getWeather(lat, lon, callback) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=51.82&lon=107.60&appid=${api}&lang=ru&units=metric`;
    request(url, function (error, response, body) {
        if (error) return 'Ошибка', error;
        // console.log(body);
        let inf = JSON.parse(body)
        // console.log(inf);
        text = `Сегодня в ${inf.name}:\n${inf.weather[0].description}\nТемпература: ${inf.main.temp}℃ (ощущается как ${inf.main.feels_like}℃) \nВлажность ${inf.main.humidity}% \nВетер ${inf.wind.speed}м/с`;
        callback(text);
    });
}

function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getMotivation(){
    const quotes = [
        "Каждый день - новый шанс стать лучше, чем вчера.",
        "Не ждите идеального момента, создайте его сами.",
        "Лучший способ предсказать будущее - создать его.",
        "Стремитесь не к успеху, а к ценностям, которые он несет.",
        "Пусть неудачи станут вашими учителями, а не врагами.",
        "Ваше завтра начинается сегодня.",
        "Будьте терпеливы, потому что великие дела требуют времени.",
        "Вдохновение приходит к тем, кто трудится.",
        "Никогда не сдавайтесь. Никогда не сдавайтесь.",
        "Делайте то, что вы любите, и любите то, что вы делаете.",
        "Развитие требует времени, усилия и терпения.",
        "Будьте открытыми к новым возможностям и опыту.",
        "Цените каждую возможность учиться и расти.",
        "Ставьте перед собой цели и работайте над их достижением.",
        "Помните, что успех приходит к тем, кто готов идти на риск.",
        "Не бойтесь совершать ошибки – они делают вас сильнее.",
        "Верьте в себя и свои способности.",
        "Проявляйте решительность и настойчивость в достижении своих целей.",
        "Будьте благодарны за все, что у вас есть.",
        "Поддерживайте позитивное отношение и оптимизм.",
        "Не сравнивайте себя с другими – сосредоточьтесь на своем собственном пути.",
        "Не забывайте наслаждаться процессом.",
        "За каждым великим достижением стоит множество маленьких шагов.",
        "Мечтайте о большом, но начинайте с малого.",
        "Будьте примером для других.",
        "Развивайте свою страсть и будьте преданными своему делу.",
        "Оставайтесь гибкими и адаптируемыми.",
        "Никогда не переставайте учиться и развиваться."
    ];
    // console.log(quotes.length);
    const emojis = ['😁', '😃', '😄', '😆', '😉', '😊', '😋', '😎', '🥰', '🤗', '🧡', '💛', '💚', '💙', '💜', '😁', '😃', '😄', '😆', '😉', '😊', '😋', '😎', '🥰', '🤗', '🧡', '💛', '💚'];
    // console.log(emojis.length);
    i = getRandomNumber(1, 28);
    text = quotes[i] + emojis[i];
    return text;

}
