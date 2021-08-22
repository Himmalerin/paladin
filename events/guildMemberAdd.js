const { channels } = require("../config.json");

module.exports = {
	name: "guildMemberAdd",
	async execute(member, client) {
		const channel = client.channels.cache.get(channels.portal.id);
		channel.send(`**${member.user.username}#${member.user.discriminator}** (<@${member.user.id}>) has **joined** the server!`);
	},
};
