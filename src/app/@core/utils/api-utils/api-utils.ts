import {HttpHeaders} from '@angular/common/http';

import {ApiConfig} from './api-config';

export class ApiUtils {

  public static getRequest(api: string) {
    const fullApi = `${ApiConfig.baseApiEndPoint}/${api}`;
    return {
      url: fullApi,
      header: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
  }


  public static getRequestWithFileSupport(api: string) {
    const fullApi = `${ApiConfig.baseApiEndPoint}/${api}`;
    return {
      url: fullApi,
      header: new HttpHeaders({
        enctype: 'multipart/form-data',
      }),
    };
  }
}
