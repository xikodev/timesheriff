require('dotenv').config();
const { Client, Collection, IntentsBitField, ActivityType, MessageFlags } = require('discord.js');
const { mongoose } = require('mongoose');
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


// MongoDB connection
try {
    const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}.2goqqlc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
    mongoose.connect(dbURI);
    console.log('Connected to MongoDB');
} catch(error) {
    console.error('MongoDB connection error:', error);
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


// Activity status
client.on('ready', () => {
    console.log('Bot ' + client.user.username + ' is ready to use.');

    client.user.setActivity({
        name: 'timezones',
        type: ActivityType.Listening
    });
});


// Bot initialization
client.login(process.env.TOKEN)
    .then(() =>  console.log('Bot ' + client.user.username + ' started successfully.'))
    .catch((error) => console.error(error));
