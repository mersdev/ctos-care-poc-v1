"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as express from 'express';
var bodyParser = require("body-parser");
// import * as TelegramBot from 'node-telegram-bot-api';
var TelegramBot = require('node-telegram-bot-api');
var express = require('express');
// Replace with your bot's token from BotFather
var token = '7217548058:AAG7snFXMTSjsEDpEmide6IYwJyCwVUCsOU';
var bot = new TelegramBot(token, { polling: true });
var app = express();
app.use(bodyParser.json()); // For parsing application/json
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
// Endpoint to send message to Telegram
app.post('/api/send-telegram-message', function (req, res) {
    var _a = req.body, chatId = _a.chatId, message = _a.message;
    if (!chatId || !message) {
        return res.status(400).send('chatId and message are required.');
    }
    // Send the message to the user
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' })
        .then(function () {
        console.log('received message', chatId, message);
        res.send('Message sent successfully.');
    })
        .catch(function (error) {
        res.status(500).send('Error sending message: ' + error.message);
    });
});
bot.on('message', function (msg) {
    var chatId = msg.chat.id;
    console.log("Chat ID: ".concat(chatId)); // Log chat ID to the console
    bot.sendMessage(chatId, "Your chat ID is: ".concat(chatId));
    // bot.sendMessage(groupChatId, `Received message from ${chatId}: ${message}`);
});
// Start the server
var port = 3005;
app.listen(port, function () {
    console.log("Telegram bot server running on port ".concat(port));
});
// Group Chat ID -1002319055220
