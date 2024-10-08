// подключение express
const express = require("express");
// создаем объект приложения
const app = express();



const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "chatbottests",
    password: ""
});
connection.connect(function (err) {
    if (err) {
        return console.error("Ошибка: " + err.message);
    }
    else {
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});


app.get("/", function (request, response) {
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


//Чтение массива
app.use("/getAllItems", function (request, response) {
    connection.execute("SELECT * FROM items", function (error, results, fields) {
        if (error) {
            response.send("Ошибка при выполнении запроса");
        } else {
            response.json(results);
        }
    });
});


//Добавление в массив
app.use("/addItem", function (request, response) {

    var name = request.query.name;
    var desc = request.query.desc;

    if (!name || !desc) {
        return response.json(null); // Возвращаем null, если параметры некорректные
    } else {
        const sql = `INSERT INTO items(id, name, descript) VALUES(NULL, '${name}', '${desc}')`;

        connection.query(sql, function (err, results) {
            if (err) console.log(err);
            console.log(results);
            response.send("Объект добавлен");
        });
    }

});

//Удаление объекта
app.use("/deleteItem", function (request, response) {

    var id = request.query.id;

    const sql = `DELETE FROM items WHERE id=?`;

    connection.query(sql, id, function (err, results) {
        if (err) console.log(err);
        if (results.affectedRows === 0) {
            return response.json({});
        }
        response.send("Объект удалён");
    });

});


//Обновление объекта
app.use("/updateItem", function (request, response) {

    var id = request.query.id;
    var name = request.query.name;
    var desc = request.query.desc;

    // Проверка на наличие всех параметров
    if (!id || !name || !desc) {
        return response.json(null); // Возвращаем null, если параметры некорректные
    } else {
        const sql = `UPDATE items SET name = '${name}', descript = '${desc}' WHERE id = ${id}`;

        connection.query(sql, function (err, results) {
            if (err) console.log(err);
            if (results.affectedRows === 0) {
                return response.json({});
            }
            // Если обновление прошло успешно
            response.send("Объект обновлён");
        });
    }
});


// начинаем прослушивать подключения на 3000 порту
app.listen(3000);
