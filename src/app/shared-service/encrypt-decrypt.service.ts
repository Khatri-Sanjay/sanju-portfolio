import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
import {environment} from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptDecryptService {

  private secretKey = environment.STORAGE_KEY;

  constructor() { }

  decrypt(encryptedText: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedText, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  encrypt(decryptedText: string): string {
    return CryptoJS.AES.encrypt(decryptedText, this.secretKey).toString();
  }
}
