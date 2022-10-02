/// <reference types="node" />
import { EventEmitter } from 'node:events';
export declare type ListenerSignature<L> = {
    [E in keyof L]: (...args: any[]) => any;
};
export declare type DefaultListener = {
    [key: string]: (...args: any[]) => any;
};
export declare interface TypedEventEmitter<L extends ListenerSignature<L> = DefaultListener> extends EventEmitter {
    addListener<U extends keyof L>(event: U, listener: L[U]): this;
    emit<U extends keyof L>(event: U, ...args: Parameters<L[U]>): boolean;
    eventNames<U extends keyof L>(): U[];
    listenerCount(type: keyof L): number;
    listeners<U extends keyof L>(type: U): L[U][];
    off<U extends keyof L>(event: U, listener: L[U]): this;
    on<U extends keyof L>(event: U, listener: L[U]): this;
    once<U extends keyof L>(event: U, listener: L[U]): this;
    prependListener<U extends keyof L>(event: U, listener: L[U]): this;
    prependOnceListener<U extends keyof L>(event: U, listener: L[U]): this;
    rawListeners<U extends keyof L>(type: U): L[U][];
    removeAllListeners(event?: keyof L): this;
    removeListener<U extends keyof L>(event: U, listener: L[U]): this;
}
export declare class TypedEventEmitter extends EventEmitter {
}
export default TypedEventEmitter;
//# sourceMappingURL=TypedEventEmitter.d.ts.map