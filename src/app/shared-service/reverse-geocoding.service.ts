import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReverseGeocodingService {
  private apiUrl = 'https://nominatim.openstreetmap.org/reverse';

  constructor(private http: HttpClient) {
  }

  getPlaceName(latitude: number, longitude: number): Observable<any> {
    const url = `${this.apiUrl}?lat=${latitude}&lon=${longitude}&format=json`;
    return this.http.get<any>(url);
  }
}
