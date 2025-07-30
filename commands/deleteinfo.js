const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const {User} = require('../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleteinfo')
        .setDescription('Delete your timezone information'),

    async execute(interaction) {
        const userId = interaction.user.id;

        try {
            await User.delete(userId);

            return interaction.reply({
                content: `✅ Your information has been deleted.`,
                flags: MessageFlags.Ephemeral
            });
        } catch (err) {
            console.error(err);
            return interaction.reply({
                content: '⚠️ Failed to delete user information.',
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
