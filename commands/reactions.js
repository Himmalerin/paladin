const { Permissions } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { channels, reactionRoles } = require("../config.json");

module.exports = {
	data: new SlashCommandBuilder().setName("reactions").setDescription("Sets up reaction roles. Requires the MANAGE_ROLES permisson"),
	async execute(interaction) {
		// Make sure the user trying to ban someone actually has the ability to do so before doing anything
		const user = await interaction.guild.members.fetch(interaction.user.id);
		if (user.permissions.has(Permissions.FLAGS.MANAGE_ROLES) === false) {
			return interaction.reply("You need the `MANAGE_ROLES` permission to do that.");
		}

		const location = await interaction.client.channels.fetch(channels.reactions.id);

		reactionRoles.forEach((group) => {
			const buttons = [];
			const embedDescription = [];
			for (const role of group.roles) {
				buttons.push({
					type: 2,
					style: 2,
					custom_id: role.id,
					label: role.label,
					emoji: {
						name: role.emoji.name,
						id: role.emoji.id,
					},
				});

				embedDescription.push(`${role.emoji.name} · <@&${role.id}>`);
			}

			const rows = [];
			for (let index = 0; index < Math.ceil(buttons.length / 5); index++) {
				rows.push({
					type: 1,
					components: [],
				});
			}

			let buttonCounter = 0;
			let rowCounter = 0;
			for (const button of buttons) {
				if (buttonCounter === 5) {
					buttonCounter = 0;
					rowCounter++;
				}

				rows[rowCounter].components.push(button);

				buttonCounter++;
			}

			location
				.send({
					embeds: [
						{
							title: `**${group.name}**`,
							description: embedDescription.join("\n"),
						},
					],
					components: rows,
				})
				.catch(console.error);
		});

		interaction.reply(`Setting up reaction roles in <#${location.id}>!`);
	},
};
