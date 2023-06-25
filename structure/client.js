//Отдел констант
const Discord = require('discord.js');
const Command = require('./command.js');
const Button = require('./button.js');
const selectMenu = require('./selectMenu.js');
const Event = require('./event.js');
const Modal = require('./modal.js');
const { Player } = require('discord-player');
const { SpotifyExtractor, SoundCloudExtractor } = require('@discord-player/extractor');
const player = require('../structure/player.js')

const fs = require('fs');
//Отдел констант

//Класс клиента
class Client extends Discord.Client {
    constructor() {
        super({
            intents: [
                Discord.GatewayIntentBits.Guilds,
                Discord.GatewayIntentBits.GuildMessages,
                Discord.GatewayIntentBits.GuildVoiceStates,
                Discord.GatewayIntentBits.MessageContent,
                Discord.GatewayIntentBits.GuildVoiceStates
            ], partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER', 'GUILD_VOICE_STATES']
        })

        /**
         * @type {Discord.Collection<string, Command>}
         */
        this.commands = new Discord.Collection();
        /**
         * @type {Discord.Collection<string, Button>}
         */
        this.buttons = new Discord.Collection();
        /**
         * @type {Discord.Collection<string, selectMenu>}
         */
        this.selectMenus = new Discord.Collection();
        /**
         * @type {Discord.Collection<string, Modal>}
         */
        this.modals = new Discord.Collection();
        /**
            * @type {Discord.Collection<string, Discord.EmbedBuilderd>}
        */
        this.players = new Discord.Collection();



        this.Player = new Player(this, {
            ytdlOptions: {
                requestOptions: {
                    headers: {
                        cookie: "VISITOR_INFO1_LIVE=lURq9VSSZBI; PREF=tz=Asia.Yekaterinburg&f7=140&f6=40000000&f5=20000; CONSENT=YES+; HSID=ArbjDQFxkQKXIUP3x; SSID=A4ifZpWEbp2x_d6Rd; APISID=qo2TYLxP7Zi2lpEF/A8fdamBePNFamKE5o; SAPISID=XHRDCRD9ESUvxHsw/ArcxRvgJsDtRtN0M8; __Secure-1PAPISID=XHRDCRD9ESUvxHsw/ArcxRvgJsDtRtN0M8; __Secure-3PAPISID=XHRDCRD9ESUvxHsw/ArcxRvgJsDtRtN0M8; SOCS=CAESNQgDEitib3FfaWRlbnRpdHlmcm9udGVuZHVpc2VydmVyXzIwMjMwNTIyLjA3X3AxGgJkZSACGgYIgJDFowY; CONSENT=YES+; SID=XAgXdnx6tYEs-_I2he8aVgqS8PEBShGa-kA74OljI8RbIr3lzYrdwXoCCKGSr5aacqSvpQ.; __Secure-1PSID=XAgXdnx6tYEs-_I2he8aVgqS8PEBShGa-kA74OljI8RbIr3ltAQ-w5yMwMH5lvcdiiO0MQ.; __Secure-3PSID=XAgXdnx6tYEs-_I2he8aVgqS8PEBShGa-kA74OljI8RbIr3lYWxVIw1yUOtVe_tW5G8tpw.; hideBrowserUpgradeBox=true; YSC=f0MKYv8SgLo; gdpr=0; visitor=1; LOGIN_INFO=AFmmF2swRAIgNnq1Wo6OtIDS0nQolPSWWGSd5OwHryI9uukOILlB3zwCIDzPK7g5hBDwftUS1B03LwrLdv1YHDgvsjY1X6MHCQ3J:QUQ3MjNmd3hMZ3BhMVFJLVBtb24wdG1ubU1yNDBrYllZUlR6dUZmZFVoMXE1WnBZNXU1RGpfdW9EcUZNQWF3RE5ZUUJ1c0RrOEVkTV9uenpNbUMzbVdCTTlJODJCdTFOdHRDOXVVSFhFS19ieFc1VFZudFRUNko2Y2tMZ1NTWllEWGJTbmVURUtjTHQ4cU54YkZTbkVFTldHV1BkZl9OUU5LYk1YR3U0d3djbHBFZzI3eHozc2J2ZXpuUVBld2F4T2hrOWlfcjNHVXgyQmZzTmZQbzl0TzVPR1Vfd2VyeTJCZw==; __Secure-YEC=CgtvWG9nNjM5Ty0zayix1O2jBg%3D%3D; ST-145zixs=; SIDCC=AP8dLtwt1EVmfpxxKJHdtw4wo_27m7GytFHXBDEDGr0wxhYrbMTIdAXiDHC-GMAB7QyMRS2hF2c; __Secure-1PSIDCC=AP8dLtxzivnC1GW_BwMxhyQsgWqJNa1SpE502n9wxbtQG7FT-SF5p_dZXs3hJta-dHwEAl9XHO49; __Secure-3PSIDCC=AP8dLtxIddVhI7vT0RDXrCHGWPJDZjUmWcyBsCAGKPjYe6Qur3d1ohY1NGkxIeUBFq5t-uJFefd-"
                    }
                }
            }
        });
    }

