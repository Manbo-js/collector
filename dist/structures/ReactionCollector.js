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
exports.awaitReactions = exports.ReactionCollector = void 0;
const Collector_1 = __importDefault(require("./Collector"));
const Manbo = __importStar(require("manbo"));
class ReactionCollector extends Collector_1.default {
    /**
     * @param client The Manbo client to apply the collector on.
     * @param message The message to apply collector.
     * @param options The collector options.
     */
    constructor(client, message, options = {}) {
        super(options);
        this.client = client;
        this.message = message;
        this.options = options;
        const bulkDeleteListener = (messages) => {
            if (messages.find((message) => message.id === this.message.id))
                this.stop('messageDelete');
        };
        this.empty = this.empty.bind(this);
        this.handleChannelDeletion = this.handleChannelDeletion.bind(this);
        this.handleThreadDeletion = this.handleThreadDeletion.bind(this);
        this.handleGuildDeletion = this.handleGuildDeletion.bind(this);
        this.handleMessageDeletion = this.handleMessageDeletion.bind(this);
        this.client.on('messageReactionAdd', this.handleCollect);
        this.client.on('messageReactionRemove', this.handleDispose);
        this.client.on('messageReactionRemoveAll', this.empty);
        this.client.on('messageDelete', this.handleMessageDeletion);
        this.client.on('messageDeleteBulk', bulkDeleteListener);
        this.client.on('channelDelete', this.handleChannelDeletion);
        this.client.on('threadDelete', this.handleThreadDeletion);
        this.client.on('guildDelete', this.handleGuildDeletion);
        this.once('end', () => {
            this.client.removeListener('messageReactionAdd', this.handleCollect);
            this.client.removeListener('messageReactionRemove', this.handleDispose);
            this.client.removeListener('messageReactionRemoveAll', this.empty);
            this.client.removeListener('messageDelete', this.handleMessageDeletion);
            this.client.removeListener('messageDeleteBulk', bulkDeleteListener);
            this.client.removeListener('channelDelete', this.handleChannelDeletion);
            this.client.removeListener('threadDelete', this.handleThreadDeletion);
            this.client.removeListener('guildDelete', this.handleGuildDeletion);
        });
    }
    handleChannelDeletion(channel) {
        if (channel.id === this.message.channel.id || (this.message.channel instanceof Manbo.GuildChannel && channel.id === this.message.channel.parentID)) {
            this.stop('channelDelete');
        }
    }
    handleGuildDeletion(guild) {
        if (this.message.channel instanceof Manbo.GuildChannel) {
            if (guild.id === this.message.guildID) {
                this.stop('guildDelete');
            }
        }
    }
    handleMessageDeletion(message) {
        if (message.id === this.message.id) {
            this.stop('messageDelete');
        }
    }
    handleThreadDeletion(thread) {
        if (thread.id === this.message.channel.id) {
            this.stop('threadDelete');
        }
    }
    collect(message, reaction, user) {
        if (message.id !== this.message.id)
            return null;
        return {
            reaction,
            message,
            user
        };
    }
    dispose(message, reaction, userId) {
        if (message.id !== this.message.id)
            return null;
        return {
            reaction,
            message,
            user: {
                id: userId
            }
        };
    }
}
exports.ReactionCollector = ReactionCollector;
/**
 * Await reactions.
 * @param client The Manbo client to apply the collector on.
 * @param message The message to await reactions from.
 * @param options The options to await the reactions with.
 */
