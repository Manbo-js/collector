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
exports.awaitMessages = exports.MessageCollector = void 0;
const Collector_1 = __importDefault(require("./Collector"));
const Manbo = __importStar(require("manbo"));
class MessageCollector extends Collector_1.default {
    /**
     * @param client The Manbo client to apply the collector on.
     * @param channel The channel to collect messages
     * @param options The collector options.
     */
    constructor(client, channel, options = {}) {
        super(options);
        this.client = client;
        this.channel = channel;
        this.options = options;
        const bulkDeleteListener = (messages) => {
            for (const message of messages.values())
                this.handleDispose(message);
        };
        this.handleChannelDeletion = this.handleChannelDeletion.bind(this);
        this.handleThreadDeletion = this.handleThreadDeletion.bind(this);
        this.handleGuildDeletion = this.handleGuildDeletion.bind(this);
        this.client.on('messageCreate', this.handleCollect);
        this.client.on('messageDelete', this.handleDispose);
        this.client.on('messageDeleteBulk', bulkDeleteListener);
        this.client.on('channelDelete', this.handleChannelDeletion);
        this.client.on('threadDelete', this.handleThreadDeletion);
        this.client.on('guildDelete', this.handleGuildDeletion);
        this.once('end', () => {
            this.client.removeListener('messageCreate', this.handleCollect);
            this.client.removeListener('messageDelete', this.handleDispose);
            this.client.removeListener('messageDeleteBulk', bulkDeleteListener);
            this.client.removeListener('channelDelete', this.handleChannelDeletion);
            this.client.removeListener('threadDelete', this.handleThreadDeletion);
            this.client.removeListener('guildDelete', this.handleGuildDeletion);
        });
    }
    handleChannelDeletion(channel) {
        if (channel.id === this.channel.id || (this.channel instanceof Manbo.GuildChannel && channel.id === this.channel.parentID)) {
            this.stop('channelDelete');
        }
    }
    handleGuildDeletion(guild) {
        if (this.channel instanceof Manbo.GuildChannel) {
            if (guild.id === this.channel.guild.id) {
                this.stop('guildDelete');
            }
        }
    }
    handleThreadDeletion(thread) {
        if (thread.id === this.channel.id) {
            this.stop('threadDelete');
        }
    }
    collect(message) {
        if (message.channel.id !== this.channel.id)
            return null;
        return message;
    }
    dispose(message) {
        if (message.channel?.id !== this.channel.id)
            return null;
        return message;
    }
}
exports.MessageCollector = MessageCollector;
/**
 * Await messages.
 * @param client The Manbo client to apply the collector on.
 * @param channel The channel to await messages from.
 * @param options The options to await the messages with.
 */
