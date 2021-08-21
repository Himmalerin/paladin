module.exports = {
	name: "threadCreate",
	async execute(thread) {
		// Automatically join all threads so the bot can moderate them
		if (thread.joinable) thread.join();
	},
};
