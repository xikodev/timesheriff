const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('List all bot commands'),

    async execute(interaction) {
        const commandList = interaction.client.commands.map(cmd => {
            return `• \`/${cmd.data.name}\` — ${cmd.data.description}`;
        }).join('\n');

        await interaction.reply({
            content: `🛠️ **TimeSheriff Commands**\n\n${commandList}\n\nUse \`/settimezone\` first to configure your local time.`,
            flags: MessageFlags.Ephemeral
        });
    },
};
