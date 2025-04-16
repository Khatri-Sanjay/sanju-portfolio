import {StorageKey} from '../enum/storage-key.enum';

export type StorageSubscription = { remove: () => void; }
export type StorageListener = (key: StorageKey) => void;

export interface IStorage {
    getNumber(key: StorageKey, defaultValue: number): number;
    getString(key: StorageKey, defaultValue: string): string;
    getBoolean(key: StorageKey, defaultValue: boolean): boolean;
    getBigInt(key: StorageKey, defaultValue: bigint): bigint;
    getItem<T>(key: StorageKey): T | undefined;

    set(key: StorageKey, value: boolean | number | string | bigint): void;
    setItem<T>(key: StorageKey, value: T): void;

    delete(key: StorageKey): void;
    deleteAll(): void;

    keys(): StorageKey[];
    has(key: StorageKey): boolean;

    listen(key: StorageKey, listener: StorageListener): StorageSubscription;
}
