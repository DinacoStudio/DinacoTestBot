//Главный файл бота
console.clear();

const Client = require('./structure/client.js');
const dotenv = require('dotenv').config();

const client = new Client();

client.RunBot(process.env.token);