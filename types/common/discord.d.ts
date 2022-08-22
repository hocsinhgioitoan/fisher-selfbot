import { Collection} from 'discord.js-selfbot-v13'
declare module 'discord.js-selfbot-v13' {
    export interface Client {
        time: Collection<string, number>;
    }
}
export {}