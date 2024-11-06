const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'todo_app'
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL!');
});

app.get('/tasks', (req, res) => {
    connection.query('SELECT * FROM tasks', (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao obter tarefas');
        }
        res.json(results);
    });
});

app.post('/tasks', (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).send('Título é obrigatório');
    }
    connection.query('INSERT INTO tasks (title) VALUES (?)', [title], (err, results) => {
        if (err) {
            console.error('Erro ao adicionar tarefa:', err);
            return res.status(500).send('Erro ao adicionar tarefa');
        }
        res.status(201).send({ id: results.insertId, title });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
