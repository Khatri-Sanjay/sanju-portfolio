import { Component, OnInit, signal, WritableSignal, inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CryptoData, CryptoService } from './service/crypto.service';
import { DecimalPipe, NgClass, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-crypto-tracker',
  standalone: true,
  imports: [UpperCasePipe, DecimalPipe, NgClass, FormsModule],
  templateUrl: './crypto-tracker.component.html',
  styleUrl: './crypto-tracker.component.scss'
})
export class CryptoTrackerComponent implements OnInit {
  cryptos: WritableSignal<CryptoData[]> = signal<CryptoData[]>([]);
  filteredCryptos: WritableSignal<CryptoData[]> = signal<CryptoData[]>([]);
  paginatedCryptos: WritableSignal<CryptoData[]> = signal<CryptoData[]>([]);
  loading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  searchTerm = '';
  sortBy = 'market_cap_desc';
  isGridView = true;
  showFavorites = false;
  currentPage = signal<number>(1);
  itemsPerPage = 12;
  pageNumbers = signal<number[]>([]);
  selectedCrypto = signal<CryptoData | null>(null);
  chartLoading = signal<boolean>(false);
  chartError = signal<string | null>(null);
  favorites = signal<string[]>([]);

  @ViewChild('priceChart', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  private cryptoService = inject(CryptoService);

  ngOnInit(): void {
    this.loadFavorites();
    this.fetchCryptos();
  }

  fetchCryptos(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.cryptoService.getCryptos().subscribe({
      next: (data: CryptoData[]) => {
        this.cryptos.set(data);
        this.filterCryptos();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Fetch error:', err);
        let msg = 'Failed to load data.';
        if (err?.error?.includes('429')) {
          msg += ' Rate limit exceeded. Try again in 1 minute or reduce refresh frequency.';
        } else if (err?.status === 0) {
          msg += ' Using demo mode.';
        }
        this.errorMessage.set(msg);
        this.loading.set(false);
      }
    });
  }

  filterCryptos(): void {
    let filtered = this.cryptos();
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        crypto =>
          crypto.name.toLowerCase().includes(term) ||
          crypto.symbol.toLowerCase().includes(term)
      );
    }
    if (this.showFavorites) {
      filtered = filtered.filter(crypto => this.favorites().includes(crypto.id));
    }
    this.sortCryptos(filtered);
  }

  sortCryptos(filtered: CryptoData[] = this.filteredCryptos()): void {
    let sorted = [...filtered];
    switch (this.sortBy) {
      case 'market_cap_desc':
        sorted.sort((a, b) => b.market_cap - a.market_cap);
        break;
      case 'market_cap_asc':
        sorted.sort((a, b) => a.market_cap - b.market_cap);
        break;
      case 'price_desc':
        sorted.sort((a, b) => b.current_price - a.current_price);
        break;
      case 'price_asc':
        sorted.sort((a, b) => a.current_price - b.current_price);
        break;
      case 'change_desc':
        sorted.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
        break;
      case 'change_asc':
        sorted.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
        break;
    }
    this.filteredCryptos.set(sorted);
    this.updatePagination();
  }

  toggleView(): void {
    this.isGridView = !this.isGridView;
    this.updatePagination();
  }

  toggleFavorites(): void {
    this.showFavorites = !this.showFavorites;
    this.currentPage.set(1);
    this.filterCryptos();
  }

  refreshData(): void {
    localStorage.removeItem('crypto_cache');
    localStorage.removeItem('crypto_cache_timestamp');
    this.searchTerm = '';
    this.sortBy = 'market_cap_desc';
    this.showFavorites = false;
    this.currentPage.set(1);
    this.fetchCryptos();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.updatePagination();
    }
  }

  totalPages(): number {
    return Math.ceil(this.filteredCryptos().length / this.itemsPerPage);
  }

  updatePagination(): void {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedCryptos.set(this.filteredCryptos().slice(start, end));
    const total = this.totalPages();
    const pages = Array.from({ length: total }, (_, i) => i + 1);
    this.pageNumbers.set(pages);
  }

  openDetailModal(crypto: CryptoData): void {
    this.selectedCrypto.set(crypto);
    this.chartLoading.set(true);
    this.chartError.set(null);
    setTimeout(() => {
      this.cryptoService.getPriceHistory(crypto.id).subscribe({
        next: (data) => {
          if (data.prices && data.prices.length > 0) {
            this.createChart(data.prices);
            this.chartLoading.set(false);
          } else {
            this.chartLoading.set(false);
            this.chartError.set('No price history data available.');
          }
        },
        error: (err) => {
          console.error('Chart data error:', err);
          this.chartLoading.set(false);
          let msg = 'Failed to load price history.';
          if (err?.error?.includes('429')) {
            msg += ' Rate limit exceeded. Try again in 1 minute.';
          }
          this.chartError.set(msg);
        }
      });
    }, 100); // Slight delay to ensure DOM is ready
  }

  closeDetailModal(): void {
    this.selectedCrypto.set(null);
    this.chartError.set(null);
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  createChart(prices: number[][]): void {
    if (!this.chartCanvas?.nativeElement) {
      console.error('Chart canvas not found');
      this.chartError.set('Chart initialization failed. Please try again.');
      return;
    }

    const labels = prices.map(p => new Date(p[0]).toLocaleDateString());
    const data = prices.map(p => p[1]);

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Price (USD)',
          data,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: 'Date' } },
          y: { title: { display: true, text: 'Price (USD)' } }
        },
        plugins: {
          legend: { display: true }
        }
      }
    });
  }

  toggleFavorite(crypto: CryptoData, event: Event): void {
    event.stopPropagation();
    const favorites = [...this.favorites()];
    if (favorites.includes(crypto.id)) {
      this.favorites.set(favorites.filter(id => id !== crypto.id));
    } else {
      favorites.push(crypto.id);
      this.favorites.set(favorites);
    }
    localStorage.setItem('cryptoFavorites', JSON.stringify(this.favorites()));
    this.filterCryptos();
  }

  isFavorite(id: string): boolean {
    return this.favorites().includes(id);
  }

  loadFavorites(): void {
    const saved = localStorage.getItem('cryptoFavorites');
    if (saved) {
      this.favorites.set(JSON.parse(saved));
    }
  }
}
