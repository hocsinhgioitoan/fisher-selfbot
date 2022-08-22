// Import
import { TEvent } from '../interface/interface';
import * as Discord from 'discord.js-selfbot-v13';
import { config } from 'dotenv';
import { solveCaptcha } from '../function/captcha';
import y from 'exif-be-gone';
import chalk from 'chalk';
config();
// Export
export default {
    name: 'messageCreate',
    once: false,
    run: async (
        client: Discord.Client<true>,
        message: Discord.Message<true>
    ) => {
        //message.channel.sendTyping()
        // Check guild and channel
        const channleID = process.env['channelID'] || '123456789';
        const guildID = process.env['guildID'] || '123456789';
        const fisherID = '574652751745777665';
        const time = randomIntFromInterval(9000, 110000);
        if (message.guildId !== guildID) return;
        if (message.channelId !== channleID) return;
        // check message has captcha
        if (
            message.author.id === fisherID &&
            message.content.includes(`User **${client.user.tag} banned for`)
        ) {
            console.log(chalk.bgRed('Banned :('));
            process.exit(1);
        } else if (
            message.author.id === fisherID &&
            message.content.includes('You must wait')
        ) {
            console.log(message.author.username);
            return await sleep(time).then(async () => {
                await message.channel.sendSlash(fisherID, 'fish');
                client.time.set('fish', Date.now() + time);
                console.log('[Fisher] Câu cá');
            });
        } else if (
            message.author.id === fisherID &&
            message.content === 'You may now continue.'
        ) {
            console.log('[CAPTCHA] Giải thành công...');
            await sleep(5000).then(
                async () =>
                    await message.channel.sendSlash(fisherID, 'shop rods')
            );
        }
        // Check bait
        const embed = message.embeds
            .filter((e) => e.title !== 'Official Server')
            .filter(
                (e) =>
                    e.description !==
                    ':chart_with_upwards_trend: Reminder: Vote with **/vote** for rewards!'
            )[0];
        if (embed) {
            if (message.interaction?.user.id !== client.user.id) return;
            const description = embed.description;
            const title = embed.title;
            if (
                description?.includes('**NONE**') &&
                title ===
                    '**/bait <bait type>** to use bait.\n/bait none is valid.'
            ) {
                await message.channel.sendSlash(fisherID, 'shop bait');
            } else if (
                title ===
                'Bait is consumed **PER CAST** so make sure to stock up.'
            ) {
                if (!description) return;
                const Items = description.split('\n');
                const items = Items.filter(
                    (i, n) =>
                        n !== 0 &&
                        n !== 1 &&
                        n !== Items.length - 1 &&
                        n !== Items.length - 2 &&
                        i.length !== 0 &&
                        i.includes('Increases')
                );
                const bait =
                    message.components[items.length >= 4 ? 1 : 0].components[
                        items.length >= 4 ? items.length - 4 : items.length - 1
                    ];
                if (bait.type !== 'BUTTON') return;
                await message.channel.sendSlash(
                    fisherID,
                    'buy',
                    bait.label,
                    10
                );
            } else if (
                embed.author?.name === client.user.username &&
                embed.title === 'You caught:'
            ) {
                const sell = client.time.get('sell') || 0;
                if (sell < Date.now()) {
                    await message.channel.sendSlash(fisherID, 'sell', 'all');
                    client.time.set('sell', Date.now() + 10 * 60 * 1000);
                }
                if (embed.description?.includes('You ran out of')) {
                    return await message.channel.sendSlash(fisherID, 'bait');
                }
                const rd = randomIntFromInterval(7500, 15000);
                const fish = client.time.get('fish') || 0;
                if (fish > Date.now()) {
                    return await sleep(time).then(async () => {
                        await message.channel.sendSlash(fisherID, 'fish');
                        client.time.set('fish', Date.now() + rd);
                        console.log('[Fisher] Câu cá');
                    });
                }
                await message.channel.sendSlash(fisherID, 'fish');
                client.time.set('fish', Date.now() + rd);
                console.log('[Fisher] Câu cá');
            } else if (embed.title === 'Fishing Rod Shop') {
                const rows = message.components[1].components;
                const arr: Discord.MessageButton[] = [];
                const arr2: Discord.MessageButton[] = [];

                for (let i = 0; i < rows.length; i++) {
                    const button = rows[i];

                    if (button.type !== 'BUTTON') return;
                    if (button.label === 'Select') arr.push(button);
                    else if (button.label === 'Selected') arr.push(button);
                    else arr2.push(button);
                }

                const num = arr.length !== 0 && arr.length % 5 == 0;
                if (num) {
                    if (!description) return;
                    const foo =
                        description.split('\n')[
                            description.split('\n').length - 1
                        ];
                    const page2 = parseFloat(
                        foo.split('**')[1].split('**')[0].split('/')[1]
                    );
                    await message.channel.sendSlash(
                        fisherID,
                        'shop rods',
                        page2
                    );
                } else {
                    if (!description) return;
                    if (arr2.length === 0 && arr.length === 0)
                        return await message.channel.sendSlash(
                            fisherID,
                            'bait'
                        );
                    if (arr.length) {
                        if (arr[arr.length - 1].label !== 'Selected')
                            arr[arr.length - 1].click(message);
                    }
                    const money = parseFloat(
                        description
                            .split('\n')[0]
                            .split('$')[1]
                            .split('**')[0]
                            .replace(',', '')
                    );
                    const moneyNeed = parseFloat(
                        arr2[0].label?.split('$')[1].replace(',', '') || '0'
                    );
                    if (money > moneyNeed) {
                        arr2[0].click(message);
                        await message.channel.sendSlash(fisherID, 'bait');
                    } else {
                        await message.channel.sendSlash(fisherID, 'bait');
                    }
                }
            } else if (
                embed.author?.name === client.user.username &&
                embed.title?.includes('Anti-bot') &&
                embed.description?.includes(
                    'Feel free to join [our server](https://discord.gg/5W4D2fd) for help if there are any issues with this captcha.'
                )
            ) {
                console.log('[CAPTCHA] Có captcha, đang giải....');
                const foo = await solveCaptcha(
                    embed.image?.url || '',
                    'hoanghaianh',
                    '5JzPnvYKF7iyHGIBYBXG',
                    './dist/imgage'
                );
                if (foo?.result) {
                    return await message.channel.sendSlash(
                        fisherID,
                        'verify',
                        foo.result
                    );
                } else {
                    console.log('[CAPTCHA] Giải thất bại, đang thoát....');
                    process.exit(0);
                }
            } else if (
                embed.description ===
                ':information_source: To continue, solve the captcha posted above with the **%verify** command.\n' +
                    'If the code is unreadable, you can use the **%verify regen** command.'
            ) {
                await sleep(20 * 1000);
                process.exit(1);
            } else {
                await message.channel.sendSlash(fisherID, 'fish');
            }
        }
    },
} as TEvent;

function randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
