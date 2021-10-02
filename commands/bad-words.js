const { SlashCommandBuilder } = require("@discordjs/builders");
const { badWords } = require("../config.json");

module.exports = {
	data: new SlashCommandBuilder().setName("bad-words").setDescription(`Sends the user a list of the server's "bad words"`),
	async execute(interaction) {
		const badWordList = [...badWords.lazy, ...badWords.greedy].sort();

		interaction.reply({ content: badWordList.join("\n"), ephemeral: true });
	},
};
