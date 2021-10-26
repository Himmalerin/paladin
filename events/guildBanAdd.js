const { channels } = require("../config.json");

module.exports = {
	name: "guildBanAdd",
	async execute(ban, client) {
		const banLogChannel = client.channels.cache.get(channels.log.ban.id);

		const fetchedLogs = await ban.guild.fetchAuditLogs({
			limit: 1,
			type: "MEMBER_BAN_ADD",
		});
		// Since there's only 1 audit log entry in this collection, grab the first one
		const banLog = fetchedLogs.entries.first();

		// Perform a coherence check to make sure that there's *something*
		if (!banLog) {
			banLogChannel
				.send({
					embeds: [
						{
							color: 0xed1515,
							description: [
								`Most details about this ban are unknown, contact a moderator for more information.`,
								`**Target**: \`${ban.user.username}#${ban.user.discriminator}\` (<@${ban.user.id}>)`,
								`**Action**: Ban`,
							].join("\n"),
						},
					],
				})
				.catch((error) => console.error(error));

			return;
		}

		// Now grab the user object of the person who banned the member
		// Also grab the target of this action to double-check things
		const { reason, executor, target } = banLog;

		// Update the output with a bit more information
		// Also run a check to make sure that the log returned was for the same banned member
		if (target.id === ban.user.id) {
			banLogChannel
				.send({
					embeds: [
						{
							color: 0xed1515,
							author: {
								name: `${executor.username}#${executor.discriminator} (${executor.id})`,
								icon_url: executor.displayAvatarURL(),
							},
							description: [
								`**User**: \`${target.username}#${target.discriminator}\` (<@${target.id}>)`,
								`**Action**: Ban`,
								`**Reason**: ${reason ?? `Contact <@${executor.id}> for details.`}`,
							].join("\n"),
							timestamp: banLog.createdAt,
						},
					],
				})
				.catch((error) => console.error(error));
		} else {
			banLogChannel
				.send({
					embeds: [
						{
							color: 0xed1515,
							description: [
								`Most details about this ban are unknown, contact a moderator for more information.`,
								`**Target**: \`${ban.user.username}#${ban.user.discriminator}\` (<@${ban.user.id}>)`,
								`**Action**: Ban`,
							].join("\n"),
						},
					],
				})
				.catch((error) => console.error(error));
		}
	},
};
