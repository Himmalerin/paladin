const { channels } = require("../config.json");

module.exports = {
	name: "guildMemberRemove",
	async execute(member, client) {
		client.channels.cache
			.get(channels.log.portal.id)
			.send(`**${member.user.username}#${member.user.discriminator}** (<@${member.user.id}>) has **left** the server!`)
			.catch(console.error);
	},
};
