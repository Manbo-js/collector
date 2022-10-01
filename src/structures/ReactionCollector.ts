import Collector, { CollectorOptions } from './Collector'
import * as Manbo from 'manbo'

export interface CollectedReaction<T extends Manbo.Message> {
    /** The message this reaction is from. */
    message: T;
    /** The reaction collected. */
    reaction: Manbo.PartialEmoji;
    /** The user who reacted. */
    user: Manbo.Member | Manbo.Uncached;
}

export type ReactionCollectorEndReasons = 'guildDelete' | 'channelDelete' | 'threadDelete' | 'messageDelete';

export class ReactionCollector<T extends Manbo.Message> extends Collector<CollectedReaction<T>, ReactionCollectorEndReasons> {
    /**
     * @param client The Manbo client to apply the collector on.
     * @param message The message to apply collector.
     * @param options The collector options.
     */
    public constructor(private client: Manbo.Client, private message: T, public options: CollectorOptions<CollectedReaction<T>> = {}) {
        super(options)

        const bulkDeleteListener = (messages: Manbo.PossiblyUncachedMessage[]): void => {
            if (messages.find((message) => message.id === this.message.id)) this.stop('messageDelete')
        }

        this.empty = this.empty.bind(this)
        this.handleChannelDeletion = this.handleChannelDeletion.bind(this)
        this.handleThreadDeletion = this.handleThreadDeletion.bind(this)
        this.handleGuildDeletion = this.handleGuildDeletion.bind(this)
        this.handleMessageDeletion = this.handleMessageDeletion.bind(this)

        this.client.on('messageReactionAdd', this.handleCollect)
        this.client.on('messageReactionRemove', this.handleDispose)
        this.client.on('messageReactionRemoveAll', this.empty)
        this.client.on('messageDelete', this.handleMessageDeletion)
        this.client.on('messageDeleteBulk', bulkDeleteListener)
        this.client.on('channelDelete', this.handleChannelDeletion)
        this.client.on('threadDelete', this.handleThreadDeletion)
        this.client.on('guildDelete', this.handleGuildDeletion)

        this.once('end', () => {
            this.client.removeListener('messageReactionAdd', this.handleCollect)
            this.client.removeListener('messageReactionRemove', this.handleDispose)
            this.client.removeListener('messageReactionRemoveAll', this.empty)
            this.client.removeListener('messageDelete', this.handleMessageDeletion)
            this.client.removeListener('messageDeleteBulk', bulkDeleteListener)
            this.client.removeListener('channelDelete', this.handleChannelDeletion)
            this.client.removeListener('threadDelete', this.handleThreadDeletion)
            this.client.removeListener('guildDelete', this.handleGuildDeletion)
        })
    }

    private handleChannelDeletion(channel: Manbo.AnyChannel): void {
        if (channel.id === this.message.channel.id || (this.message.channel instanceof Manbo.GuildChannel && channel.id === this.message.channel.parentID)) {
            this.stop('channelDelete')
        }
    }

    private handleGuildDeletion(guild: Manbo.Guild | Manbo.Uncached): void {
        if (this.message.channel instanceof Manbo.GuildChannel) {
            if (guild.id === this.message.guildID) {
                this.stop('guildDelete')
            }
        }
    }

    private handleMessageDeletion(message: Manbo.PossiblyUncachedMessage): void {
        if (message.id === this.message.id) {
            this.stop('messageDelete')
        }
    }

    private handleThreadDeletion(thread: Manbo.AnyThreadChannel | Manbo.Uncached): void {
        if (thread.id === this.message.channel.id) {
            this.stop('threadDelete')
        }
    }

    protected collect(message: T, reaction: Manbo.PartialEmoji, user: Manbo.Member | Manbo.Uncached): CollectedReaction<T> | null {
        if (message.id !== this.message.id) return null

        return {
            reaction,
            message,
            user
        }
    }

    protected dispose(message: T, reaction: Manbo.PartialEmoji, userId: string): CollectedReaction<T> | null {
        if (message.id !== this.message.id) return null

        return {
            reaction,
            message,
            user: {
                id: userId
            }
        }
    }
}

/**
 * Await reactions.
 * @param client The Manbo client to apply the collector on.
 * @param message The message to await reactions from.
 * @param options The options to await the reactions with.
 */
export function awaitReactions<T extends Manbo.Message>(client: Manbo.Client, message: T, options: CollectorOptions<CollectedReaction<T>> = {}): Promise<CollectedReaction<T>[]> {
    return new Promise<CollectedReaction<T>[]>((resolve): void => {
        const collector = new ReactionCollector(client, message, options)

        collector.once('end', (collectedReactions) => {
            resolve(collectedReactions)
        })
    })
}
