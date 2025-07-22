require('dotenv').config();
const { REST, Routes } = require("discord.js");
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering / commands...');

        await rest.put(
            Routes.applicationCommands(process.env.CLIEND_ID),
            {
                body: commands
            }
        );

        console.log('Commands registered successfully.');
    } catch (error) {
        console.error(error);
    }

    // try {
    //     console.log('Deleting / commands...');
    //
    //     await rest.put(
    //         Routes.applicationCommands(process.env.CLIEND_ID),
    //         {
    //             body: []
    //         }
    //     );
    //
    //     console.log('Commands deleted successfully.');
    // } catch (error) {
    //     console.error(error);
    // }
})();
