import { CryptoJsUtil } from "../crypto-js-util";
import { IStorage, StorageListener, StorageSubscription } from "./interface/storage.interface";
import { StorageOptions } from './interface/storage-options.interface';
import { StorageKey } from './enum/storage-key.enum';

/**
 * Implements a cache storage mechanism with optional encryption support
 * and subscription capabilities for change notifications.
 * Enhanced to properly handle the predefined StorageKey enum values.
 */
export class StorageUtils implements IStorage {
    private readonly options: StorageOptions;
    private readonly cacheStore: Storage;
    private readonly subscriptions: Record<StorageKey, StorageListener[]> = {} as Record<StorageKey, StorageListener[]>;
    private readonly internalSubscriptions: Partial<Record<StorageKey, BroadcastChannel>> = {};

    /**
     * Creates a new StorageUtils instance
     * @param options Configuration options for cache storage
     * @param storage Optional storage implementation (defaults to sessionStorage)
     */
    constructor(
        options: Partial<StorageOptions> = {},
        storage?: Storage
    ) {
        // Verify the storage environment is available
        if (!storage && (!window || !('sessionStorage' in window) || typeof window.sessionStorage !== "object")) {
            throw new Error("SessionStorage can only be initialized in a browser environment");
        }

        this.options = Object.assign({
            identifier: "session",
            encrypted: false
        }, options);

        this.cacheStore = storage ?? sessionStorage;
    }

    /**
     * Register a listener for changes to a specific key
     * @param key Storage key to listen for changes
     * @param listener Callback function to invoke when changes occur
     * @returns A subscription object with a remove method
     */
    public listen(key: StorageKey, listener: StorageListener): StorageSubscription {
        return this.subscribe(key, listener);
    }

    /**
     * Remove an item from storage by key
     * @param key Key to remove
     */
    public delete(key: StorageKey): void {
        this.cacheStore.removeItem(key);
        this.notifyChange(key);
    }

    /**
     * Clear all items from storage
     */
    public deleteAll(): void {
        this.cacheStore.clear();
        // Notify all subscriptions about the clear operation
        Object.values(StorageKey).forEach(key => {
            if (this.subscriptions[key]) {
                this.notifyChange(key);
            }
        });
    }

    /**
     * Get a BigInt value from storage
     * @param key Storage key
     * @param defaultValue Default value if key doesn't exist
     * @returns The stored value or default value
     */
    public getBigInt(key: StorageKey, defaultValue: bigint): bigint {
        return this.getItem<bigint>(key) ?? defaultValue;
    }

    /**
     * Get a boolean value from storage
     * @param key Storage key
     * @param defaultValue Default value if key doesn't exist
     * @returns The stored value or default value
     */
    public getBoolean(key: StorageKey, defaultValue: boolean): boolean {
        return this.getItem<boolean>(key) ?? defaultValue;
    }

    /**
     * Get a number value from storage
     * @param key Storage key
     * @param defaultValue Default value if key doesn't exist
     * @returns The stored value or default value
     */
    public getNumber(key: StorageKey, defaultValue: number): number {
        return this.getItem<number>(key) ?? defaultValue;
    }

    /**
     * Get a generic item from storage
     * @param key Storage key
     * @returns The stored value or undefined
     */
    public getItem<T>(key: StorageKey): T | undefined {
        return this.prepareCached<T>(this.cacheStore.getItem(key), undefined, this.options.encrypted);
    }

    /**
     * Get a string value from storage
     * @param key Storage key
     * @param defaultValue Default value if key doesn't exist
     * @returns The stored value or default value
     */
    public getString(key: StorageKey, defaultValue: string): string {
        let cached = this.cacheStore.getItem(key);
        if (cached && this.options.encrypted) {
            cached = this.decrypt(cached);
        }
        return cached ?? defaultValue;
    }

    /**
     * Set a primitive value in storage
     * @param key Storage key
     * @param value Value to store
     */
    public set(key: StorageKey, value: boolean | number | string | bigint): void {
        if (typeof value === "string") {
            const storedValue = this.options.encrypted ? this.encrypt(value) : value;
            this.cacheStore.setItem(key, storedValue);
        } else {
            this.setItem(key, value);
        }
        this.notifyChange(key);
    }

