import { CryptoJsUtil } from './crypto-js-util';
import { ObjectUtil } from './object-util';
import {environment} from '../../../environment/environment';

export class SessionStorageUtil {
  /**
   * @description
   * Saves data into sessionStorage with encryption under the specified key.
   * Handles any type of data (string, number, object, etc.).
   * @param data The data to store.
   */
  public static setStorage(data: any): void {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      console.warn('sessionStorage is not available. Data will not be saved.');
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
      sessionStorage.setItem(environment.STORAGE_NAME, encryptedData);
    } catch (error) {
      console.error('Failed to encrypt or save data:', error);
    }
  }

  /**
   * @description
   * Retrieves data from sessionStorage using the specified key.
   * If data is encrypted, it decrypts it and parses the JSON.
   * @returns The stored data, or an empty sessionStorage instance if no data is found.
   */
  public static getStorage(): SessionStorage {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      return new SessionStorage();
    }
    const storedData = sessionStorage.getItem(environment.STORAGE_NAME);
    if (ObjectUtil.isEmpty(storedData)) {
      return new SessionStorage();
    }
    try {
      const decryptedData = CryptoJsUtil.decrypt(storedData);
      return JSON.parse(decryptedData) as SessionStorage;
    } catch (error) {
      console.error('Failed to decrypt or parse data:', error);
      return new SessionStorage();
    }
  }

  /**
   * @description
   * Clears the storage by setting an empty sessionStorage instance.
   */
  public static clearStorage(): void {
    SessionStorageUtil.setStorage(new SessionStorage());
  }

  public static removeKey(key: string): void {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      console.warn('sessionStorage is not available. Key will not be removed.');
      return;
    }
    sessionStorage.removeItem(key);
  }
}

export class SessionStorage {
  data: any;
  chatMessages: any;
  terminal_theme: any;
  userData: any;
}
