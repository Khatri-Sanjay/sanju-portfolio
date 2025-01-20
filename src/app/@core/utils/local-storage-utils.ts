import { CryptoJsUtil } from './crypto-js-util';
import { ObjectUtil } from './object-util';
import {environment} from '../../../environment/environment';

export class LocalStorageUtil {
  /**
   * @description
   * Saves data into localStorage with encryption under the specified key.
   * Handles any type of data (string, number, object, etc.).
   * @param data The data to store.
   */
  public static setStorage(data: any): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage is not available. Data will not be saved.');
      return;
    }
    try {
      const currentDateTime = new Date();
      const metaData = {
        date: currentDateTime.toLocaleDateString(),
        day: currentDateTime.toLocaleString('en-US', { weekday: 'long' }),
        saveAt: currentDateTime.toLocaleTimeString()
      };

      const storageData = {
        ...data, ...metaData
      };
      const stringifyData = JSON.stringify(storageData);
      const encryptedData = CryptoJsUtil.encrypt(stringifyData);
      localStorage.setItem(environment.LOCAL_STORAGE_NAME, encryptedData);
    } catch (error) {
      console.error('Failed to encrypt or save data:', error);
    }
  }

  /**
   * @description
   * Retrieves data from localStorage using the specified key.
   * If data is encrypted, it decrypts it and parses the JSON.
   * @returns The stored data, or an empty LocalStorage instance if no data is found.
   */
  public static getStorage(): LocalStorage {
    if (typeof window === 'undefined' || !window.localStorage) {
      return new LocalStorage();
    }
    const storedData = localStorage.getItem(environment.LOCAL_STORAGE_NAME);
    if (ObjectUtil.isEmpty(storedData)) {
      return new LocalStorage();
    }
    try {
      const decryptedData = CryptoJsUtil.decrypt(storedData);
      return JSON.parse(decryptedData) as LocalStorage;
    } catch (error) {
      console.error('Failed to decrypt or parse data:', error);
      return new LocalStorage();
    }
  }

  /**
   * @description
   * Clears the storage by setting an empty LocalStorage instance.
   */
  public static clearStorage(): void {
    LocalStorageUtil.setStorage(new LocalStorage());
  }

  public static removeKey(key: string): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage is not available. Key will not be removed.');
      return;
    }
    localStorage.removeItem(key);
  }
}

export class LocalStorage {
  data: any;
  chatMessages: any;
  terminal_theme: any;
}
