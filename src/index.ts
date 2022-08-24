// Import
import Discord, { Client } from 'discord.js-selfbot-v13';
import fs from 'fs';
import path from 'path';
import { TEvent } from './interface/interface';
import { config } from 'dotenv';
import chalk from 'chalk';
config();
// Create client
const client = new Client({
    checkUpdate: false,
    presence: {
        status: 'dnd'
    }
});

// Events
fs.readdirSync(path.join(__dirname, 'events')).forEach(async (file) => {
    const Event: { default: TEvent } = await import('./events/' + file);
    const event = Event.default;
    if (event.once) client.once(event.name, event.run.bind(null, client));
    else client.on(event.name, event.run.bind(null, client));
    console.log(chalk.yellow(`Đã load ${event.name.split('.')[0]}`));
});

// Something
client.time = new Discord.Collection();
client.giai = new Discord.Collection();

// Login
client
    .login(process.env['token'])
    .catch((e) => console.log(chalk.bgRed('Đã có lỗi')));