function awaitMessages(client, channel, options = {}) {
    return new Promise((resolve) => {
        const collector = new MessageCollector(client, channel, options);
        collector.once('end', (collectedMessages) => {
            resolve(collectedMessages);
        });
    });
}
exports.awaitMessages = awaitMessages;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVzc2FnZUNvbGxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJ1Y3R1cmVzL01lc3NhZ2VDb2xsZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0REFBeUQ7QUFDekQsNkNBQThCO0FBSTlCLE1BQWEsZ0JBQThDLFNBQVEsbUJBQXVEO0lBQ3RIOzs7O09BSUc7SUFDSCxZQUEyQixNQUFvQixFQUFVLE9BQVUsRUFBUyxVQUE4QyxFQUFFO1FBQ3hILEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQURTLFdBQU0sR0FBTixNQUFNLENBQWM7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFHO1FBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBeUM7UUFHeEgsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLFFBQXlDLEVBQVEsRUFBRTtZQUMzRSxLQUFLLE1BQU0sT0FBTyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7Z0JBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN4RSxDQUFDLENBQUE7UUFFRCxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNsRSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNoRSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUU5RCxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBQ25ELElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7UUFD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LEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBRWhFLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsRUFBRTtZQUN4QyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtRQUM5QixDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUMsQ0FBQyxDQUFBO0FBQ04sQ0FBQztBQVJELHNDQVFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvbGxlY3RvciwgeyBDb2xsZWN0b3JPcHRpb25zIH0gZnJvbSAnLi9Db2xsZWN0b3InXHJcbmltcG9ydCAqIGFzIE1hbmJvIGZyb20gJ21hbmJvJ1xyXG5cclxuZXhwb3J0IHR5cGUgTWVzc2FnZUNvbGxlY3RvckVuZFJlYXNvbnMgPSAnZ3VpbGREZWxldGUnIHwgJ2NoYW5uZWxEZWxldGUnIHwgJ3RocmVhZERlbGV0ZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgTWVzc2FnZUNvbGxlY3RvcjxUIGV4dGVuZHMgTWFuYm8uVGV4dENoYW5uZWw+IGV4dGVuZHMgQ29sbGVjdG9yPE1hbmJvLk1lc3NhZ2U8VD4sIE1lc3NhZ2VDb2xsZWN0b3JFbmRSZWFzb25zPiB7XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBjbGllbnQgVGhlIE1hbmJvIGNsaWVudCB0byBhcHBseSB0aGUgY29sbGVjdG9yIG9uLlxyXG4gICAgICogQHBhcmFtIGNoYW5uZWwgVGhlIGNoYW5uZWwgdG8gY29sbGVjdCBtZXNzYWdlc1xyXG4gICAgICogQHBhcmFtIG9wdGlvbnMgVGhlIGNvbGxlY3RvciBvcHRpb25zLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IocHJpdmF0ZSBjbGllbnQ6IE1hbmJvLkNsaWVudCwgcHJpdmF0ZSBjaGFubmVsOiBULCBwdWJsaWMgb3B0aW9uczogQ29sbGVjdG9yT3B0aW9uczxNYW5iby5NZXNzYWdlPFQ+PiA9IHt9KSB7XHJcbiAgICAgICAgc3VwZXIob3B0aW9ucylcclxuXHJcbiAgICAgICAgY29uc3QgYnVsa0RlbGV0ZUxpc3RlbmVyID0gKG1lc3NhZ2VzOiBNYW5iby5Qb3NzaWJseVVuY2FjaGVkTWVzc2FnZVtdKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiBtZXNzYWdlcy52YWx1ZXMoKSkgdGhpcy5oYW5kbGVEaXNwb3NlKG1lc3NhZ2UpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZUNoYW5uZWxEZWxldGlvbiA9IHRoaXMuaGFuZGxlQ2hhbm5lbERlbGV0aW9uLmJpbmQodGhpcylcclxuICAgICAgICB0aGlzLmhhbmRsZVRocmVhZERlbGV0aW9uID0gdGhpcy5oYW5kbGVUaHJlYWREZWxldGlvbi5iaW5kKHRoaXMpXHJcbiAgICAgICAgdGhpcy5oYW5kbGVHdWlsZERlbGV0aW9uID0gdGhpcy5oYW5kbGVHdWlsZERlbGV0aW9uLmJpbmQodGhpcylcclxuXHJcbiAgICAgICAgdGhpcy5jbGllbnQub24oJ21lc3NhZ2VDcmVhdGUnLCB0aGlzLmhhbmRsZUNvbGxlY3QpXHJcbiAgICAgICAgdGhpcy5jbGllbnQub24oJ21lc3NhZ2VEZWxldGUnLCB0aGlzLmhhbmRsZURpc3Bvc2UpXHJcbiAgICAgICAgdGhpcy5jbGllbnQub24oJ21lc3NhZ2VEZWxldGVCdWxrJywgYnVsa0RlbGV0ZUxpc3RlbmVyKVxyXG4gICAgICAgIHRoaXMuY2xpZW50Lm9uKCdjaGFubmVsRGVsZXRlJywgdGhpcy5oYW5kbGVDaGFubmVsRGVsZXRpb24pXHJcbiAgICAgICAgdGhpcy5jbGllbnQub24oJ3RocmVhZERlbGV0ZScsIHRoaXMuaGFuZGxlVGhyZWFkRGVsZXRpb24pXHJcbiAgICAgICAgdGhpcy5jbGllbnQub24oJ2d1aWxkRGVsZXRlJywgdGhpcy5oYW5kbGVHdWlsZERlbGV0aW9uKVxyXG5cclxuICAgICAgICB0aGlzLm9uY2UoJ2VuZCcsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ21lc3NhZ2VDcmVhdGUnLCB0aGlzLmhhbmRsZUNvbGxlY3QpXHJcbiAgICAgICAgICAgIHRoaXMuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdtZXNzYWdlRGVsZXRlJywgdGhpcy5oYW5kbGVEaXNwb3NlKVxyXG4gICAgICAgICAgICB0aGlzLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignbWVzc2FnZURlbGV0ZUJ1bGsnLCBidWxrRGVsZXRlTGlzdGVuZXIpXHJcbiAgICAgICAgICAgIHRoaXMuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdjaGFubmVsRGVsZXRlJywgdGhpcy5oYW5kbGVDaGFubmVsRGVsZXRpb24pXHJcbiAgICAgICAgICAgIHRoaXMuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCd0aHJlYWREZWxldGUnLCB0aGlzLmhhbmRsZVRocmVhZERlbGV0aW9uKVxyXG4gICAgICAgICAgICB0aGlzLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignZ3VpbGREZWxldGUnLCB0aGlzLmhhbmRsZUd1aWxkRGVsZXRpb24pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhhbmRsZUNoYW5uZWxEZWxldGlvbihjaGFubmVsOiBNYW5iby5BbnlDaGFubmVsKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGNoYW5uZWwuaWQgPT09IHRoaXMuY2hhbm5lbC5pZCB8fCAodGhpcy5jaGFubmVsIGluc3RhbmNlb2YgTWFuYm8uR3VpbGRDaGFubmVsICYmIGNoYW5uZWwuaWQgPT09IHRoaXMuY2hhbm5lbC5wYXJlbnRJRCkpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9wKCdjaGFubmVsRGVsZXRlJylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBoYW5kbGVHdWlsZERlbGV0aW9uKGd1aWxkOiBNYW5iby5HdWlsZCB8IE1hbmJvLlVuY2FjaGVkKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hhbm5lbCBpbnN0YW5jZW9mIE1hbmJvLkd1aWxkQ2hhbm5lbCkge1xyXG4gICAgICAgICAgICBpZiAoZ3VpbGQuaWQgPT09IHRoaXMuY2hhbm5lbC5ndWlsZC5pZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wKCdndWlsZERlbGV0ZScpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBoYW5kbGVUaHJlYWREZWxldGlvbih0aHJlYWQ6IE1hbmJvLkFueVRocmVhZENoYW5uZWwgfCBNYW5iby5VbmNhY2hlZCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aHJlYWQuaWQgPT09IHRoaXMuY2hhbm5lbC5pZCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3AoJ3RocmVhZERlbGV0ZScpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb2xsZWN0KG1lc3NhZ2U6IE1hbmJvLk1lc3NhZ2U8VD4pOiBNYW5iby5NZXNzYWdlPFQ+IHwgbnVsbCB7XHJcbiAgICAgICAgaWYgKG1lc3NhZ2UuY2hhbm5lbC5pZCAhPT0gdGhpcy5jaGFubmVsLmlkKSByZXR1cm4gbnVsbFxyXG5cclxuICAgICAgICByZXR1cm4gbWVzc2FnZVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBkaXNwb3NlKG1lc3NhZ2U6IE1hbmJvLlBvc3NpYmx5VW5jYWNoZWRNZXNzYWdlKTogTWFuYm8uUG9zc2libHlVbmNhY2hlZE1lc3NhZ2UgfCBudWxsIHtcclxuICAgICAgICBpZiAobWVzc2FnZS5jaGFubmVsPy5pZCAhPT0gdGhpcy5jaGFubmVsLmlkKSByZXR1cm4gbnVsbFxyXG5cclxuICAgICAgICByZXR1cm4gbWVzc2FnZVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQXdhaXQgbWVzc2FnZXMuXHJcbiAqIEBwYXJhbSBjbGllbnQgVGhlIE1hbmJvIGNsaWVudCB0byBhcHBseSB0aGUgY29sbGVjdG9yIG9uLlxyXG4gKiBAcGFyYW0gY2hhbm5lbCBUaGUgY2hhbm5lbCB0byBhd2FpdCBtZXNzYWdlcyBmcm9tLlxyXG4gKiBAcGFyYW0gb3B0aW9ucyBUaGUgb3B0aW9ucyB0byBhd2FpdCB0aGUgbWVzc2FnZXMgd2l0aC5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhd2FpdE1lc3NhZ2VzPFQgZXh0ZW5kcyBNYW5iby5UZXh0Q2hhbm5lbD4oY2xpZW50OiBNYW5iby5DbGllbnQsIGNoYW5uZWw6IFQsIG9wdGlvbnM6IENvbGxlY3Rvck9wdGlvbnM8TWFuYm8uTWVzc2FnZTxUPj4gPSB7fSk6IFByb21pc2U8TWFuYm8uTWVzc2FnZTxUPltdPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8TWFuYm8uTWVzc2FnZTxUPltdPigocmVzb2x2ZSk6IHZvaWQgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvbGxlY3RvciA9IG5ldyBNZXNzYWdlQ29sbGVjdG9yKGNsaWVudCwgY2hhbm5lbCwgb3B0aW9ucylcclxuXHJcbiAgICAgICAgY29sbGVjdG9yLm9uY2UoJ2VuZCcsIChjb2xsZWN0ZWRNZXNzYWdlcykgPT4ge1xyXG4gICAgICAgICAgICByZXNvbHZlKGNvbGxlY3RlZE1lc3NhZ2VzKVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59XHJcbiJdfQ==