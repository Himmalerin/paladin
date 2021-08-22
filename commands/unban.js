const { Permissions } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { channels } = require("../config.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("unban")
		.setDescription("Unbans the target. Requires the BAN_MEMBERS permisson")
		.addUserOption((option) => option.setName("target").setDescription("Target of the unban").setRequired(true))
		.addStringOption((option) => option.setName("reason").setDescription("Reason for the unban")),
	async execute(interaction) {
		// Make sure the user trying to unban someone is able to do so
		const author = await interaction.guild.members.fetch(interaction.user.id);
		if (author.permissions.has(Permissions.FLAGS.BAN_MEMBERS) === false) {
			return interaction.reply("You need the `BAN_MEMBERS` permission to do that.");
		}
		// Make sure the bot is able to ban users
		const bot = await interaction.guild.members.fetch(interaction.client.user.id);
		if (bot.permissions.has(Permissions.FLAGS.BAN_MEMBERS) === false) {
			return interaction.reply("I need the `BAN_MEMBERS` permission to do that.");
		}

		// Get the command options
		const target = interaction.options.getUser("target");
		const reason = interaction.options.getString("reason");

		// Make sure the target is already banned before unbanning them
		const banList = await interaction.guild.bans.fetch();
		if ((await banList.has(target.id)) === false) {
			return interaction.reply("That user isn't banned!");
		}

		interaction.guild.members
			.unban(target, {
				reason: reason ?? `Contact ${author.user.username}#${author.user.discriminator} (${author.user.id}) for details.`,
			})
			.then(() => interaction.reply(`User successfully unbanned!`))
			.then(() => {
				const logChannel = interaction.client.channels.cache.get(channels.log.unban.id);
				logChannel.send({
					embeds: [
						{
							color: 0x1d99d3,
							author: {
								name: `${author.user.username}#${author.user.discriminator} (${author.user.id})`,
								icon_url: author.user.displayAvatarURL(),
							},
							description:
								`**User**: \`${target.username}#${target.discriminator}\` (<@${target.id}>)\n` +
								"**Action**: Unban\n" +
								`**Reason**: ${reason ?? `Contact <@${user.id}> for details.`}`,
							timestamp: new Date(),
						},
					],
				});
			})
			.catch((error) => {
				console.error(error);
				return interaction.reply(`Something went wrong: \`${error}\``);
			});
	},
};
