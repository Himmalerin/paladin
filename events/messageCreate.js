const { channels, bannedWords } = require("../config.json");

module.exports = {
	name: "messageCreate",
	async execute(message, client) {
		if (message.author.bot) {
			return;
		}

		const msg = message.content.toLowerCase();

		// "satiated" words should only be matched on their own, not inside of other words
		const hasSatiatedBannedWord = bannedWords.satiated.find((word) => {
			if (msg.split(" ").includes(word)) {
				return word;
			}
		});

		// "hungry" words should be matched if they're anywhere inside of the message
		const hasHungryBannedWord = bannedWords.hungry.find((word) => {
			if (msg.includes(word)) {
				return word;
			}
		});

		const word = hasSatiatedBannedWord || hasHungryBannedWord;

		if (word) {
			const logChannel = client.channels.cache.get(channels.log.public);
			logChannel.send({
				embeds: [
					{
						color: 0xfdbc4b,
						author: {
							name: `${client.user.username}#${client.user.discriminator} (${client.user.id})`,
							icon_url: client.user.displayAvatarURL(),
						},
						description: [
							`**User**: \`${message.author.username}#${message.author.discriminator}\` (<@${message.author.id}>)`,
							`**Action**: Warn`,
							`**Reason**: Used banned word (||${word}||)`,
						].join("\n"),
						timestamp: new Date(),
					},
				],
			});

			await message.reply(`One of the words in your message, ||${word}||, is not allowed in this server.`);
			message.delete().catch((error) => message.channel.send(`\`${error}\``));
		}
	},
};
