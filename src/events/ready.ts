// Import
import { TEvent } from '../interface/interface';
import * as Discord from 'discord.js-selfbot-v13';
import { config } from 'dotenv';
import chalk from 'chalk';
config();
// Export
export default {
    name: 'ready',
    run: (client: Discord.Client<true>) => {
        client.user.username;
        // Log when ready
        console.log(chalk.green(`${client.user.username} đã online`));

        // Check channel
        const channleID = process.env['channelID'] || '123456789';
        const guildID = process.env['guildID'] || '123456789';

        const channel = client.guilds.cache
            .get(guildID)
            ?.channels.cache.get(channleID);
        if (!channel)
            return console.log(
                chalk.bgRed(
                    `Id channel: ${channleID} là kênh không tồn tại hoặc thiếu gì đó, vui lòng kiểm tra lại`
                )
            );
        if (channel.type !== 'GUILD_TEXT')
            return console.log(
                chalk.bgRed(
                    'Kênh bạn chọn không phải là kênh text, vui lòng thử lại'
                )
            );
        if (!channel.viewable)
            return console.log(
                chalk.bgRed('Tôi không nhìn thấy kênh đó ở đâu cảaaaaaa')
            );
        if (
            channel.permissionOverwrites.cache
                .get(client.user.id)
                ?.allow.has('SEND_MESSAGES')
        )
            return console.log(
                chalk.bgRed(`Tôi không được gửi tin nhắn ở kênh được yêu cầu`)
            );
        if (channel.rateLimitPerUser !== 0)
            return console.log(
                chalk.bgRed(`Vui lòng đặt lại rate limit cho kênh, chỉnh về 0.`)
            );

        const fisherID = '574652751745777665';
        // Send message

        // Check shop
        channel.sendSlash(fisherID, 'shop rods');
    },
} as TEvent;
const t = (
    client: Discord.Client,
    fish: number,
    channel: Discord.TextBasedChannel,
    id: string
) => {
    if (fish < Date.now()) {
        channel.sendSlash(id, 'fish');
    }
};
