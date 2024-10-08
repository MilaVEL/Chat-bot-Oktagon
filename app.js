// подключение express
const express = require("express");
// создаем объект приложения
const app = express();
// определяем обработчик для маршрута "/"
app.get("/", function (request, response) {

    // отправляем ответ
    response.send("<h2>Привет, Октагон!</h2>");
});

app.get("/static", function (request, response) {

    response.send("<h2>header: “Hello” <br> body: “Octagon NodeJS Test</h2>");
});

app.use("/dynamic", function (request, response) {

    var a = request.query.a;
    var b = request.query.b;
    var c = request.query.c;
    var body = (a * b * c) / 3;
    if (body) {
        response.send(`<h1>header: Calculated </h1><p> body: ${body}</p>`);
    } else {
        response.send(`<h1>header: Error</h1>`);
    }
});
// начинаем прослушивать подключения на 3000 порту
app.listen(3000);
