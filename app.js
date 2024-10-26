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
    //const { a, b, c } = request.query;

    //Переделывает массив
    const params = ['a', 'b', 'c'].map(key => parseFloat(request.query[key]));

    //Проверка наличия результата
    //соответствует ли хотя бы один элемент массива условию
    if(params.some(element => element === isNaN)){
        
    }else if (a <= 0 || b <= 0 || c <= 0) {
        response.send("<b>header: Error</b><p>Body: One or more parameters must be positive numbers.</p>");
        return;
    }else{
        const body = (params[0] * params[1] * params[2]) / 3;
        response.send(`<b>header: Calculated</b><p>body: ${body}</p>`); 
    }

});
// начинаем прослушивать подключения на 3000 порту
app.listen(3000);
