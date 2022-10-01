import * as Manbo from 'manbo'

export type ButtonComponentInteraction<V extends Manbo.TextChannel | Manbo.Uncached = Manbo.TextChannel | Manbo.Uncached> = Manbo.ComponentInteraction<V> & {
    data: Manbo.ComponentInteractionButtonData
}

export type SelectMenuComponentInteraction<V extends Manbo.TextChannel | Manbo.Uncached = Manbo.TextChannel | Manbo.Uncached> = Manbo.ComponentInteraction<V> & {
    data: Manbo.ComponentInteractionSelectMenuData
}
