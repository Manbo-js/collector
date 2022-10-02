"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.awaitComponentInteractions = exports.InteractionCollector = void 0;
const Collector_1 = __importDefault(require("./Collector"));
const Manbo = __importStar(require("manbo"));
/** Collects interactions. Will automatically stop if the message, channel, or guild is deleted. */
class InteractionCollector extends Collector_1.default {
    /**
     * @param client The Manbo client to apply the collector on.
     * @param options The collector options.
     */
    constructor(client, options = {}) {
        super(options);
        this.client = client;
        this.options = options;
        this.channel = null;
        this.componentType = null;
        this.guildID = null;
        this.interactionType = null;
        this.messageID = null;
        this.messageInteractionID = null;
        this.messageID = options.message?.id ?? null;
        this.messageInteractionID = options.interaction?.id ?? null;
        this.channel = options.interaction?.channel ?? options.message?.channel ?? options.channel ?? null;
        this.guildID = options.interaction?.guildID ?? options.message?.guildID ?? options.guild?.id ?? (options.channel instanceof Manbo.GuildChannel ? options.channel.guild.id : null);
        this.componentType = options.componentType ?? null;
        this.interactionType = options.interactionType ?? null;
        const bulkDeleteListener = (messages) => {
            if (messages.find((message) => message.id === this.messageID))
                this.stop('messageDelete');
        };
        if (this.messageID || this.messageInteractionID) {
            this.handleMessageDeletion = this.handleMessageDeletion.bind(this);
            this.client.on('messageDelete', this.handleMessageDeletion);
            this.client.on('messageDeleteBulk', bulkDeleteListener);
        }
        if (this.channel) {
            this.handleChannelDeletion = this.handleChannelDeletion.bind(this);
            this.handleThreadDeletion = this.handleThreadDeletion.bind(this);
            this.client.on('channelDelete', this.handleChannelDeletion);
            this.client.on('threadDelete', this.handleThreadDeletion);
        }
        if (this.guildID) {
            this.handleGuildDeletion = this.handleGuildDeletion.bind(this);
            this.client.on('guildDelete', this.handleGuildDeletion);
        }
        this.client.on('interactionCreate', this.handleCollect);
        this.once('end', () => {
            this.client.removeListener('interactionCreate', this.handleCollect);
            this.client.removeListener('messageDelete', this.handleMessageDeletion);
            this.client.removeListener('messageDeleteBulk', bulkDeleteListener);
            this.client.removeListener('channelDelete', this.handleChannelDeletion);
            this.client.removeListener('threadDelete', this.handleThreadDeletion);
            this.client.removeListener('guildDelete', this.handleGuildDeletion);
        });
    }
    handleChannelDeletion(channel) {
        if (channel.id === this.channel?.id || (this.channel instanceof Manbo.GuildChannel && channel.id === this.channel.parentID)) {
            this.stop('channelDelete');
        }
    }
    handleGuildDeletion(guild) {
        if (guild.id === this.guildID) {
            this.stop('guildDelete');
        }
    }
    handleMessageDeletion(message) {
        if (message.id === this.messageID) {
            this.stop('messageDelete');
        }
        if ('interaction' in message && message.interaction?.id === this.messageInteractionID) {
            this.stop('messageDelete');
        }
    }
    handleThreadDeletion(thread) {
        if (thread.id === this.channel?.id) {
            this.stop('threadDelete');
        }
    }
    collect(interaction) {
        if (this.interactionType && interaction.type !== this.interactionType)
            return null;
        if (interaction.type === Manbo.Constants.InteractionTypes.MESSAGE_COMPONENT) {
            if (this.componentType && interaction.data.component_type !== this.componentType)
                return null;
            if (this.messageID && interaction.message.id !== this.messageID)
                return null;
            if (this.messageInteractionID && interaction.message.interaction?.id !== this.messageInteractionID)
                return null;
        }
        if (this.channel && interaction.channel.id !== this.channel.id)
            return null;
        if (this.guildID && interaction.guildID !== this.guildID)
            return null;
        return interaction;
    }
    dispose(interaction) {
        if (this.interactionType && interaction.type !== this.interactionType)
            return null;
        if (interaction.type === Manbo.Constants.InteractionTypes.MESSAGE_COMPONENT) {
            if (this.componentType && interaction.data.component_type !== this.componentType)
                return null;
            if (this.messageID && interaction.message.id !== this.messageID)
                return null;
            if (this.messageInteractionID && interaction.message.interaction?.id !== this.messageInteractionID)
                return null;
        }
        if (this.channel && interaction.channel.id !== this.channel.id)
            return null;
        if (this.guildID && interaction.guildID !== this.guildID)
            return null;
        return interaction;
    }
}
exports.InteractionCollector = InteractionCollector;
/**
 * Await a component interaction.
 * @param client The Manbo client to apply the collector on.
 * @param options The options to await the component interaction with.
 */
