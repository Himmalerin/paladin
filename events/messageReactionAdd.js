const { channels } = require("../config.json");

module.exports = {
	name: "messageReactionAdd",
	async execute(reaction, _user, client) {
		if (reaction._emoji.name !== channels.scrapbook.emoji) {
			return;
		}

		if (reaction.count >= channels.scrapbook.minimumReactions) {
			const scrapbookChannel = client.channels.cache.get(channels.scrapbook.id);

			scrapbookChannel.send({
				embeds: [
					{
						title: `Message Context`,
						url: reaction.message.url,
						author: {
							name: `${reaction.message.author.username}#${reaction.message.author.discriminator} (${reaction.message.author.id})`,
							icon_url: reaction.message.author.displayAvatarURL(),
						},
						description: reaction.message.content.length < 2000 ? reaction.message.content : "Message too long to display!",
						...(reaction.message.attachments.first() && { image: { url: reaction.message.attachments.first().url } }),
						timestamp: new Date(),
					},
				],
			});
		}
	},
};
