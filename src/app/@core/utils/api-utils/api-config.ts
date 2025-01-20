import {environment} from '../../../../environment/environment';

export class ApiConfig {
  public static baseApiUrl = environment.baseApiUrl;
  public static auth = environment.baseApiUrl + '/oauth';
  public static login = ApiConfig.auth + '/token';
  public static VERIFY_OTP = ApiConfig.auth + '/verify-otp';
  public static refreshToken = ApiConfig.auth + '/refresh';
  public static baseApiEndPoint = environment.baseApiUrl + '/v1';
  public static externalApiEndPoint = environment.baseApiUrl + '/v2/api';
  public static imageUrl = environment.baseApiUrl;

}
