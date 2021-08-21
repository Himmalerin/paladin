const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder().setName("bot-info").setDescription("Displays information about the bot"),
	async execute(interaction) {
		interaction.reply(
			[
				`Hey there, I'm ${interaction.client.user.username}, your local moderation bot!`,
				`I'm open-source and available under the EUPL license.  You can check out my code here: <https://github.com/himmalerin/paladin>.`,
			].join("\n")
		);
	},
};
