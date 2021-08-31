const { channels } = require("../config.json");

module.exports = {
	name: "messageUpdate",
	async execute(oldMessage, newMessage, client) {
		// Check to see if oldMessage.content exists and isn't too long to send.
		// I would prefer using a ternary operator here (like I do below for the newMessage.content),
		// but there's enough logic I feel like it reads better as an if statement
		let oldContent = "";
		if (oldMessage.content !== null && oldMessage.content.length < 2000) {
			oldContent = oldMessage.content;
		} else {
			oldContent = "*original version was uncached or too large to display*";
		}

		const editChannel = client.channels.cache.get(channels.log.edit.id);
		editChannel.send({
			embeds: [
				{
					title: `Message Context`,
					url: newMessage.url,
					author: {
						name: `${newMessage.author.username}#${newMessage.author.discriminator} (${newMessage.author.id})`,
						icon_url: newMessage.author.displayAvatarURL(),
					},
					description: [
						`**Before:** ${oldContent}`,
						`**After:** ${newMessage.content.length < 2000 ? newMessage.content : "*too large to display*"}`,
					].join("\n"),
					timestamp: new Date(),
				},
			],
		});
	},
};
