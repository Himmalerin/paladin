const { channels } = require("../config.json");

module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		// Set up the button collector on the ready event instead of on the interactionCreate event to avoid errors
		const collector = (await client.channels.fetch(channels.reactions)).createMessageComponentCollector({
			componentType: "BUTTON",
		});

		collector.on("collect", async (i) => {
			const role = await i.member.guild.roles.fetch(i.customId);

			try {
				const hasRole = i.member.roles.cache.has(role.id);

				if (hasRole) {
					i.member.roles.remove(role.id).then(() =>
						i.reply({
							content: `Toggled role <@&${role.id}> **off**.`,
							ephemeral: true,
						})
					);
				} else {
					i.member.roles.add(role.id).then(() =>
						i.reply({
							content: `Toggled role <@&${role.id}> **on**.`,
							ephemeral: true,
						})
					);
				}
			} catch (error) {
				i.reply({
					content: `\`${error}\``,
					ephemeral: true,
				});
				console.error(error);
			}
		});

		collector.on("end", (collected) => {
			console.log(`Collected ${collected.size} interactions.`);
		});
	},
};
