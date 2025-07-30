const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const moment = require('moment-timezone');
const User = require('../models/User');

const timezones = moment.tz.names();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settimezone')
        .setDescription('Set your timezone')
        .addStringOption(option =>
            option.setName('timezone')
                .setDescription('IANA timezone (e.g. Europe/Zagreb)')
                .setAutocomplete(true)
                .setRequired(true)
        ),

    async execute(interaction) {
        let tz = interaction.options.getString('timezone');
        const userId = interaction.user.id;

        if (!moment.tz.zone(tz)) {
            return interaction.reply({ content: '❌ Invalid timezone.', ephemeral: true });
        }

        if (tz.includes('/')) {
            tz = tz
                .split('/')
                .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
                .join('/');
        } else {
            tz = tz.toUpperCase();
        }


        try {
            await new User(userId, tz).save();

            return interaction.reply({
                content: `✅ Your timezone has been set to **${tz}**.`,
                flags: MessageFlags.Ephemeral
            });
        } catch (err) {
            console.error(err);
            return interaction.reply({
                content: '⚠️ Failed to save timezone.',
                flags: MessageFlags.Ephemeral
            });
        }
    },

    async autocomplete(interaction) {
        const focused = interaction.options.getFocused();
        const matches = timezones
            .filter(tz => tz.toLowerCase().includes(focused.toLowerCase()))
            .slice(0, 25)
            .map(tz => ({ name: tz, value: tz }));

        await interaction.respond(matches);
    }
};
