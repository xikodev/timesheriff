require('dotenv').config();
const { Client, Collection, IntentsBitField, ActivityType, MessageFlags } = require('discord.js');
const mysql = require('mysql2')
const fs = require('fs');


// Creating the client object
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});
client.commands = new Collection();


// Load all slash commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}


// MySQL connection
try {
    mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
    console.log('Connected to MySQL');
} catch(error) {
    console.error('MySQL connection error:', error);
}


// User interactions
client.on('interactionCreate', async interaction => {
    if (interaction.user.bot) return;

    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (err) {
            console.error(err);
            await interaction.reply({
                content: '❌ There was an error executing that command.',
                flags: MessageFlags.Ephemeral
            });
        }
    } else if (interaction.isAutocomplete()) {
        const command = client.commands.get(interaction.commandName);
        if (!command || !command.autocomplete) return;

        try {
            await command.autocomplete(interaction);
        } catch (err) {
            console.error(err);
        }
    }
});


// Send joined server info
client.on('guildCreate', async (guild) => {
    const reportChannelId = '1397960988460060813';

    try {
        if (guild.nsfw) return;

        const inviteChannel = guild.channels.cache.find(
            (ch) =>
                ch.type === 0 && // Text channel
                ch.permissionsFor(guild.members.me).has(['CreateInstantInvite', 'ViewChannel'])
        );

        if (!inviteChannel) {
            console.warn(`No valid channel to create invite in ${guild.name}`);
            return;
        }

        const invite = await inviteChannel.createInvite({
            maxAge: 0, // Permanent
            maxUses: 0, // Unlimited
            reason: 'Reporting new server join to home server',
        });

        const homeChannel = await client.channels.fetch(reportChannelId);

        if (!homeChannel || homeChannel.type !== 0) {
            console.warn('Report channel not found or invalid.');
            return;
        }

        await homeChannel.send(
            `🛰️ I've just joined a new server: **${guild.name}**\n📨 Invite link: ${invite.url}`
        );

        console.log(`Reported new server join: ${guild.name}`);
    } catch (error) {
        console.error('Error reporting guild join:', error);
    }
});


// Activity status
client.on('ready', () => {
    console.log('Bot ' + client.user.username + ' is ready to use.');

    client.user.setActivity({
        name: 'timesheriff.xyz | /help',
        type: ActivityType.Playing
    });
});


// Bot initialization
client.login(process.env.TOKEN)
    .then(() =>  console.log('Bot ' + client.user.username + ' started successfully.'))
    .catch((error) => console.error(error));
