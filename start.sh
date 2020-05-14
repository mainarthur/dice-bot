if [ ! -f .env ]; then
	echo "bot token: "
	read TOKEN
	echo "BOT_TOKEN=$TOKEN" >> .env
fi

node index.js
