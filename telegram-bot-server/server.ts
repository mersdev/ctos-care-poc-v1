// import * as express from 'express';
import * as bodyParser from 'body-parser';
// import * as TelegramBot from 'node-telegram-bot-api';
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// Replace with your bot's token from BotFather
const token = '7217548058:AAG7snFXMTSjsEDpEmide6IYwJyCwVUCsOU';
const bot = new TelegramBot(token, { polling: true });

const app = express();
app.use(bodyParser.json());  // For parsing application/json
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

// Endpoint to send message to Telegram
app.post('/api/send-telegram-message', (req: any, res: any) => {
  const { chatId, message } = req.body;

  if (!chatId || !message) {
    return res.status(400).send('chatId and message are required.');
  }

  // Send the message to the user
  bot.sendMessage(chatId, message, { parse_mode: 'Markdown' })
    .then(() => {
    console.log('received message', chatId, message)
      res.send('Message sent successfully.');
    })
    .catch((error) => {
      res.status(500).send('Error sending message: ' + error.message);
    });
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    console.log(`Chat ID: ${chatId}`);  // Log chat ID to the console
    bot.sendMessage(chatId, `Your chat ID is: ${chatId}`);

    // bot.sendMessage(groupChatId, `Received message from ${chatId}: ${message}`);

  });

// Start the server
const port = 3005;
app.listen(port, () => {
  console.log(`Telegram bot server running on port ${port}`);
});

// Group Chat ID -1002319055220