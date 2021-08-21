const { Permissions } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { channels } = require("../config.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("kick")
		.setDescription("Kicks the target. Requires the KICK_MEMBERS permisson")
		.addUserOption((option) => option.setName("target").setDescription("Target of the kick").setRequired(true))
		.addStringOption((option) => option.setName("reason").setDescription("Reason for the kick")),
	async execute(interaction) {
		// Make sure the user trying to ban someone is able to ban users
		const author = await interaction.guild.members.cache.get(interaction.user.id);
		if (author.permissions.has(Permissions.FLAGS.KICK_MEMBERS) === false) {
			return interaction.reply("You need the `KICK_MEMBERS` permission to do that.");
		}
		// Make sure the bot is able to ban users
		const bot = await interaction.guild.members.cache.get(interaction.client.user.id);
		if (bot.permissions.has(Permissions.FLAGS.KICK_MEMBERS) === false) {
			return interaction.reply("I need the `KICK_MEMBERS` permission to do that.");
		}

		// Get the command options
		const target = interaction.options.getUser("target");
		const reason = interaction.options.getString("reason");

		// Make sure the target is in the server before kicking them
		if ((await interaction.guild.members.cache.get(target.id)) === undefined) {
			return interaction.reply("That user isn't in this server.");
		}

		interaction.guild.members
			.kick(target, {
				reason: reason ?? `Contact ${author.user.username}#${author.user.discriminator} (${author.user.id}) for details.`,
			})
			.then(() => {
				const logChannel = interaction.client.channels.cache.get(channels.log.public);
				logChannel.send({
					embeds: [
						{
							color: 0xf67300,
							author: {
								name: `${author.user.username}#${author.user.discriminator} (${author.user.id})`,
								icon_url: author.user.displayAvatarURL(),
							},
							description: [
								`**User**: \`${target.username}#${target.discriminator}\` (<@${target.id}>)`,
								`**Action**: Kick`,
								`**Reason**: ${reason ?? `Contact <@${user.id}> for details.`}`,
							].join("\n"),
							timestamp: new Date(),
						},
					],
				});
			})
			.then(() => interaction.reply(`User successfully kicked!`))
			.catch((error) => {
				console.error(error);
				return interaction.reply(`Something went wrong: \`${error}\``);
			});
	},
};
