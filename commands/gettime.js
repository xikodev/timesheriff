const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const moment = require('moment-timezone');
const User = require('../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gettime')
        .setDescription("Get a user's current local time")
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to check timezone of')
                .setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const targetId = user.id;

        const userData = await User.findOne({ userId: targetId });

        if (!userData) {
            return interaction.reply({
                content: `❌ ${user.username} has not set their timezone yet.`,
                flags: MessageFlags.Ephemeral
            });
        }

        const currentTime = moment().tz(userData.timezone).format('dddd, HH:mm [on] MMM D, YYYY');
        return interaction.reply({
            content: `${user.username}'s current local time is **${currentTime}** (${userData.timezone}).`,
            flags: MessageFlags.Ephemeral
        });
    }
};
