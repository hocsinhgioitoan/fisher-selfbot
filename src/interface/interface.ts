// Import
import * as Discord from 'discord.js-selfbot-v13';

// TEvent
export interface TEvent {
    name: keyof Discord.ClientEvents;
    once: boolean;
    run: (client: Discord.Client, ...args: any) => Discord.Awaitable<void>;
}
