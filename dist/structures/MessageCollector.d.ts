import Collector, { CollectorOptions } from './Collector';
import * as Manbo from 'manbo';
export declare type MessageCollectorEndReasons = 'guildDelete' | 'channelDelete' | 'threadDelete';
export declare class MessageCollector<T extends Manbo.TextChannel> extends Collector<Manbo.Message<T>, MessageCollectorEndReasons> {
    private client;
    private channel;
    options: CollectorOptions<Manbo.Message<T>>;
    /**
     * @param client The Manbo client to apply the collector on.
     * @param channel The channel to collect messages
     * @param options The collector options.
     */
    constructor(client: Manbo.Client, channel: T, options?: CollectorOptions<Manbo.Message<T>>);
    private handleChannelDeletion;
    private handleGuildDeletion;
    private handleThreadDeletion;
    protected collect(message: Manbo.Message<T>): Manbo.Message<T> | null;
    protected dispose(message: Manbo.PossiblyUncachedMessage): Manbo.PossiblyUncachedMessage | null;
}
/**
 * Await messages.
 * @param client The Manbo client to apply the collector on.
 * @param channel The channel to await messages from.
 * @param options The options to await the messages with.
 */
export declare function awaitMessages<T extends Manbo.TextChannel>(client: Manbo.Client, channel: T, options?: CollectorOptions<Manbo.Message<T>>): Promise<Manbo.Message<T>[]>;
//# sourceMappingURL=MessageCollector.d.ts.map