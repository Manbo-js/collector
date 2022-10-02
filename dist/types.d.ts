import * as Manbo from 'manbo';
export declare type ButtonComponentInteraction<V extends Manbo.TextChannel | Manbo.Uncached = Manbo.TextChannel | Manbo.Uncached> = Manbo.ComponentInteraction<V> & {
    data: Manbo.ComponentInteractionButtonData;
};
export declare type SelectMenuComponentInteraction<V extends Manbo.TextChannel | Manbo.Uncached = Manbo.TextChannel | Manbo.Uncached> = Manbo.ComponentInteraction<V> & {
    data: Manbo.ComponentInteractionSelectMenuData;
};
//# sourceMappingURL=types.d.ts.map