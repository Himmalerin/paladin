const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder().setName("ping").setDescription("Check the bot's response times"),
	async execute(interaction) {
		const sent = await interaction.reply({ content: "Pinging...", ephemereal: true, fetchReply: true });
		interaction.editReply([
			`💓 · ${interaction.client.ws.ping}ms`,
			`⏱️ · ${sent.createdTimestamp - interaction.createdTimestamp}ms`
		].join("\n"));
	},
};
