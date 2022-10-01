import Collector, { CollectorOptions } from './Collector'
import * as Manbo from 'manbo'

export type MessageCollectorEndReasons = 'guildDelete' | 'channelDelete' | 'threadDelete';

export class MessageCollector<T extends Manbo.TextChannel> extends Collector<Manbo.Message<T>, MessageCollectorEndReasons> {
    /**
     * @param client The Manbo client to apply the collector on.
     * @param channel The channel to collect messages
     * @param options The collector options.
     */
    public constructor(private client: Manbo.Client, private channel: T, public options: CollectorOptions<Manbo.Message<T>> = {}) {
        super(options)

        const bulkDeleteListener = (messages: Manbo.PossiblyUncachedMessage[]): void => {
            for (const message of messages.values()) this.handleDispose(message)
        }

        this.handleChannelDeletion = this.handleChannelDeletion.bind(this)
        this.handleThreadDeletion = this.handleThreadDeletion.bind(this)
        this.handleGuildDeletion = this.handleGuildDeletion.bind(this)

        this.client.on('messageCreate', this.handleCollect)
        this.client.on('messageDelete', this.handleDispose)
        this.client.on('messageDeleteBulk', bulkDeleteListener)
        this.client.on('channelDelete', this.handleChannelDeletion)
        this.client.on('threadDelete', this.handleThreadDeletion)
        this.client.on('guildDelete', this.handleGuildDeletion)

        this.once('end', () => {
            this.client.removeListener('messageCreate', this.handleCollect)
            this.client.removeListener('messageDelete', this.handleDispose)
            this.client.removeListener('messageDeleteBulk', bulkDeleteListener)
            this.client.removeListener('channelDelete', this.handleChannelDeletion)
            this.client.removeListener('threadDelete', this.handleThreadDeletion)
            this.client.removeListener('guildDelete', this.handleGuildDeletion)
        })
    }

    private handleChannelDeletion(channel: Manbo.AnyChannel): void {
        if (channel.id === this.channel.id || (this.channel instanceof Manbo.GuildChannel && channel.id === this.channel.parentID)) {
            this.stop('channelDelete')
        }
    }

    private handleGuildDeletion(guild: Manbo.Guild | Manbo.Uncached): void {
        if (this.channel instanceof Manbo.GuildChannel) {
            if (guild.id === this.channel.guild.id) {
                this.stop('guildDelete')
            }
        }
    }

    private handleThreadDeletion(thread: Manbo.AnyThreadChannel | Manbo.Uncached): void {
        if (thread.id === this.channel.id) {
            this.stop('threadDelete')
        }
    }

    protected collect(message: Manbo.Message<T>): Manbo.Message<T> | null {
        if (message.channel.id !== this.channel.id) return null

        return message
    }

    protected dispose(message: Manbo.PossiblyUncachedMessage): Manbo.PossiblyUncachedMessage | null {
        if (message.channel?.id !== this.channel.id) return null

        return message
    }
}

/**
 * Await messages.
 * @param client The Manbo client to apply the collector on.
 * @param channel The channel to await messages from.
 * @param options The options to await the messages with.
 */
export function awaitMessages<T extends Manbo.TextChannel>(client: Manbo.Client, channel: T, options: CollectorOptions<Manbo.Message<T>> = {}): Promise<Manbo.Message<T>[]> {
    return new Promise<Manbo.Message<T>[]>((resolve): void => {
        const collector = new MessageCollector(client, channel, options)

        collector.once('end', (collectedMessages) => {
            resolve(collectedMessages)
        })
    })
}
