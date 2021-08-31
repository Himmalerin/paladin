const { channels } = require("../config.json");

module.exports = {
	name: "guildMemberAdd",
	async execute(member, client) {
		client.channels.cache
			.get(channels.log.portal.id)
			.send(`**${member.user.username}#${member.user.discriminator}** (<@${member.user.id}>) has **joined** the server!`)
			.catch(console.error);
	},
};
