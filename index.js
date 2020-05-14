const TelegramBot = require("node-telegram-bot-api");
const Bull = require("bull");


const TOKEN = process.env.BOT_TOKEN;

const botQueue = new Bull("bot-queue", "redis://redis:6379");
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

	try {
		
		let m = await bot.sendMessage(chatId, `${dice.emoji}: <code>${dice.value}</code>`, {
			parse_mode: "HTML",
			reply_to_message_id: messageId
		});
			
		console.log(`[Dice] ${dice.emoji}=>${dice.value}`);

		let job = await botQueue.add("delete", {
			messageId: m.message_id,
			chatId: m.chat.id
		}, {
			delay: 3600000,
			removeOnComplete: true
		});

		console.log(`[New job] id=${job.id}`);

	} catch(e) {
		console.log(e);
	}
})

botQueue.process("delete", async (job) => {
	let { messageId, chatId } = job.data;

	try {
		await bot.deleteMessage(chatId, messageId);
		console.log(`[Job] id=${job.id} processed`);
	} catch(e) {
		console.log(`[Job] id=${job.id} failed, error=${e}`);
	}
});
