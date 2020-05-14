require("dotenv").config()

const TelegramBot = require("node-telegram-bot-api");
const TOKEN = process.env.BOT_TOKEN;

const bot = new TelegramBot(TOKEN);

(async function() {
	await bot.startPolling();
	console.log("Bot started!");	
})();

bot.on('message', async (msg) => {
	let { chat, message_id: messageId, dice } = msg;
	let { id: chatId } = chat;

	if(dice === undefined) {
		return;
	}

	await bot.sendMessage(chatId, `${dice.emoji}: <code>${dice.value}</code>`, {
		parse_mode: "HTML",
		reply_to_message_id: messageId
	})
})