    async RunBot(token) {
        //Обработчик команд
        const commandFiles = fs.readdirSync('./commands/')
            .filter(file => file.endsWith('.js'))
            .filter(file => !file.startsWith("_"));
        /**
         * @type {Command[]}
         */

        const commands = commandFiles.map(file => require(`../commands/${file}`));

        commands.forEach(cmd => {
            console.log(`[INFO] Команда: ${cmd.name} была добавлена в список команд!`);
            this.commands.set(cmd.name, cmd);
        })

        const slashCommands = commands
            .map(cmd => ({
                name: cmd.name,
                description: cmd.description,
                permissions: [],
                options: cmd.slashCommandOptions,
                defaultPermission: true
            }))

        this.removeAllListeners();
        this.on("ready", async () => {
            const command = await this.application.commands.set(slashCommands);

            command.forEach((cmd) => {
                console.log(`[INFO] Slash команда "${cmd.name} была загружена"`);
            })
        })

        //Обработчик Discord Player
        await this.Player.extractors.loadDefault();
        await this.Player.extractors.register(SpotifyExtractor, {});
        await this.Player.extractors.register(SoundCloudExtractor, {});

        fs.readdirSync('./player_events/')
            .filter(file => file.endsWith('.js'))
            .filter(file => !file.startsWith("_"))
            .forEach(file => {
                const event = require(`../player_events/${file}`)
                console.log(`[INFO] Discord Player Event: ${event.event} был загружен`)
                this.Player.events.on(event.event, event.run.bind(null, this))
            })

        //Обработчик ивентов
        fs.readdirSync('./events/')
            .filter(file => file.endsWith('.js'))
            .filter(file => !file.startsWith("_"))
            .forEach(file => {
                /**
                 * @type {Event}
                 */
                const event = require(`../events/${file}`)
                console.log(`[INFO] Ивент: ${event.event} был загружен`)
                this.on(event.event, event.run.bind(null, this))
            })

        //Обработчик компонентов
        fs.readdirSync('./components/').forEach(component => {
            const components = fs.readdirSync(`./components/${component}/`)
                .filter(file => file.endsWith('.js'))
                .filter(file => !file.startsWith("_"));

            switch (component) {
                case "buttons":
                    components.forEach((button) => {
                        const btn = require(`../components/buttons/${button}`)
                        this.buttons.set(btn.buttonID, btn);
                        console.log(`[INFO] Компонент (Кнопка) с ID "${btn.buttonID}" была успешно загружена`);
                    })
                    break;

                case "selectMenus":
                    components.forEach((SelectMenu) => {
                        const selMenu = require(`../components/selectMenus/${SelectMenu}`)
                        this.selectMenus.set(selMenu.selectMenuID, selMenu);
                        console.log(`[INFO] Компонент (selectMenu) с ID "${selMenu.selectMenuID}" была успешно загружена`);
                    })
                    break;

                case "modals":
                    components.forEach((modal) => {
                        const modalInteraction = require(`../components/modals/${modal}`)
                        this.modals.set(modalInteraction.modalID, modalInteraction);
                        console.log(`[INFO] Компонент (Modal) с ID "${modalInteraction.modalID}" была успешно загружена`);
                    })
                    break;
            }
        })

        //Логин бота
        this.login(token).catch(err => {
            if (err == "Error [TOKEN_INVALID]: An invalid token was provided.") {
                return console.log("Ошибка:\nТокен недействителен или он отсутствует");
            }
            return console.log(err)
        })
    }
}

module.exports = Client;