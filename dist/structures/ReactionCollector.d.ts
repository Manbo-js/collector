import Collector, { CollectorOptions } from './Collector';
import * as Manbo from 'manbo';
export interface CollectedReaction<T extends Manbo.Message> {
    /** The message this reaction is from. */
    message: T;
    /** The reaction collected. */
    reaction: Manbo.PartialEmoji;
    /** The user who reacted. */
    user: Manbo.Member | Manbo.Uncached;
}
export declare type ReactionCollectorEndReasons = 'guildDelete' | 'channelDelete' | 'threadDelete' | 'messageDelete';
export declare class ReactionCollector<T extends Manbo.Message> extends Collector<CollectedReaction<T>, ReactionCollectorEndReasons> {
    private client;
    private message;
    options: CollectorOptions<CollectedReaction<T>>;
    /**
     * @param client The Manbo client to apply the collector on.
     * @param message The message to apply collector.
     * @param options The collector options.
     */
    constructor(client: Manbo.Client, message: T, options?: CollectorOptions<CollectedReaction<T>>);
    private handleChannelDeletion;
    private handleGuildDeletion;
    private handleMessageDeletion;
    private handleThreadDeletion;
    protected collect(message: T, reaction: Manbo.PartialEmoji, user: Manbo.Member | Manbo.Uncached): CollectedReaction<T> | null;
    protected dispose(message: T, reaction: Manbo.PartialEmoji, userId: string): CollectedReaction<T> | null;
}
/**
 * Await reactions.
 * @param client The Manbo client to apply the collector on.
 * @param message The message to await reactions from.
 * @param options The options to await the reactions with.
 */
export declare function awaitReactions<T extends Manbo.Message>(client: Manbo.Client, message: T, options?: CollectorOptions<CollectedReaction<T>>): Promise<CollectedReaction<T>[]>;
//# sourceMappingURL=ReactionCollector.d.ts.map