    /**
     * Set a generic item in storage
     * @param key Storage key
     * @param value Value to store
     */
    public setItem<T>(key: StorageKey, value: T): void {
        this.cacheStore.setItem(key, this.prepareObject(value, this.options.encrypted));
        this.notifyChange(key);
    }

    /**
     * Check if a key exists in storage
     * @param key Storage key to check
     * @returns True if the key exists
     */
    public has(key: StorageKey): boolean {
        return this.cacheStore.getItem(key) !== null;
    }

    /**
     * Get all keys in storage that match the StorageKey enum
     * @returns Array of storage keys as StorageKey enum values
     */
    public keys(): StorageKey[] {
        const allKeys = Object.keys(this.cacheStore);
        return allKeys.filter(key =>
            Object.values(StorageKey).includes(key as StorageKey)
        ) as StorageKey[];
    }

    /**
     * Encrypt a string value
     * @param data Data to encrypt
     * @returns Encrypted string
     */
    public encrypt(data: string): string {
        return CryptoJsUtil.encrypt(data);
    }

    /**
     * Decrypt a string value
     * @param data Data to decrypt
     * @returns Decrypted string
     */
    public decrypt(data: string): string {
        return CryptoJsUtil.decrypt(data);
    }

    /**
     * Prepare cached data for retrieval
     * @param rawData Raw data from storage
     * @param defaultValue Default value if parsing fails
     * @param encrypted Whether the data is encrypted
     * @returns Parsed data or default value
     */
    private prepareCached<I>(rawData?: string | null, defaultValue?: I, encrypted?: boolean): I | undefined {
        if (rawData === null || rawData === undefined) {
            return undefined;
        }

        try {
            if (encrypted) {
                rawData = this.decrypt(rawData);
            }
            return JSON.parse(rawData);
        } catch (error) {
            return defaultValue ?? undefined;
        }
    }

    /**
     * Prepare an object for storage
     * @param value Value to prepare
     * @param encrypted Whether to encrypt the value
     * @returns String representation of the value
     */
    private prepareObject(value?: unknown, encrypted?: boolean): string {
        if (value === null || value === undefined) {
            return "";
        }

        const data = typeof value === "string" ? `"${value}"` : JSON.stringify(value);

        if (encrypted) {
            return this.encrypt(data);
        }
        return data;
    }

    /**
     * Notify subscribers about changes to a key
     * @param key Key that changed
     */
    private notifyChange(key: StorageKey): void {
        // Notify local listeners
        this.subscriptions?.[key]?.forEach((listener) => {
            listener(key);
        });

        // Notify across browser contexts
        this.internalSubscriptions?.[key]?.postMessage({ key });
    }

    /**
     * Clean up subscription resources when no longer needed
     * @param key Key to clean up
     */
    private cleanupSubscription(key: StorageKey): void {
        if (this.subscriptions?.[key]?.length) {
            return;
        }

        this.internalSubscriptions?.[key]?.close();
        delete this.internalSubscriptions?.[key];
    }

    /**
     * Subscribe to changes for a specific key
     * @param key Key to subscribe to
     * @param listener Callback function
     * @returns Subscription object
     */
    private subscribe(key: StorageKey, listener: StorageListener): StorageSubscription {
        // Initialize the subscription array if needed
        if (!this.subscriptions[key]) {
            this.subscriptions[key] = [];
        }

        // Add the listener
        this.subscriptions[key].push(listener);

        // Create a broadcast channel if needed
        if (!this.internalSubscriptions[key]) {
            const channelId = `${this.options.identifier}_${String(this.options.encrypted)}_${key}`;
            const channel = new BroadcastChannel(channelId);

            channel.onmessage = (event: MessageEvent<{ key: StorageKey }>) => {
                this.notifyChange(event.data.key);
            };

            this.internalSubscriptions[key] = channel;
        }

        // Return an object with methods to manage the subscription
        return {
            remove: () => {
                const index = this.subscriptions[key]?.indexOf(listener);
                if (index !== undefined && index > -1) {
                    this.subscriptions[key].splice(index, 1);
                    this.cleanupSubscription(key);
                }
            }
        };
    }
}
