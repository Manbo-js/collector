import Collector, { CollectorOptions } from './Collector';
import { ButtonComponentInteraction, SelectMenuComponentInteraction } from '../types';
import * as Manbo from 'manbo';
export declare type ComponentTypes = typeof Manbo.Constants.ComponentTypes.BUTTON | typeof Manbo.Constants.ComponentTypes.SELECT_MENU;
export declare type InteractionTypes = typeof Manbo.Constants.InteractionTypes.MESSAGE_COMPONENT;
export interface MappedComponentTypes {
    [Manbo.Constants.ComponentTypes.BUTTON]: ButtonComponentInteraction;
    [Manbo.Constants.ComponentTypes.SELECT_MENU]: SelectMenuComponentInteraction;
}
export interface MappedInteractionTypesToComponentTypes {
    [Manbo.Constants.InteractionTypes.MESSAGE_COMPONENT]: MappedComponentTypes;
}
export interface InteractionCollectorOptions {
    /** The channel to listen to interactions from. */
    channel?: Manbo.TextChannel;
    /** The guild to listen to interactions from. */
    guild?: Manbo.Guild;
    /** The interaction response to listen to message component interactions from. */
    interaction?: Manbo.AutocompleteInteraction | Manbo.CommandInteraction | Manbo.ComponentInteraction;
    /** The message to listen to interactions from. */
    message?: Manbo.Message;
}
export declare type InteractionCollectorOptionsWithGenerics<K extends InteractionTypes, T extends keyof MappedInteractionTypesToComponentTypes[K]> = CollectorOptions<MappedInteractionTypesToComponentTypes[K][T]> & {
    /** The type of components to listen for. */
    componentType?: T;
    /** The type of interactions to listen for. */
    interactionType?: K;
} & InteractionCollectorOptions;
export declare type InteractionCollectorEndReasons = 'guildDelete' | 'channelDelete' | 'threadDelete' | 'messageDelete';
/** Collects interactions. Will automatically stop if the message, channel, or guild is deleted. */
export declare class InteractionCollector<K extends InteractionTypes = InteractionTypes, T extends keyof MappedInteractionTypesToComponentTypes[K] = keyof MappedInteractionTypesToComponentTypes[K]> extends Collector<MappedInteractionTypesToComponentTypes[K][T], InteractionCollectorEndReasons> {
    private client;
    options: InteractionCollectorOptionsWithGenerics<K, T>;
    private channel;
    private componentType;
    private guildID;
    private interactionType;
    private messageID;
    private messageInteractionID;
    /**
     * @param client The Manbo client to apply the collector on.
     * @param options The collector options.
     */
    constructor(client: Manbo.Client, options?: InteractionCollectorOptionsWithGenerics<K, T>);
    private handleChannelDeletion;
    private handleGuildDeletion;
    private handleMessageDeletion;
    private handleThreadDeletion;
    protected collect(interaction: Manbo.AutocompleteInteraction | Manbo.CommandInteraction | Manbo.ComponentInteraction): Manbo.AutocompleteInteraction | Manbo.CommandInteraction | Manbo.ComponentInteraction | null;
    protected dispose(interaction: Manbo.AutocompleteInteraction | Manbo.CommandInteraction | Manbo.ComponentInteraction): Manbo.AutocompleteInteraction | Manbo.CommandInteraction | Manbo.ComponentInteraction | null;
}
/**
 * Await a component interaction.
 * @param client The Manbo client to apply the collector on.
 * @param options The options to await the component interaction with.
 */
export declare function awaitComponentInteractions<T extends ComponentTypes = ComponentTypes>(client: Manbo.Client, options?: InteractionCollectorOptionsWithGenerics<typeof Manbo.Constants.InteractionTypes.MESSAGE_COMPONENT, T>): Promise<MappedComponentTypes[T] | null>;
//# sourceMappingURL=InteractionCollector.d.ts.map