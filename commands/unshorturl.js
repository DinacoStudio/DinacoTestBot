const Command = require('../structure/command.js');
const Discord = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fetchUrl = require("node-fetch");

module.exports = new Command({
    name: "unshorturl",
    description: "Оригинальная ссылка",
    slashCommandOptions: [{
        name: "link",
        description: "Ссылка",
        type: Discord.ApplicationCommandOptionType.String,
        required: true
    }],
    permissions: "SEND_MESSAGES",
    async execute(client, args, interaction) {
        const url = args.getString("link", true);
        if (!url.trim()) return interaction.reply({ content: 'Ссылка не может быть пуста', components: [] });
        const response = await fetchUrl(`https://unshorten.me/json/${url}`)

        const data = await response.json();

        const Unshorten = new ButtonBuilder()
            .setLabel('Оригинальная ссылка')
            .setURL(data.resolved_url)
            .setStyle(ButtonStyle.Link);
        const firstActionRow = new ActionRowBuilder()
            .addComponents([Unshorten])

        interaction.reply({ components: [firstActionRow] });
    }
});