function awaitReactions(client, message, options = {}) {
    return new Promise((resolve) => {
        const collector = new ReactionCollector(client, message, options);
        collector.once('end', (collectedReactions) => {
            resolve(collectedReactions);
        });
    });
}
exports.awaitReactions = awaitReactions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVhY3Rpb25Db2xsZWN0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9SZWFjdGlvbkNvbGxlY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDREQUF5RDtBQUN6RCw2Q0FBOEI7QUFhOUIsTUFBYSxpQkFBMkMsU0FBUSxtQkFBNEQ7SUFDeEg7Ozs7T0FJRztJQUNILFlBQTJCLE1BQW9CLEVBQVUsT0FBVSxFQUFTLFVBQWtELEVBQUU7UUFDNUgsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRFMsV0FBTSxHQUFOLE1BQU0sQ0FBYztRQUFVLFlBQU8sR0FBUCxPQUFPLENBQUc7UUFBUyxZQUFPLEdBQVAsT0FBTyxDQUE2QztRQUc1SCxNQUFNLGtCQUFrQixHQUFHLENBQUMsUUFBeUMsRUFBUSxFQUFFO1lBQzNFLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFBO1FBQzlGLENBQUMsQ0FBQTtRQUVELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDbEMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDbEUsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDaEUsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDOUQsSUFBSSxD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QUFrQixFQUFFLEVBQUU7WUFDekMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUE7UUFDL0IsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDLENBQUMsQ0FBQTtBQUNOLENBQUM7QUFSRCx3Q0FRQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb2xsZWN0b3IsIHsgQ29sbGVjdG9yT3B0aW9ucyB9IGZyb20gJy4vQ29sbGVjdG9yJ1xyXG5pbXBvcnQgKiBhcyBNYW5ibyBmcm9tICdtYW5ibydcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ29sbGVjdGVkUmVhY3Rpb248VCBleHRlbmRzIE1hbmJvLk1lc3NhZ2U+IHtcclxuICAgIC8qKiBUaGUgbWVzc2FnZSB0aGlzIHJlYWN0aW9uIGlzIGZyb20uICovXHJcbiAgICBtZXNzYWdlOiBUO1xyXG4gICAgLyoqIFRoZSByZWFjdGlvbiBjb2xsZWN0ZWQuICovXHJcbiAgICByZWFjdGlvbjogTWFuYm8uUGFydGlhbEVtb2ppO1xyXG4gICAgLyoqIFRoZSB1c2VyIHdobyByZWFjdGVkLiAqL1xyXG4gICAgdXNlcjogTWFuYm8uTWVtYmVyIHwgTWFuYm8uVW5jYWNoZWQ7XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIFJlYWN0aW9uQ29sbGVjdG9yRW5kUmVhc29ucyA9ICdndWlsZERlbGV0ZScgfCAnY2hhbm5lbERlbGV0ZScgfCAndGhyZWFkRGVsZXRlJyB8ICdtZXNzYWdlRGVsZXRlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBSZWFjdGlvbkNvbGxlY3RvcjxUIGV4dGVuZHMgTWFuYm8uTWVzc2FnZT4gZXh0ZW5kcyBDb2xsZWN0b3I8Q29sbGVjdGVkUmVhY3Rpb248VD4sIFJlYWN0aW9uQ29sbGVjdG9yRW5kUmVhc29ucz4ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gY2xpZW50IFRoZSBNYW5ibyBjbGllbnQgdG8gYXBwbHkgdGhlIGNvbGxlY3RvciBvbi5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlIFRoZSBtZXNzYWdlIHRvIGFwcGx5IGNvbGxlY3Rvci5cclxuICAgICAqIEBwYXJhbSBvcHRpb25zIFRoZSBjb2xsZWN0b3Igb3B0aW9ucy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHByaXZhdGUgY2xpZW50OiBNYW5iby5DbGllbnQsIHByaXZhdGUgbWVzc2FnZTogVCwgcHVibGljIG9wdGlvbnM6IENvbGxlY3Rvck9wdGlvbnM8Q29sbGVjdGVkUmVhY3Rpb248VD4+ID0ge30pIHtcclxuICAgICAgICBzdXBlcihvcHRpb25zKVxyXG5cclxuICAgICAgICBjb25zdCBidWxrRGVsZXRlTGlzdGVuZXIgPSAobWVzc2FnZXM6IE1hbmJvLlBvc3NpYmx5VW5jYWNoZWRNZXNzYWdlW10pOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgaWYgKG1lc3NhZ2VzLmZpbmQoKG1lc3NhZ2UpID0+IG1lc3NhZ2UuaWQgPT09IHRoaXMubWVzc2FnZS5pZCkpIHRoaXMuc3RvcCgnbWVzc2FnZURlbGV0ZScpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVtcHR5ID0gdGhpcy5lbXB0eS5iaW5kKHRoaXMpXHJcbiAgICAgICAgdGhpcy5oYW5kbGVDaGFubmVsRGVsZXRpb24gPSB0aGlzLmhhbmRsZUNoYW5uZWxEZWxldGlvbi5iaW5kKHRoaXMpXHJcbiAgICAgICAgdGhpcy5oYW5kbGVUaHJlYWREZWxldGlvbiA9IHRoaXMuaGFuZGxlVGhyZWFkRGVsZXRpb24uYmluZCh0aGlzKVxyXG4gICAgICAgIHRoaXMuaGFuZGxlR3VpbGREZWxldGlvbiA9IHRoaXMuaGFuZGxlR3VpbGREZWxldGlvbi5iaW5kKHRoaXMpXHJcbiAgICAgICAgdGhpcy5oYW5kbGVNZXNzYWdlRGVsZXRpb24gPSB0aGlzLmhhbmRsZU1lc3NhZ2VEZWxldGlvbi5iaW5kKHRoaXMpXHJcblxyXG4gICAgICAgIHRoaXMuY2xpZW50Lm9uKCdtZXNzYWdlUmVhY3Rpb25BZGQnLCB0aGlzLmhhbmRsZUNvbGxlY3QpXHJcbiAgICAgICAgdGhpcy5jbGllbnQub24oJ21lc3NhZ2VSZWFjdGlvblJlbW92ZScsIHRoaXMuaGFuZGxlRGlzcG9zZSlcclxuICAgICAgICB0aGlzLmNsaWVudC5vbignbWVzc2FnZVJlYWN0aW9uUmVtb3ZlQWxsJywgdGhpcy5lbXB0eSlcclxuICAgICAgICB0aGlzLmNsaWVudC5vbignbWVzc2FnZURlbGV0ZScsIHRoaXMuaGFuZGxlTWVzc2FnZURlbGV0aW9uKVxyXG4gICAgICAgIHRoaXMuY2xpZW50Lm9uKCdtZXNzYWdlRGVsZXRlQnVsaycsIGJ1bGtEZWxldGVMaXN0ZW5lcilcclxuICAgICAgICB0aGlzLmNsaWVudC5vbignY2hhbm5lbERlbGV0ZScsIHRoaXMuaGFuZGxlQ2hhbm5lbERlbGV0aW9uKVxyXG4gICAgICAgIHRoaXMuY2xpZW50Lm9uKCd0aHJlYWREZWxldGUnLCB0aGlzLmhhbmRsZVRocmVhZERlbGV0aW9uKVxyXG4gICAgICAgIHRoaXMuY2xpZW50Lm9uKCdndWlsZERlbGV0ZScsIHRoaXMuaGFuZGxlR3VpbGREZWxldGlvbilcclxuXHJcbiAgICAgICAgdGhpcy5vbmNlKCdlbmQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdtZXNzYWdlUmVhY3Rpb25BZGQnLCB0aGlzLmhhbmRsZUNvbGxlY3QpXHJcbiAgICAgICAgICAgIHRoaXMuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdtZXNzYWdlUmVhY3Rpb25SZW1vdmUnLCB0aGlzLmhhbmRsZURpc3Bvc2UpXHJcbiAgICAgICAgICAgIHRoaXMuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdtZXNzYWdlUmVhY3Rpb25SZW1vdmVBbGwnLCB0aGlzLmVtcHR5KVxyXG4gICAgICAgICAgICB0aGlzLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignbWVzc2FnZURlbGV0ZScsIHRoaXMuaGFuZGxlTWVzc2FnZURlbGV0aW9uKVxyXG4gICAgICAgICAgICB0aGlzLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignbWVzc2FnZURlbGV0ZUJ1bGsnLCBidWxrRGVsZXRlTGlzdGVuZXIpXHJcbiAgICAgICAgICAgIHRoaXMuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdjaGFubmVsRGVsZXRlJywgdGhpcy5oYW5kbGVDaGFubmVsRGVsZXRpb24pXHJcbiAgICAgICAgICAgIHRoaXMuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCd0aHJlYWREZWxldGUnLCB0aGlzLmhhbmRsZVRocmVhZERlbGV0aW9uKVxyXG4gICAgICAgICAgICB0aGlzLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignZ3VpbGREZWxldGUnLCB0aGlzLmhhbmRsZUd1aWxkRGVsZXRpb24pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhhbmRsZUNoYW5uZWxEZWxldGlvbihjaGFubmVsOiBNYW5iby5BbnlDaGFubmVsKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGNoYW5uZWwuaWQgPT09IHRoaXMubWVzc2FnZS5jaGFubmVsLmlkIHx8ICh0aGlzLm1lc3NhZ2UuY2hhbm5lbCBpbnN0YW5jZW9mIE1hbmJvLkd1aWxkQ2hhbm5lbCAmJiBjaGFubmVsLmlkID09PSB0aGlzLm1lc3NhZ2UuY2hhbm5lbC5wYXJlbnRJRCkpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9wKCdjaGFubmVsRGVsZXRlJylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBoYW5kbGVHdWlsZERlbGV0aW9uKGd1aWxkOiBNYW5iby5HdWlsZCB8IE1hbmJvLlVuY2FjaGVkKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMubWVzc2FnZS5jaGFubmVsIGluc3RhbmNlb2YgTWFuYm8uR3VpbGRDaGFubmVsKSB7XHJcbiAgICAgICAgICAgIGlmIChndWlsZC5pZCA9PT0gdGhpcy5tZXNzYWdlLmd1aWxkSUQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcCgnZ3VpbGREZWxldGUnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGFuZGxlTWVzc2FnZURlbGV0aW9uKG1lc3NhZ2U6IE1hbmJvLlBvc3NpYmx5VW5jYWNoZWRNZXNzYWdlKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKG1lc3NhZ2UuaWQgPT09IHRoaXMubWVzc2FnZS5pZCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3AoJ21lc3NhZ2VEZWxldGUnKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhhbmRsZVRocmVhZERlbGV0aW9uKHRocmVhZDogTWFuYm8uQW55VGhyZWFkQ2hhbm5lbCB8IE1hbmJvLlVuY2FjaGVkKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRocmVhZC5pZCA9PT0gdGhpcy5tZXNzYWdlLmNoYW5uZWwuaWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9wKCd0aHJlYWREZWxldGUnKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY29sbGVjdChtZXNzYWdlOiBULCByZWFjdGlvbjogTWFuYm8uUGFydGlhbEVtb2ppLCB1c2VyOiBNYW5iby5NZW1iZXIgfCBNYW5iby5VbmNhY2hlZCk6IENvbGxlY3RlZFJlYWN0aW9uPFQ+IHwgbnVsbCB7XHJcbiAgICAgICAgaWYgKG1lc3NhZ2UuaWQgIT09IHRoaXMubWVzc2FnZS5pZCkgcmV0dXJuIG51bGxcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVhY3Rpb24sXHJcbiAgICAgICAgICAgIG1lc3NhZ2UsXHJcbiAgICAgICAgICAgIHVzZXJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGRpc3Bvc2UobWVzc2FnZTogVCwgcmVhY3Rpb246IE1hbmJvLlBhcnRpYWxFbW9qaSwgdXNlcklkOiBzdHJpbmcpOiBDb2xsZWN0ZWRSZWFjdGlvbjxUPiB8IG51bGwge1xyXG4gICAgICAgIGlmIChtZXNzYWdlLmlkICE9PSB0aGlzLm1lc3NhZ2UuaWQpIHJldHVybiBudWxsXHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlYWN0aW9uLFxyXG4gICAgICAgICAgICBtZXNzYWdlLFxyXG4gICAgICAgICAgICB1c2VyOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogdXNlcklkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBd2FpdCByZWFjdGlvbnMuXHJcbiAqIEBwYXJhbSBjbGllbnQgVGhlIE1hbmJvIGNsaWVudCB0byBhcHBseSB0aGUgY29sbGVjdG9yIG9uLlxyXG4gKiBAcGFyYW0gbWVzc2FnZSBUaGUgbWVzc2FnZSB0byBhd2FpdCByZWFjdGlvbnMgZnJvbS5cclxuICogQHBhcmFtIG9wdGlvbnMgVGhlIG9wdGlvbnMgdG8gYXdhaXQgdGhlIHJlYWN0aW9ucyB3aXRoLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGF3YWl0UmVhY3Rpb25zPFQgZXh0ZW5kcyBNYW5iby5NZXNzYWdlPihjbGllbnQ6IE1hbmJvLkNsaWVudCwgbWVzc2FnZTogVCwgb3B0aW9uczogQ29sbGVjdG9yT3B0aW9uczxDb2xsZWN0ZWRSZWFjdGlvbjxUPj4gPSB7fSk6IFByb21pc2U8Q29sbGVjdGVkUmVhY3Rpb248VD5bXT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPENvbGxlY3RlZFJlYWN0aW9uPFQ+W10+KChyZXNvbHZlKTogdm9pZCA9PiB7XHJcbiAgICAgICAgY29uc3QgY29sbGVjdG9yID0gbmV3IFJlYWN0aW9uQ29sbGVjdG9yKGNsaWVudCwgbWVzc2FnZSwgb3B0aW9ucylcclxuXHJcbiAgICAgICAgY29sbGVjdG9yLm9uY2UoJ2VuZCcsIChjb2xsZWN0ZWRSZWFjdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgcmVzb2x2ZShjb2xsZWN0ZWRSZWFjdGlvbnMpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn1cclxuIl19