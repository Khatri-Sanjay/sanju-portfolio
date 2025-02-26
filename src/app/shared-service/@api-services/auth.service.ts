import { Injectable } from '@angular/core';
import {LocalStorageUtil} from '../../@core/utils/local-storage-utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated(): boolean {
    const userData = LocalStorageUtil.getStorage().userData;
    return !!userData;
  }
}
