
const aboutBotEmbed = {
    color: 0x5555FF,
    title: 'About Bot',
    author: {
        name: 'xiko',
        icon_url: 'https://avatars.githubusercontent.com/u/58877412',
        url: 'https://github.com/xikodev',
    },
    description: 'TimeSheriff helps your community stay in sync across the globe. It lets users set their timezone, view each other’s local times, and coordinate events effortlessly - no more mental math or missed pings!',
    thumbnail: {
        url: 'https://cdn.discordapp.com/app-icons/1396929073107832933/b2af08dc2edacaea977fdcc73f6017fe.png',
    },
    fields: [
        {
            name: 'Add to your server',
            value: '[🔗 Invite Link](https://discord.com/oauth2/authorize?client_id=1396929073107832933)',
            inline: true,
        },
        {
            name: 'Official server',
            value: '[🔗 Server Link](https://discord.gg/VEnG7xER4v)',
            inline: true,
        },
        {
            name: 'GitHub Repository',
            value: '[🔗 Github Link](https://github.com/xikodev/timesheriff)',
            inline: true,
        },
        {
            name: '\u200b',
            value: '\u200b',
            inline: false,
        },
        {
            name: '',
            value: '[Terms of Services](https://github.com/xikodev/timesheriff/blob/main/TERMS.md)\n' +
                '[Privacy policy](https://github.com/xikodev/timesheriff/blob/main/PRIVACY.md)',
            inline: true,
        },
    ],
    footer: {
        text: 'TimeSheriff',
        icon_url: 'https://cdn.discordapp.com/app-icons/1396929073107832933/b2af08dc2edacaea977fdcc73f6017fe.png',
    },
    timestamp: new Date().toISOString(),
};

module.exports = { aboutBotEmbed };
