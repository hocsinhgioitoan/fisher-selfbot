// Import
import { TEvent } from '../interface/interface';
import * as Discord from 'discord.js-selfbot-v13';
import { config } from 'dotenv';
import { solveCaptcha } from '../function/captcha';
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
        // Check guild and channel
        const channleID = process.env['channelID'] || '123456789';
        const guildID = process.env['guildID'] || '123456789';
        const fisherID = '574652751745777665';
        const time = randomIntFromInterval(7000, 10000);
        if (message.guildId !== guildID) return;
        if (message.channelId !== channleID) return;
        if (
            message.author.id === fisherID &&
            message.content.includes(`User **${client.user.tag} banned for`)
        ) {
            console.log(chalk.bgRed('Banned :('));
            process.exit(1);
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

        const embed = message.embeds
            .filter((e) => e.title !== 'Official Server')
            .filter(
                (e) =>
                    e.description !==
                    ':chart_with_upwards_trend: Reminder: Vote with **/vote** for rewards!'
            )
            .filter(
                (e) => e.title !== `Help support Virtual Fisher's development`
            )[0];
        if (embed) {
            if (message.interaction?.user.id !== client.user.id) return;
            // Câu cá
            if (
                embed.title === 'You caught:' &&
                embed.author?.name === message.guild.me?.displayName
            ) {
                const sell = client.time.get('sell') || '0';
                if (sell < Date.now()) {
                    await message.channel
                        .sendSlash(fisherID, 'sell')
                        .catch((e) => console.log);
                    client.time.set('sell', 1000 * 60 * 10);
                }
                if (embed.description?.includes('You ran out of')) {
                    return await message.channel
                        .sendSlash(fisherID, 'shop bait')
                        .catch((e) => console.log);
                }
                return setTimeout(async () => {
                    await message.channel
                        .sendSlash(fisherID, 'fish')
                        .catch((e) => console.log);
                }, time);
            }
            // Mua cần câu
            else if (embed.title === 'Fishing Rod Shop') {
                console.log('[ROD]: Đang mua cần câu.');
                if (!embed.description) return;
                const currentMoney = parseFloat(
                    embed.description
                        .split('\n')[0]
                        .split('**$')[1]
                        .split('**')[0]
                        .replace(',', '')
                );
                const buttonsRow: Discord.MessageButton[] = [];
                const buttonsRow2: Discord.MessageButton[] = [];

                message.components[1].components.forEach((button) => {
                    if (button.type !== 'BUTTON') return;
                    if (button.label === 'Select') {
                        buttonsRow.push(button);
                    } else if (button.label === 'Selected') {
                        buttonsRow.push(button);
                    } else {
                        buttonsRow2.push(button);
                    }
                });
                if (buttonsRow.length === 5) {
                    console.log('[ROD]: Đang chuyển đến trang cần câu khác');
                    const currentPage = parseFloat(
                        embed.description
                            .split('\n')
                            [embed.description.split('\n').length - 1].split(
                                '**'
                            )[1]
                            .split('/')[0]
                    );
                    const latsPage = parseFloat(
                        embed.description
                            .split('\n')
                            [embed.description.split('\n').length - 1].split(
                                '/'
                            )[1]
                            .split('**')[0]
                    );
                    if (currentPage === latsPage)
                        return await message.channel
                            .sendSlash(fisherID, 'shop bait')
                            .catch((e) => console.log);
                    setTimeout(async () => {
                        await message.channel
                            .sendSlash(fisherID, 'shop bait', latsPage)
                            .catch((e) => console.log);
                    }, time);
                } else {
                    if (buttonsRow.length >= 1) {
                        if (
                            buttonsRow[buttonsRow.length - 1].label !==
                            'Selected'
                        ) {
                            await buttonsRow[buttonsRow.length - 1]
                                .click(message)
                                .catch((e) => console.log);
                        }
                    }
                    const moneyNeed = parseFloat(
                        buttonsRow2[0].label?.split('$')[1].replace(',', '') ||
                            '0'
                    );
                    if (currentMoney > moneyNeed) {
                        await buttonsRow2[0]
                            .click(message)
                            .catch((e) => console.log);
                        await message.channel
                            .sendSlash(fisherID, 'buy')
                            .catch((e) => console.log);
                        await message.channel
                            .sendSlash(fisherID, 'bait')
                            .catch((e) => console.log);
                    } else {
                        await message.channel
                            .sendSlash(fisherID, 'bait')
                            .catch((e) => console.log);
                    }
                }
            }
            // Mua bait
            else if (
                embed.title ===
                'Bait is consumed **PER CAST** so make sure to stock up.'
            ) {
                if (!embed.description) return;
                const Items = embed.description.split('\n');
                const items = Items.filter(
                    (i, n) =>
                        n !== Items.length - 1 &&
                        n !== Items.length - 2 &&
                        n !== 0 &&
                        n !== 1 &&
                        i.length !== 0 &&
                        i.includes('Increases')
                );
                const label = items[items.length - 1]
                    .split('**')[1]
                    .split('**')[0];
                const currentMoney = parseFloat(
                    embed.description
                        .split('\n')[1]
                        .split('**$')[1]
                        .split('**')[0]
                        .replace(',', '')
                );
                const price = parseFloat(
                    items[items.length - 1].split('$')[1].split(' -')[0]
                );
                if (currentMoney > price * 10) {
                    await message.channel
                        .sendSlash(fisherID, 'buy', label, 10)
                        .catch((e) => console.log);
                    await message.channel
                        .sendSlash(fisherID, 'fish')
                        .catch((e) => console.log);
                } else {
                    await message.channel
                        .sendSlash(fisherID, 'fish')
                        .catch((e) => console.log);
                }
                await message.channel
                    .sendSlash(fisherID, 'fish')
                    .catch((e) => console.log);
            }
            // check bait
            else if (
                embed.title ===
                '**/bait <bait type>** to use bait.\n/bait none is valid.'
            ) {
                if (embed.description === 'Current bait: **NONE**') {
                    await message.channel
                        .sendSlash(fisherID, 'shop bait')
                        .catch((e) => console.log);
                } else {
                    await message.channel
                        .sendSlash(fisherID, 'fish')
                        .catch((e) => console.log);
                }
            }
            // check captcha
            else if (
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
                    './captcha.png'
                );
                if (foo?.result) {
                    return await message.channel.sendSlash(
                        fisherID,
                        'verify',
                        foo.result
                    );
                } else {
                    console.log('[CAPTCHA] Giải thất bại, đang thoát....');
                    process.exit(1);
                }
            } else if (
                embed.description ===
                ':information_source: To continue, solve the captcha posted above with the **%verify** command.\n' +
                    'If the code is unreadable, you can use the **%verify regen** command.'
            ) {
                setTimeout(() => {
                    process.exit(1);
                }, 1000 * 60);
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
