const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { aboutBotEmbed } = require('../embeds/aboutBotEmbed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Info about the TimeChief bot'),

    async execute(interaction) {
        await interaction.reply({
            embeds: [aboutBotEmbed],
            flags: MessageFlags.Ephemeral
        });
    },
};
