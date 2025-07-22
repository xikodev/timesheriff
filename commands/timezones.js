const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags
} = require('discord.js');
const moment = require('moment-timezone');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timezones')
        .setDescription('Browse valid timezones, optionally by region')
        .addStringOption(option =>
            option.setName('region')
                .setDescription('Filter by region (e.g. Europe, Asia, America, etc.)')
                .setRequired(false)
        ),

    async execute(interaction) {
        const inputRegion = interaction.options.getString('region');
        const allZones = moment.tz.names();

        // Filter by region if provided
        const zones = inputRegion
            ? allZones.filter(z => z.toLowerCase().startsWith(inputRegion.toLowerCase() + '/'))
            : allZones;

        if (zones.length === 0) {
            return interaction.reply({
                content: `❌ No timezones found for region: \`${inputRegion}\``,
                flags: MessageFlags.Ephemeral
            });
        }

        const itemsPerPage = 20;
        const totalPages = Math.ceil(zones.length / itemsPerPage);

        const getPage = (page) => {
            const start = page * itemsPerPage;
            const end = start + itemsPerPage;
            const pageZones = zones.slice(start, end);
            return `🌍 **Timezones**${inputRegion ? ` in ${inputRegion}` : ''} (Page ${page + 1}/${totalPages})\n\n` +
                pageZones.map(z => `• ${z}`).join('\n');
        };

        let page = 0;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('prev')
                .setLabel('⬅️ Previous')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('➡️ Next')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(totalPages <= 1)
        );

        const reply = await interaction.reply({
            content: getPage(page),
            components: [row],
            flags: MessageFlags.Ephemeral,
            fetchReply: true
        });

        const collector = reply.createMessageComponentCollector({
            time: 5 * 60 * 1000, // 5 minutes
            filter: i => i.user.id === interaction.user.id
        });

        collector.on('collect', async i => {
            if (i.customId === 'prev' && page > 0) page--;
            else if (i.customId === 'next' && page < totalPages - 1) page++;

            const updatedRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setLabel('⬅️ Previous')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(page === 0),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('➡️ Next')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(page === totalPages - 1)
            );

            await i.update({
                content: getPage(page),
                components: [updatedRow]
            });
        });

        collector.on('end', async () => {
            reply.edit({ components: [] }).catch(() => {});
        });
    }
};
