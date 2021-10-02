const { channels } = require("../config.json");

module.exports = {
	name: "messageReactionAdd",
	async execute(reaction, _user, client) {
		if (reaction._emoji.name !== channels.scrapbook.emoji) {
			return;
		}

		if (reaction.partial) {
			try {
				await reaction.fetch();
			} catch (error) {
				console.error("Something went wrong when fetching the message:", error);
				return;
			}
		}

		const imageAttachment = reaction.message.attachments.find((a) => a.contentType.startsWith("image/"));
		const videoAttachment = reaction.message.attachments.find((a) => a.contentType.startsWith("video/"));

		if (reaction.count === channels.scrapbook.minimumReactions) {
			client.channels.cache
				.get(channels.scrapbook.id)
				.send({
					embeds: [
						{
							title: `Message Context`,
							url: reaction.message.url,
							author: {
								name: `${reaction.message.author.username}#${reaction.message.author.discriminator} (${reaction.message.author.id})`,
								icon_url: reaction.message.author.displayAvatarURL(),
							},
							description: reaction.message.content.length < 2000 ? reaction.message.content : "Message too long to display!",
							...(imageAttachment && { image: { url: imageAttachment.url } }),
							timestamp: new Date(),
						},
					],
					// Videos can't be placed inside embeds like images can so attach them as regular files instead
					// Has the unfortunate effect of making the video appear above the embed, but whatever
					files: [...(videoAttachment ? videoAttachment.url : [])],
				})
				.catch(console.error);
		}
	},
};