function awaitComponentInteractions(client, options = {}) {
    const newOptions = {
        ...options,
        interactionType: Manbo.Constants.InteractionTypes.MESSAGE_COMPONENT,
        max: 1
    };
    return new Promise((resolve) => {
        const collector = new InteractionCollector(client, newOptions);
        collector.once('end', (collectedInteractions) => {
            const interaction = collectedInteractions[0];
            if (interaction)
                resolve(interaction);
            else
                resolve(null);
        });
    });
}
exports.awaitComponentInteractions = awaitComponentInteractions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50ZXJhY3Rpb25Db2xsZWN0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9JbnRlcmFjdGlvbkNvbGxlY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDREQUF5RDtBQUV6RCw2Q0FBOEI7QUF5QzlCLG1HQUFtRztBQUNuRyxNQUFhLG9CQUFpTCxTQUFRLG1CQUF1RjtJQVF6Ujs7O09BR0c7SUFDSCxZQUEyQixNQUFvQixFQUFTLFVBQXlELEVBQUU7UUFDL0csS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRFMsV0FBTSxHQUFOLE1BQU0sQ0FBYztRQUFTLFlBQU8sR0FBUCxPQUFPLENBQW9EO1FBWDNHLFlBQU8sR0FBOEMsSUFBSSxDQUFBO1FBQ3pELGtCQUFhLEdBQWEsSUFBSSxDQUFBO1FBQzlCLFlBQU8sR0FBa0IsSUFBSSxDQUFBO1FBQzdCLG9CQUFlLEdBQWEsSUFBSSxDQUFBO1FBQ2hDLGNBQVMsR0FBa0IsSUFBSSxDQUFBO1FBQy9CLHlCQUFvQixHQUFrQixJQUFJLENBQUE7UUFTOUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxJQUFJLENBQUE7UUFDNUMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxJQUFJLElBQUksQ0FBQTtRQUMzRCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUUsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFBO1FBQ2xHLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUks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QUFDLENBQUMsQ0FBQTtJQUNOLENBQUMsQ0FBQyxDQUFBO0FBQ04sQ0FBQztBQWpCRCxnRUFpQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29sbGVjdG9yLCB7IENvbGxlY3Rvck9wdGlvbnMgfSBmcm9tICcuL0NvbGxlY3RvcidcclxuaW1wb3J0IHsgQnV0dG9uQ29tcG9uZW50SW50ZXJhY3Rpb24sIFNlbGVjdE1lbnVDb21wb25lbnRJbnRlcmFjdGlvbiB9IGZyb20gJy4uL3R5cGVzJ1xyXG5pbXBvcnQgKiBhcyBNYW5ibyBmcm9tICdtYW5ibydcclxuXHJcbmV4cG9ydCB0eXBlIENvbXBvbmVudFR5cGVzID1cclxuICAgIHR5cGVvZiBNYW5iby5Db25zdGFudHMuQ29tcG9uZW50VHlwZXMuQlVUVE9OXHJcbiAgICB8IHR5cGVvZiBNYW5iby5Db25zdGFudHMuQ29tcG9uZW50VHlwZXMuU0VMRUNUX01FTlVcclxuXHJcbmV4cG9ydCB0eXBlIEludGVyYWN0aW9uVHlwZXMgPSB0eXBlb2YgTWFuYm8uQ29uc3RhbnRzLkludGVyYWN0aW9uVHlwZXMuTUVTU0FHRV9DT01QT05FTlRcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTWFwcGVkQ29tcG9uZW50VHlwZXMge1xyXG4gICAgW01hbmJvLkNvbnN0YW50cy5Db21wb25lbnRUeXBlcy5CVVRUT05dOiBCdXR0b25Db21wb25lbnRJbnRlcmFjdGlvbjtcclxuICAgIFtNYW5iby5Db25zdGFudHMuQ29tcG9uZW50VHlwZXMuU0VMRUNUX01FTlVdOiBTZWxlY3RNZW51Q29tcG9uZW50SW50ZXJhY3Rpb247XHJcbn1cclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE1hcHBlZEludGVyYWN0aW9uVHlwZXNUb0NvbXBvbmVudFR5cGVzIHtcclxuICAgIFtNYW5iby5Db25zdGFudHMuSW50ZXJhY3Rpb25UeXBlcy5NRVNTQUdFX0NPTVBPTkVOVF06IE1hcHBlZENvbXBvbmVudFR5cGVzXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSW50ZXJhY3Rpb25Db2xsZWN0b3JPcHRpb25zIHtcclxuICAgIC8qKiBUaGUgY2hhbm5lbCB0byBsaXN0ZW4gdG8gaW50ZXJhY3Rpb25zIGZyb20uICovXHJcbiAgICBjaGFubmVsPzogTWFuYm8uVGV4dENoYW5uZWxcclxuICAgIC8qKiBUaGUgZ3VpbGQgdG8gbGlzdGVuIHRvIGludGVyYWN0aW9ucyBmcm9tLiAqL1xyXG4gICAgZ3VpbGQ/OiBNYW5iby5HdWlsZFxyXG4gICAgLyoqIFRoZSBpbnRlcmFjdGlvbiByZXNwb25zZSB0byBsaXN0ZW4gdG8gbWVzc2FnZSBjb21wb25lbnQgaW50ZXJhY3Rpb25zIGZyb20uICovXHJcbiAgICBpbnRlcmFjdGlvbj86IE1hbmJvLkF1dG9jb21wbGV0ZUludGVyYWN0aW9uIHwgTWFuYm8uQ29tbWFuZEludGVyYWN0aW9uIHwgTWFuYm8uQ29tcG9uZW50SW50ZXJhY3Rpb25cclxuICAgIC8qKiBUaGUgbWVzc2FnZSB0byBsaXN0ZW4gdG8gaW50ZXJhY3Rpb25zIGZyb20uICovXHJcbiAgICBtZXNzYWdlPzogTWFuYm8uTWVzc2FnZVxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBJbnRlcmFjdGlvbkNvbGxlY3Rvck9wdGlvbnNXaXRoR2VuZXJpY3M8SyBleHRlbmRzIEludGVyYWN0aW9uVHlwZXMsIFQgZXh0ZW5kcyBrZXlvZiBNYXBwZWRJbnRlcmFjdGlvblR5cGVzVG9Db21wb25lbnRUeXBlc1tLXT4gPVxyXG4gICAgQ29sbGVjdG9yT3B0aW9uczxNYXBwZWRJbnRlcmFjdGlvblR5cGVzVG9Db21wb25lbnRUeXBlc1tLXVtUXT5cclxuICAgICYge1xyXG4gICAgLyoqIFRoZSB0eXBlIG9mIGNvbXBvbmVudHMgdG8gbGlzdGVuIGZvci4gKi9cclxuICAgIGNvbXBvbmVudFR5cGU/OiBUO1xyXG4gICAgLyoqIFRoZSB0eXBlIG9mIGludGVyYWN0aW9ucyB0byBsaXN0ZW4gZm9yLiAqL1xyXG4gICAgaW50ZXJhY3Rpb25UeXBlPzogSztcclxufVxyXG4gICAgJiBJbnRlcmFjdGlvbkNvbGxlY3Rvck9wdGlvbnNcclxuXHJcbmV4cG9ydCB0eXBlIEludGVyYWN0aW9uQ29sbGVjdG9yRW5kUmVhc29ucyA9ICdndWlsZERlbGV0ZScgfCAnY2hhbm5lbERlbGV0ZScgfCAndGhyZWFkRGVsZXRlJyB8ICdtZXNzYWdlRGVsZXRlJztcclxuXHJcbi8qKiBDb2xsZWN0cyBpbnRlcmFjdGlvbnMuIFdpbGwgYXV0b21hdGljYWxseSBzdG9wIGlmIHRoZSBtZXNzYWdlLCBjaGFubmVsLCBvciBndWlsZCBpcyBkZWxldGVkLiAqL1xyXG5leHBvcnQgY2xhc3MgSW50ZXJhY3Rpb25Db2xsZWN0b3I8SyBleHRlbmRzIEludGVyYWN0aW9uVHlwZXMgPSBJbnRlcmFjdGlvblR5cGVzLCBUIGV4dGVuZHMga2V5b2YgTWFwcGVkSW50ZXJhY3Rpb25UeXBlc1RvQ29tcG9uZW50VHlwZXNbS10gPSBrZXlvZiBNYXBwZWRJbnRlcmFjdGlvblR5cGVzVG9Db21wb25lbnRUeXBlc1tLXT4gZXh0ZW5kcyBDb2xsZWN0b3I8TWFwcGVkSW50ZXJhY3Rpb25UeXBlc1RvQ29tcG9uZW50VHlwZXNbS11bVF0sIEludGVyYWN0aW9uQ29sbGVjdG9yRW5kUmVhc29ucz4ge1xyXG4gICAgcHJpdmF0ZSBjaGFubmVsOiBNYW5iby5UZXh0Q2hhbm5lbCB8IE1hbmJvLlVuY2FjaGVkIHwgbnVsbCA9IG51bGxcclxuICAgIHByaXZhdGUgY29tcG9uZW50VHlwZTogVCB8IG51bGwgPSBudWxsXHJcbiAgICBwcml2YXRlIGd1aWxkSUQ6IHN0cmluZyB8IG51bGwgPSBudWxsXHJcbiAgICBwcml2YXRlIGludGVyYWN0aW9uVHlwZTogSyB8IG51bGwgPSBudWxsXHJcbiAgICBwcml2YXRlIG1lc3NhZ2VJRDogc3RyaW5nIHwgbnVsbCA9IG51bGxcclxuICAgIHByaXZhdGUgbWVzc2FnZUludGVyYWN0aW9uSUQ6IHN0cmluZyB8IG51bGwgPSBudWxsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gY2xpZW50IFRoZSBNYW5ibyBjbGllbnQgdG8gYXBwbHkgdGhlIGNvbGxlY3RvciBvbi5cclxuICAgICAqIEBwYXJhbSBvcHRpb25zIFRoZSBjb2xsZWN0b3Igb3B0aW9ucy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHByaXZhdGUgY2xpZW50OiBNYW5iby5DbGllbnQsIHB1YmxpYyBvcHRpb25zOiBJbnRlcmFjdGlvbkNvbGxlY3Rvck9wdGlvbnNXaXRoR2VuZXJpY3M8SywgVD4gPSB7fSkge1xyXG4gICAgICAgIHN1cGVyKG9wdGlvbnMpXHJcblxyXG4gICAgICAgIHRoaXMubWVzc2FnZUlEID0gb3B0aW9ucy5tZXNzYWdlPy5pZCA/PyBudWxsXHJcbiAgICAgICAgdGhpcy5tZXNzYWdlSW50ZXJhY3Rpb25JRCA9IG9wdGlvbnMuaW50ZXJhY3Rpb24/LmlkID8/IG51bGxcclxuICAgICAgICB0aGlzLmNoYW5uZWwgPSBvcHRpb25zLmludGVyYWN0aW9uPy5jaGFubmVsID8/IG9wdGlvbnMubWVzc2FnZT8uY2hhbm5lbCA/PyBvcHRpb25zLmNoYW5uZWwgPz8gbnVsbFxyXG4gICAgICAgIHRoaXMuZ3VpbGRJRCA9IG9wdGlvbnMuaW50ZXJhY3Rpb24/Lmd1aWxkSUQgPz8gb3B0aW9ucy5tZXNzYWdlPy5ndWlsZElEID8/IG9wdGlvbnMuZ3VpbGQ/LmlkID8/IChvcHRpb25zLmNoYW5uZWwgaW5zdGFuY2VvZiBNYW5iby5HdWlsZENoYW5uZWwgPyBvcHRpb25zLmNoYW5uZWwuZ3VpbGQuaWQgOiBudWxsKVxyXG4gICAgICAgIHRoaXMuY29tcG9uZW50VHlwZSA9IG9wdGlvbnMuY29tcG9uZW50VHlwZSA/PyBudWxsXHJcbiAgICAgICAgdGhpcy5pbnRlcmFjdGlvblR5cGUgPSBvcHRpb25zLmludGVyYWN0aW9uVHlwZSA/PyBudWxsXHJcblxyXG4gICAgICAgIGNvbnN0IGJ1bGtEZWxldGVMaXN0ZW5lciA9IChtZXNzYWdlczogTWFuYm8uUG9zc2libHlVbmNhY2hlZE1lc3NhZ2VbXSk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICBpZiAobWVzc2FnZXMuZmluZCgobWVzc2FnZSkgPT4gbWVzc2FnZS5pZCA9PT0gdGhpcy5tZXNzYWdlSUQpKSB0aGlzLnN0b3AoJ21lc3NhZ2VEZWxldGUnKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMubWVzc2FnZUlEIHx8IHRoaXMubWVzc2FnZUludGVyYWN0aW9uSUQpIHtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVNZXNzYWdlRGVsZXRpb24gPSB0aGlzLmhhbmRsZU1lc3NhZ2VEZWxldGlvbi5iaW5kKHRoaXMpXHJcbiAgICAgICAgICAgIHRoaXMuY2xpZW50Lm9uKCdtZXNzYWdlRGVsZXRlJywgdGhpcy5oYW5kbGVNZXNzYWdlRGVsZXRpb24pXHJcbiAgICAgICAgICAgIHRoaXMuY2xpZW50Lm9uKCdtZXNzYWdlRGVsZXRlQnVsaycsIGJ1bGtEZWxldGVMaXN0ZW5lcilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNoYW5uZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVDaGFubmVsRGVsZXRpb24gPSB0aGlzLmhhbmRsZUNoYW5uZWxEZWxldGlvbi5iaW5kKHRoaXMpXHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlVGhyZWFkRGVsZXRpb24gPSB0aGlzLmhhbmRsZVRocmVhZERlbGV0aW9uLmJpbmQodGhpcylcclxuICAgICAgICAgICAgdGhpcy5jbGllbnQub24oJ2NoYW5uZWxEZWxldGUnLCB0aGlzLmhhbmRsZUNoYW5uZWxEZWxldGlvbilcclxuICAgICAgICAgICAgdGhpcy5jbGllbnQub24oJ3RocmVhZERlbGV0ZScsIHRoaXMuaGFuZGxlVGhyZWFkRGVsZXRpb24pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5ndWlsZElEKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlR3VpbGREZWxldGlvbiA9IHRoaXMuaGFuZGxlR3VpbGREZWxldGlvbi5iaW5kKHRoaXMpXHJcbiAgICAgICAgICAgIHRoaXMuY2xpZW50Lm9uKCdndWlsZERlbGV0ZScsIHRoaXMuaGFuZGxlR3VpbGREZWxldGlvbilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY2xpZW50Lm9uKCdpbnRlcmFjdGlvbkNyZWF0ZScsIHRoaXMuaGFuZGxlQ29sbGVjdClcclxuXHJcbiAgICAgICAgdGhpcy5vbmNlKCdlbmQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdpbnRlcmFjdGlvbkNyZWF0ZScsIHRoaXMuaGFuZGxlQ29sbGVjdClcclxuICAgICAgICAgICAgdGhpcy5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ21lc3NhZ2VEZWxldGUnLCB0aGlzLmhhbmRsZU1lc3NhZ2VEZWxldGlvbilcclxuICAgICAgICAgICAgdGhpcy5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ21lc3NhZ2VEZWxldGVCdWxrJywgYnVsa0RlbGV0ZUxpc3RlbmVyKVxyXG4gICAgICAgICAgICB0aGlzLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignY2hhbm5lbERlbGV0ZScsIHRoaXMuaGFuZGxlQ2hhbm5lbERlbGV0aW9uKVxyXG4gICAgICAgICAgICB0aGlzLmNsaWVudC5yZW1vdmVMaXN0ZW5lcigndGhyZWFkRGVsZXRlJywgdGhpcy5oYW5kbGVUaHJlYWREZWxldGlvbilcclxuICAgICAgICAgICAgdGhpcy5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2d1aWxkRGVsZXRlJywgdGhpcy5oYW5kbGVHdWlsZERlbGV0aW9uKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBoYW5kbGVDaGFubmVsRGVsZXRpb24oY2hhbm5lbDogTWFuYm8uQW55Q2hhbm5lbCk6IHZvaWQge1xyXG4gICAgICAgIGlmIChjaGFubmVsLmlkID09PSB0aGlzLmNoYW5uZWw/LmlkIHx8ICh0aGlzLmNoYW5uZWwgaW5zdGFuY2VvZiBNYW5iby5HdWlsZENoYW5uZWwgJiYgY2hhbm5lbC5pZCA9PT0gdGhpcy5jaGFubmVsLnBhcmVudElEKSkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3AoJ2NoYW5uZWxEZWxldGUnKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhhbmRsZUd1aWxkRGVsZXRpb24oZ3VpbGQ6IE1hbmJvLkd1aWxkIHwgTWFuYm8uVW5jYWNoZWQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoZ3VpbGQuaWQgPT09IHRoaXMuZ3VpbGRJRCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3AoJ2d1aWxkRGVsZXRlJylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBoYW5kbGVNZXNzYWdlRGVsZXRpb24obWVzc2FnZTogTWFuYm8uUG9zc2libHlVbmNhY2hlZE1lc3NhZ2UpOiB2b2lkIHtcclxuICAgICAgICBpZiAobWVzc2FnZS5pZCA9PT0gdGhpcy5tZXNzYWdlSUQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9wKCdtZXNzYWdlRGVsZXRlJylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgnaW50ZXJhY3Rpb24nIGluIG1lc3NhZ2UgJiYgbWVzc2FnZS5pbnRlcmFjdGlvbj8uaWQgPT09IHRoaXMubWVzc2FnZUludGVyYWN0aW9uSUQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9wKCdtZXNzYWdlRGVsZXRlJylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBoYW5kbGVUaHJlYWREZWxldGlvbih0aHJlYWQ6IE1hbmJvLlRocmVhZENoYW5uZWwgfCBNYW5iby5VbmNhY2hlZCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aHJlYWQuaWQgPT09IHRoaXMuY2hhbm5lbD8uaWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9wKCd0aHJlYWREZWxldGUnKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY29sbGVjdChpbnRlcmFjdGlvbjogTWFuYm8uQXV0b2NvbXBsZXRlSW50ZXJhY3Rpb24gfCBNYW5iby5Db21tYW5kSW50ZXJhY3Rpb24gfCBNYW5iby5Db21wb25lbnRJbnRlcmFjdGlvbik6IE1hbmJvLkF1dG9jb21wbGV0ZUludGVyYWN0aW9uIHwgTWFuYm8uQ29tbWFuZEludGVyYWN0aW9uIHwgTWFuYm8uQ29tcG9uZW50SW50ZXJhY3Rpb24gfCBudWxsIHtcclxuICAgICAgICBpZiAodGhpcy5pbnRlcmFjdGlvblR5cGUgJiYgaW50ZXJhY3Rpb24udHlwZSAhPT0gdGhpcy5pbnRlcmFjdGlvblR5cGUpIHJldHVybiBudWxsXHJcbiAgICAgICAgaWYgKGludGVyYWN0aW9uLnR5cGUgPT09IE1hbmJvLkNvbnN0YW50cy5JbnRlcmFjdGlvblR5cGVzLk1FU1NBR0VfQ09NUE9ORU5UKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbXBvbmVudFR5cGUgJiYgaW50ZXJhY3Rpb24uZGF0YS5jb21wb25lbnRfdHlwZSAhPT0gdGhpcy5jb21wb25lbnRUeXBlKSByZXR1cm4gbnVsbFxyXG4gICAgICAgICAgICBpZiAodGhpcy5tZXNzYWdlSUQgJiYgaW50ZXJhY3Rpb24ubWVzc2FnZS5pZCAhPT0gdGhpcy5tZXNzYWdlSUQpIHJldHVybiBudWxsXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1lc3NhZ2VJbnRlcmFjdGlvbklEICYmIGludGVyYWN0aW9uLm1lc3NhZ2UuaW50ZXJhY3Rpb24/LmlkICE9PSB0aGlzLm1lc3NhZ2VJbnRlcmFjdGlvbklEKSByZXR1cm4gbnVsbFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jaGFubmVsICYmIGludGVyYWN0aW9uLmNoYW5uZWwuaWQgIT09IHRoaXMuY2hhbm5lbC5pZCkgcmV0dXJuIG51bGxcclxuICAgICAgICBpZiAodGhpcy5ndWlsZElEICYmIGludGVyYWN0aW9uLmd1aWxkSUQgIT09IHRoaXMuZ3VpbGRJRCkgcmV0dXJuIG51bGxcclxuXHJcbiAgICAgICAgcmV0dXJuIGludGVyYWN0aW9uXHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGRpc3Bvc2UoaW50ZXJhY3Rpb246IE1hbmJvLkF1dG9jb21wbGV0ZUludGVyYWN0aW9uIHwgTWFuYm8uQ29tbWFuZEludGVyYWN0aW9uIHwgTWFuYm8uQ29tcG9uZW50SW50ZXJhY3Rpb24pOiBNYW5iby5BdXRvY29tcGxldGVJbnRlcmFjdGlvbiB8IE1hbmJvLkNvbW1hbmRJbnRlcmFjdGlvbiB8IE1hbmJvLkNvbXBvbmVudEludGVyYWN0aW9uIHwgbnVsbCB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW50ZXJhY3Rpb25UeXBlICYmIGludGVyYWN0aW9uLnR5cGUgIT09IHRoaXMuaW50ZXJhY3Rpb25UeXBlKSByZXR1cm4gbnVsbFxyXG4gICAgICAgIGlmIChpbnRlcmFjdGlvbi50eXBlID09PSBNYW5iby5Db25zdGFudHMuSW50ZXJhY3Rpb25UeXBlcy5NRVNTQUdFX0NPTVBPTkVOVCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jb21wb25lbnRUeXBlICYmIGludGVyYWN0aW9uLmRhdGEuY29tcG9uZW50X3R5cGUgIT09IHRoaXMuY29tcG9uZW50VHlwZSkgcmV0dXJuIG51bGxcclxuICAgICAgICAgICAgaWYgKHRoaXMubWVzc2FnZUlEICYmIGludGVyYWN0aW9uLm1lc3NhZ2UuaWQgIT09IHRoaXMubWVzc2FnZUlEKSByZXR1cm4gbnVsbFxyXG4gICAgICAgICAgICBpZiAodGhpcy5tZXNzYWdlSW50ZXJhY3Rpb25JRCAmJiBpbnRlcmFjdGlvbi5tZXNzYWdlLmludGVyYWN0aW9uPy5pZCAhPT0gdGhpcy5tZXNzYWdlSW50ZXJhY3Rpb25JRCkgcmV0dXJuIG51bGxcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY2hhbm5lbCAmJiBpbnRlcmFjdGlvbi5jaGFubmVsLmlkICE9PSB0aGlzLmNoYW5uZWwuaWQpIHJldHVybiBudWxsXHJcbiAgICAgICAgaWYgKHRoaXMuZ3VpbGRJRCAmJiBpbnRlcmFjdGlvbi5ndWlsZElEICE9PSB0aGlzLmd1aWxkSUQpIHJldHVybiBudWxsXHJcblxyXG4gICAgICAgIHJldHVybiBpbnRlcmFjdGlvblxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQXdhaXQgYSBjb21wb25lbnQgaW50ZXJhY3Rpb24uXHJcbiAqIEBwYXJhbSBjbGllbnQgVGhlIE1hbmJvIGNsaWVudCB0byBhcHBseSB0aGUgY29sbGVjdG9yIG9uLlxyXG4gKiBAcGFyYW0gb3B0aW9ucyBUaGUgb3B0aW9ucyB0byBhd2FpdCB0aGUgY29tcG9uZW50IGludGVyYWN0aW9uIHdpdGguXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYXdhaXRDb21wb25lbnRJbnRlcmFjdGlvbnM8VCBleHRlbmRzIENvbXBvbmVudFR5cGVzID0gQ29tcG9uZW50VHlwZXM+KGNsaWVudDogTWFuYm8uQ2xpZW50LCBvcHRpb25zOiBJbnRlcmFjdGlvbkNvbGxlY3Rvck9wdGlvbnNXaXRoR2VuZXJpY3M8dHlwZW9mIE1hbmJvLkNvbnN0YW50cy5JbnRlcmFjdGlvblR5cGVzLk1FU1NBR0VfQ09NUE9ORU5ULCBUPiA9IHt9KTogUHJvbWlzZTxNYXBwZWRDb21wb25lbnRUeXBlc1tUXSB8IG51bGw+IHtcclxuICAgIGNvbnN0IG5ld09wdGlvbnMgPSB7XHJcbiAgICAgICAgLi4ub3B0aW9ucyxcclxuICAgICAgICBpbnRlcmFjdGlvblR5cGU6IE1hbmJvLkNvbnN0YW50cy5JbnRlcmFjdGlvblR5cGVzLk1FU1NBR0VfQ09NUE9ORU5ULFxyXG4gICAgICAgIG1heDogMVxyXG4gICAgfSBhcyBJbnRlcmFjdGlvbkNvbGxlY3Rvck9wdGlvbnNXaXRoR2VuZXJpY3M8dHlwZW9mIE1hbmJvLkNvbnN0YW50cy5JbnRlcmFjdGlvblR5cGVzLk1FU1NBR0VfQ09NUE9ORU5ULCBUPlxyXG5cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxNYXBwZWRDb21wb25lbnRUeXBlc1tUXSB8IG51bGw+KChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY29sbGVjdG9yID0gbmV3IEludGVyYWN0aW9uQ29sbGVjdG9yKGNsaWVudCwgbmV3T3B0aW9ucylcclxuXHJcbiAgICAgICAgY29sbGVjdG9yLm9uY2UoJ2VuZCcsIChjb2xsZWN0ZWRJbnRlcmFjdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaW50ZXJhY3Rpb24gPSBjb2xsZWN0ZWRJbnRlcmFjdGlvbnNbMF1cclxuXHJcbiAgICAgICAgICAgIGlmIChpbnRlcmFjdGlvbikgcmVzb2x2ZShpbnRlcmFjdGlvbilcclxuICAgICAgICAgICAgZWxzZSByZXNvbHZlKG51bGwpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn1cclxuIl19