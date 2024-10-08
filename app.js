// подключение express
const express = require("express");
// создаем объект приложения
const app = express();
// определяем обработчик для маршрута "/"
app.get("/", function (request, response) {

    // отправляем ответ
    response.send("<h2>Привет, Октагон!</h2>");
});
// начинаем прослушивать подключения на 3000 порту
app.listen(3000);