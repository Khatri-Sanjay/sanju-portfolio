import { Injectable } from '@angular/core';
import {LocalStorageUtil} from '../../@core/utils/local-storage-utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated(): boolean {
    // Check if user has valid token in localStorage
    const userData = LocalStorageUtil.getStorage().userData;
    return !!userData; // Return true if token exists
  }
}
