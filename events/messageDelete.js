const { channels } = require("../config.json");

module.exports = {
	name: "messageDelete",
	async execute(message, client) {
		// Don't bother logging deletions if we don't have the full message
		if (message.author === null || message.content === null) {
			return;
		}

		client.channels.cache
			.get(channels.log.delete.id)
			.send({
				embeds: [
					{
						color: 0xed1515,
						title: `Message deleted in #${client.channels.cache.get(message.channelId).name}`,
						url: message.url,
						author: {
							name: `${message.author.username}#${message.author.discriminator} (${message.author.id})`,
							icon_url: message.author.displayAvatarURL(),
						},
						description: message.content.length < 2000 ? message.content : "*too large to display*",
						timestamp: new Date(),
					},
				],
			})
			.catch(console.error);
	},
};
