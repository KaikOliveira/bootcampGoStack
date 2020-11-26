const express = require('express');

const server = express();

server.use(express.json());

const users = ['Kaik', 'Joao', 'Diego'];

// Middlewares
function cheackUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'User name is required' });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: 'User does not exists' });
  }
  
  req.user = user;

  return next();
}


// Rota Busca todos Users
server.get('/users', (req, res) => {
  return res.json(users)
});

// Route params = /users/1
// Rota Busca por ID
server.get('/users/:index', checkUserInArray, (req, res) => {
  return res.json(req.user);
});

// Request body = { "name": "Kaik", "email": "kaik@gmail.com" } -- JSON
//Rota CREATE
server.post('/users', cheackUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

// Rota Delete 
server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.json(users);
});

// Rota Update Editar
server.put('users/:index', checkUserInArray, cheackUserExists, (req, res) => {
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