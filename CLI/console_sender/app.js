const TelegramBot = require('node-telegram-bot-api');
const cli = require('commander');
require('dotenv').config();

const bot = new TelegramBot(process.env.T_TOKEN, { polling: true });
const chatID = 405485135

cli.command("message").action(async (msg) => {
	await bot.sendMessage(chatID, msg);
	process.exit(1);
	})
	.description('Send message to Telegram Bot')
	.argument('<message>')
	.alias('m');

cli.command("photo").action(async (msg) => {
	await bot.sendPhoto(chatID, msg);
	process.exit(1);
	})
	.description('Send photo to Telegram Bot. Drag and drop to console after p-flag')
	.argument('<path>')
	.alias('p');

cli.parse(process.argv)