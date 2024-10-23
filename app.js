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
    if (typeof a !== 'number' || typeof b !== 'number' || typeof c !== 'number') {
        response.send("<b>header: Error</b><p>Body: One or more parameters are not numbers.</p>");
        return;
    }
    if (a <= 0 || b <= 0 || c <= 0) {
        response.send("<b>header: Error</b><p>Body: One or more parameters must be positive numbers.</p>");
        return;
    }

    const body = (a * b * c) / 3;
    response.send(`<b>header: Calculated</b><p>body: ${body}</p>`);
});
// начинаем прослушивать подключения на 3000 порту
app.listen(3000);
