module.exports = {
	name: "interactionCreate",
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		const { commandName } = interaction;
		if (!interaction.client.commands.has(commandName)) return;

		try {
			await interaction.client.commands.get(commandName).execute(interaction);
		} catch (error) {
			console.error(error);
			return interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
		}
	},
};
