import { userCommand } from 'jellycommands';

export default userCommand({
    name: 'Hello World',
    guilds: ['663140687591768074'],

    run: ({ interaction }) => {
        interaction.reply({ content: `Hello ${interaction.user.tag}` });
    },
});
