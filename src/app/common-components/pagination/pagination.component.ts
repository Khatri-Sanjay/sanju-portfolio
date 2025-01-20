import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';

export class Pageable {
  pageSize: number = 10;
  pageNumber: number = 1;
  totalElements: number = 0;
  totalPages: number = 0;
}

@Component({
  selector: 'app-pagination',
  imports: [
    FormsModule,
    NgClass,
  ],
  templateUrl: './pagination.component.html',
  standalone: true,
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() pageable!: Pageable;
  @Output() changePage = new EventEmitter<number>();
  @Output() changePageSize = new EventEmitter<number>();

  get startIndex(): number {
    return this.pageable.totalElements === 0
      ? 0
      : (this.pageable.pageNumber - 1) * this.pageable.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(
      this.pageable.pageNumber * this.pageable.pageSize,
      this.pageable.totalElements
    );
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.pageable.totalPages && page !== this.pageable.pageNumber) {
      this.changePage.emit(page);
    }
  }

  onDirectPageInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let page = parseInt(input.value, 10);

    if (isNaN(page)) {
      page = 1;
    } else if (page < 1) {
      page = 1;
    } else if (page > this.pageable.totalPages) {
      page = this.pageable.totalPages;
    }

    input.value = page.toString();
    this.onPageChange(page);
  }

  onSizeChange(): void {
    this.pageable.pageNumber = 1;
    this.changePageSize.emit(this.pageable.pageSize);
    this.changePage.emit(1);
  }
}
