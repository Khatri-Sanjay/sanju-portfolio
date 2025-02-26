import { Injectable } from '@angular/core';
import {ObjectUtil} from '../@core/utils/object-util';


/**
 * Service for generating random numeric IDs prefixed with a timestamp and a key.
 */
@Injectable({
  providedIn: 'root'
})
export class UniqueValueGeneratorService {

  constructor() {
  }

  /**
   * Generates a random numeric ID prefixed with a timestamp and a provided key.
   * @param key The key to prefix the generated ID.
   * @returns The generated random numeric ID prefixed with the key.
   */
  generateRandomNumericIdWithTimestamp(key: any): string {
    const numericIdLength = 5;
    const numericCharacters = '0123456789';

    const randomNumericPart = this.shuffleCharacters(numericCharacters, numericIdLength);

    const timestamp = new Date().getTime().toString().slice(-5);

    const data = randomNumericPart + timestamp;

    const shuffledData = this.shuffleCharacters(data);

    return key + shuffledData;
  }

  /**
   * Shuffles characters of a given string or array.
   * @param data The data (string or array) to be shuffled.
   * @param length Optional length to limit shuffling.
   * @returns The shuffled data.
   */
  private shuffleCharacters(data: any, length?: number): string {
    let shuffledResult = '';
    const dataLength = !ObjectUtil.isEmpty(length) ? length : data.length;

    for (let i = dataLength - 1; i >= 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      shuffledResult += data.charAt(randomIndex);
      data = data.substring(0, randomIndex) + data.substring(randomIndex + 1);
    }
    return shuffledResult;
  }
}
