import TypedEventEmitter from './TypedEventEmitter';
export interface CollectorEvents<T, V extends string | BaseCollectorEndReasons> {
    /**
     * Emitted whenever something is collected.
     * @param collected The element collected.
     */
    collect(collected: T): any;
    /**
     * Emitted whenever something is disposed.
     * @param disposed The element disposed.
     */
    dispose(disposed: any): any;
    /**
     * Emitted whenever something is ignored.
     * @param ignored The element ignored.
     */
    ignore(ignored: T): any;
    /**
     * Emitted whenever the collector stops collecting.
     * @param collected The data collected by the collector.
     * @param reason The reason the collector has ended.
     */
    end(collected: T[], reason: V): any;
}
export interface CollectorOptions<T> {
    /** Whether to dispose data when it's deleted. */
    dispose?: boolean;
    /** How long to stop the collector after inactivity in milliseconds. */
    idle?: number;
    /** The maximum total amount of data to collect. */
    max?: number;
    /** How long to run the collector for in milliseconds. */
    time?: number;
    /**
     * The filter applied to this collector.
     * @param colleted The collected element to filter.
     */
    filter?(colleted: T): boolean | Promise<boolean>;
}
interface ResetTimerOptions {
    /** How long to stop the collector after inactivity in milliseconds. */
    idle?: number;
    /** How long to run the collector for in milliseconds. */
    time?: number;
}
export declare type BaseCollectorEndReasons = 'time' | 'idle' | 'limit' | 'user';
/** A base collector class to be extended from. */
export declare abstract class Collector<T, V extends string = string> extends TypedEventEmitter<CollectorEvents<T, V | BaseCollectorEndReasons>> {
    options: CollectorOptions<T>;
    private idleTimeout;
    private max;
    private timeout;
    protected endReason: V | BaseCollectorEndReasons | null;
    /** An array of all the data collected. */
    collected: T[];
    /** Whether this collector has stopped collecting. */
    ended: boolean;
    /**
     * The filter applied to this collector.
     * @param colleted The collected element to filter.
     */
    filter: (collected: T) => boolean | Promise<boolean>;
    protected collect(...args: any[]): any;
    protected dispose(...args: any[]): any;
    /**
     * @param options The collector options.
     */
    constructor(options?: CollectorOptions<T>);
    /**
     * Call this to handle an event as a collectable element.
     * @param toHandle The data to handle as an element.
     */
    handleCollect(toHandle: any): Promise<void>;
    /**
     * Call this to remove an element from the collection.
     * @param collected The collected element to dispose.
     */
    handleDispose(collected: any): Promise<void>;
    /** A promise that resolves whenever the next data is collected. */
    get next(): Promise<T>;
    [Symbol.asyncIterator](): AsyncGenerator<Awaited<T | undefined>>;
    /** Check whether this collector should have ended. */
    checkEnd(): boolean;
    /** Empty the collected data of this collector. */
    empty(): void;
    /**
     * Reset the time to end this collector.
     * @param options The options to reset the timer.
     */
    resetTimer({ time, idle }?: ResetTimerOptions): void;
    /**
     * Stop this collector.
     * @param reason The reason to stop this collector. Defaults to "user".
     */
    stop(reason?: V | BaseCollectorEndReasons): void;
}
export default Collector;
//# sourceMappingURL=Collector.d.ts.map