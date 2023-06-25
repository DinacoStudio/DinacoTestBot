const Command = require('../structure/command.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Discord = require('discord.js');
const fetchUrl = require("axios");

module.exports = new Command({
    name: "shorturl",
    description: "Сократить ссылку",
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

        const data_ = await fetchUrl.get(`https://api.shrtco.de/v2/shorten?url=${url}`)
        const data = data_.data
        if (!data) return interaction.reply({ content: `Ссылка ${url} была заблокирована или произошла ошибка`, components: [] });


        const Shrtco = new ButtonBuilder()
            .setLabel('Shrtco.de')
            .setURL(data.result.full_short_link)
            .setStyle(ButtonStyle.Link);
        const qr9 = new ButtonBuilder()
            .setLabel('9qr.de')
            .setURL(data.result.full_short_link2)
            .setStyle(ButtonStyle.Link);
        const Shiny = new ButtonBuilder()
            .setLabel('Shiny.link')
            .setURL(data.result.full_short_link3)
            .setStyle(ButtonStyle.Link);

        const firstActionRow = new ActionRowBuilder()
            .addComponents([Shrtco, qr9, Shiny])

        interaction.reply({ components: [firstActionRow] });
    }
});