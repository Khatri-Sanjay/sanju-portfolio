import { Injectable } from '@angular/core';
import {LocalStorageUtil} from '../../@core/utils/local-storage-utils';
import {SessionStorageUtil} from '../../@core/utils/session-storage-utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated(): boolean {
    const userData = SessionStorageUtil.getStorage().userData;
    return !!userData;
  }
}
