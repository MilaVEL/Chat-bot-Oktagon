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
    
    const { a, b, c } = request.query;
    const body = (a * b * c) / 3;
    response.send(body ? `<b>header: Calculated</b><p>body: ${body}</p>` : `<b>header: Error</b>`);

});
// начинаем прослушивать подключения на 3000 порту
app.listen(3000);
