const express = require('express');

const server = express();

server.use(express.json());

const users = ['Kaik', 'Joao', 'Diego'];

// Rota Busca todos Users
server.get('/users', (req, res) => {
  return res.json(users)
});

// Route params = /users/1
// Rota Busca por ID
server.get('/users/:index', (req, res) => {
  const { index } = req.params;

  return res.json(users[index]);
});

// Request body = { "name": "Kaik", "email": "kaik@gmail.com" } -- JSON
//Rota CREATE
server.post('/users', (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

// Rota Delete 
server.delete('/users/:index', (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.json(users);
});

// Rota Update Editar
server.put('users/:index', (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

server.listen(3000);

/* 

  localhost:3000/teste

  Query params = ?teste=1 

server.get('/teste', (req, res) => {
  const nome = req.query.nome;

  return res.json({ message:`Hello ${nome}` });
});

// const = constante o valor nunca muda

*/