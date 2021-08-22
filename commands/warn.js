const { Permissions } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { channels } = require("../config.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("warn")
		.setDescription("Warns the target. Requires the KICK_MEMBERS permisson")
		.addUserOption((option) => option.setName("target").setDescription("Target of the warn").setRequired(true))
		.addStringOption((option) => option.setName("reason").setDescription("Reason for the warn")),
	async execute(interaction) {
		// Make sure the user trying to ban someone is able to ban users
		const author = await interaction.guild.members.cache.get(interaction.user.id);
		if (author.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) === false) {
			return interaction.reply("You need the `MANAGE_MESSAGES` permission to do that.");
		}
		// Make sure the bot is able to ban users
		const bot = await interaction.guild.members.cache.get(interaction.client.user.id);
		if (bot.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) === false) {
			return interaction.reply("I need the `MANAGE_MESSAGES` permission to do that.");
		}

		// Get the command options
		const target = interaction.options.getUser("target");
		const reason = interaction.options.getString("reason");

		// Make sure the target is in the server before kicking them
		if ((await interaction.guild.members.cache.get(target.id)) === undefined) {
			return interaction.reply("That user isn't in this server.");
		}

		const logChannel = interaction.client.channels.cache.get(channels.log.warn.id);

		logChannel
			.send({
				embeds: [
					{
						color: 0xfdbc4b,
						author: {
							name: `${author.user.username}#${author.user.discriminator} (${author.user.id})`,
							icon_url: author.user.displayAvatarURL(),
						},
						description: [
							`**User**: \`${target.username}#${target.discriminator}\` (<@${target.id}>)`,
							`**Action**: Warn`,
							`**Reason**: ${reason ?? `Contact <@${message.author.id}> for details.`}`,
						].join("\n"),
						timestamp: new Date(),
					},
				],
			})
			.then(() => interaction.reply(`User successfully warned!`))
			.catch((error) => {
				console.error(error);
				return interaction.reply(`Something went wrong: \`${error}\``);
			});
	},
};
