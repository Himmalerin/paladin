const { channels } = require("../config.json");

module.exports = {
	name: "guildBanRemove",
	async execute(ban, client) {
		const unbanLogChannel = client.channels.cache.get(channels.log.ban.id);

		const fetchedLogs = await ban.guild.fetchAuditLogs({
			limit: 1,
			type: "MEMBER_BAN_REMOVE",
		});
		// Since there's only 1 audit log entry in this collection, grab the first one
		const unbanLog = fetchedLogs.entries.first();


		// Perform a coherence check to make sure that there's *something*
		if (!unbanLog) {
			unbanLogChannel
				.send({
					embeds: [
						{
							color: 0x1d99d3,
							description: [
								`Most details about this unban are unknown, contact a moderator for more information.`,
								`**Target**: \`${ban.user.username}#${ban.user.discriminator}\` (<@${ban.user.id}>)`,
								`**Action**: Unban`,
							].join("\n"),
						},
					],
				})
				.catch((error) => console.error(error));

			return;
		}

		// Now grab the user object of the person who banned the member
		// Also grab the target of this action to double-check things
		const { reason, executor, target } = unbanLog;
		console.log(unbanLog);

		// Update the output with a bit more information
		// Also run a check to make sure that the log returned was for the same banned member
		if (target.id === ban.user.id) {
			unbanLogChannel
				.send({
					embeds: [
						{
							color: 0x1d99d3,
							author: {
								name: `${executor.username}#${executor.discriminator} (${executor.id})`,
								icon_url: executor.displayAvatarURL(),
							},
							description: [
								`**User**: \`${target.username}#${target.discriminator}\` (<@${target.id}>)`,
								`**Action**: Unban`,
								`**Reason**: ${reason ?? `Contact <@${executor.id}> for details.`}`,
							].join("\n"),
							timestamp: unbanLog.createdAt,
						},
					],
				})
				.catch((error) => console.error(error));
		} else {
			unbanLogChannel
				.send({
					embeds: [
						{
							color: 0x1d99d3,
							description: [
								`Most details about this unban are unknown, contact a moderator for more information.`,
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
