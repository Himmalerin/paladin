const { channels } = require("../config.json");

module.exports = {
	name: "guildMemberRemove",
	async execute(member, client) {
		const channel = client.channels.cache.get(channels.log.portal.id);
		channel.send(`**${member.user.username}#${member.user.discriminator}** (<@${member.user.id}>) has **left** the server!`);
	},
};
