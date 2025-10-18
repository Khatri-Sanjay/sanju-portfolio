import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, retryWhen, scan, tap } from 'rxjs/operators';

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
  total_volume: number;
  circulating_supply: number;
}

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h';
  private HISTORY_URL = 'https://api.coingecko.com/api/v3/coins';
  private CACHE_KEY = 'crypto_cache';
  private CACHE_TIMESTAMP_KEY = 'crypto_cache_timestamp';
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(private http: HttpClient) {}

  getCryptos(): Observable<CryptoData[]> {
    const cached = this.getCachedData();
    if (cached) {
      console.log('Using cached data');
      return of(cached);
    }

    return this.http.get<CryptoData[]>(this.API_URL).pipe(
      tap(data => this.setCache(data)),
      retryWhen(errors => errors.pipe(
        scan((acc, curr) => {
          if (acc >= 3 || curr.status !== 429) throw curr;
          console.warn(`Retry attempt ${acc + 1} after delay`);
          return acc + 1;
        }, 0),
        delay(1000 * Math.pow(2, 0))
      )),
      catchError(this.handleError)
    );
  }

  getPriceHistory(coinId: string): Observable<{ prices: number[][] }> {
    const cached = this.getCachedHistory(coinId);
    if (cached) {
      console.log(`Using cached price history for ${coinId}`);
      return of({ prices: cached });
    }

    const url = `${this.HISTORY_URL}/${coinId}/market_chart?vs_currency=usd&days=7`;
    return this.http.get<{ prices: number[][] }>(url).pipe(
      tap(data => this.setCacheHistory(coinId, data.prices)),
      retryWhen(errors => errors.pipe(
        scan((acc, curr) => {
          if (acc >= 3 || curr.status !== 429) throw curr;
          console.warn(`Price history retry attempt ${acc + 1}`);
          return acc + 1;
        }, 0),
        delay(1000 * Math.pow(2, 0))
      )),
      catchError(this.handleHistoryError)
    );
  }

  private getCachedData(): CryptoData[] | null {
    const data = localStorage.getItem(this.CACHE_KEY);
    const timestamp = localStorage.getItem(this.CACHE_TIMESTAMP_KEY);
    if (data && timestamp) {
      const timePassed = Date.now() - parseInt(timestamp, 10);
      if (timePassed < this.CACHE_DURATION) {
        return JSON.parse(data);
      } else {
        localStorage.removeItem(this.CACHE_KEY);
        localStorage.removeItem(this.CACHE_TIMESTAMP_KEY);
      }
    }
    return null;
  }

  private setCache(data: CryptoData[]): void {
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(this.CACHE_TIMESTAMP_KEY, Date.now().toString());
  }

  private getCachedHistory(coinId: string): number[][] | null {
    const data = localStorage.getItem(`crypto_history_${coinId}`);
    const timestamp = localStorage.getItem(`crypto_history_timestamp_${coinId}`);
    if (data && timestamp) {
      const timePassed = Date.now() - parseInt(timestamp, 10);
      if (timePassed < this.CACHE_DURATION) {
        return JSON.parse(data);
      } else {
        localStorage.removeItem(`crypto_history_${coinId}`);
        localStorage.removeItem(`crypto_history_timestamp_${coinId}`);
      }
    }
    return null;
  }

  private setCacheHistory(coinId: string, prices: number[][]): void {
    localStorage.setItem(`crypto_history_${coinId}`, JSON.stringify(prices));
    localStorage.setItem(`crypto_history_timestamp_${coinId}`, Date.now().toString());
  }

  private handleError(error: HttpErrorResponse): Observable<never | CryptoData[]> {
    let errorMsg = 'An unknown error occurred';
    let demoMode = false;

    if (error.status === 429) {
      errorMsg = 'Rate limit exceeded (429). Waiting before retry...';
    } else if (error.status === 0) {
      errorMsg = 'Network error. Loading demo data...';
      demoMode = true;
    } else {
      errorMsg = `API Error ${error.status}: ${error.message}`;
    }

    if (demoMode) {
      return of(this.getDemoData()).pipe(
        tap(data => {
          console.warn('Loaded demo data due to API failure');
          this.setCache(data);
        })
      ) as Observable<CryptoData[]>;
    }

    return throwError(() => ({ error: errorMsg }));
  }

  private handleHistoryError(error: HttpErrorResponse): Observable<never | { prices: number[][] }> {
    let errorMsg = 'Failed to load price history';
    if (error.status === 429) {
      errorMsg = 'Rate limit exceeded for price history (429).';
    } else if (error.status === 0) {
      errorMsg = 'Network error. Loading demo chart data...';
      return of({ prices: this.getDemoChartData() });
    } else {
      errorMsg = `API Error ${error.status}: ${error.message}`;
    }
    return throwError(() => ({ error: errorMsg }));
  }

  private getDemoData(): CryptoData[] {
    return [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        current_price: 65000,
        market_cap: 1280000000000,
        price_change_percentage_24h: 2.5,
        high_24h: 66000,
        low_24h: 64000,
        total_volume: 30000000000,
        circulating_supply: 19700000
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        current_price: 3500,
        market_cap: 420000000000,
        price_change_percentage_24h: -1.2,
        high_24h: 3550,
        low_24h: 3450,
        total_volume: 15000000000,
        circulating_supply: 120000000
      }
    ];
  }

  private getDemoChartData(): number[][] {
    const now = Date.now();
    return Array.from({ length: 7 }, (_, i) => [
      now - (6 - i) * 24 * 60 * 60 * 1000,
      60000 + Math.random() * 10000
    ]);
  }
}
