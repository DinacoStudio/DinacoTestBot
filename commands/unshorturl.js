const Command = require('../structure/command.js');
const Discord = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fetchUrl = require("axios");

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
        const data_ = await fetchUrl.get(`https://smoa.ds1nc.ru/https://dinaco.ds1nc.ru/api/unshort.php?url=${url}`)

        const Unshorten = new ButtonBuilder()
            .setLabel('Оригинальная ссылка')
            .setURL(data_.data)
            .setStyle(ButtonStyle.Link);
        const firstActionRow = new ActionRowBuilder()
            .addComponents([Unshorten])

        interaction.reply({ components: [firstActionRow] });
    }
});