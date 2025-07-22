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
        const tz = interaction.options.getString('timezone');
        const userId = interaction.user.id;

        if (!moment.tz.zone(tz)) {
            return interaction.reply({ content: '❌ Invalid timezone.', ephemeral: true });
        }

        try {
            await User.findOneAndUpdate(
                { userId },
                { timezone: tz },
                { upsert: true, new: true }
            );

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
