import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  DatePipe,
  NgClass,
  NgForOf,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  NgTemplateOutlet,
  TitleCasePipe
} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {PaginationComponent} from '../pagination/pagination.component';
import {TooltipDirective} from '../../@core/directives/tooltip.directive';

export interface ColumnConfig {
  key: string; // Field in the data source
  label: string; // Column label
  type: 'sn' | 'text' | 'number' | 'date' | 'boolean' | 'status' | 'image' | 'badge' | 'progress' | 'currency' | 'custom'; // Data type
  sortable?: boolean; // Enable sorting
  filterable?: boolean; // Enable filtering
  width?: string; // Column width
  formatter?: (value: any) => string; // Formatter function
  template?: string; // Custom template for cells
  filterType?: 'text' | 'select' | 'date' | 'dateRange' | 'number' | 'boolean'; // Filter type
  filterOptions?: any[]; // Options for select filters
  customComponent?: any; // Custom component
  cellClass?: string | ((value: any) => string); // CSS class for cells
  headerClass?: string; // CSS class for headers
  hidden?: boolean; // Hide column
  tooltipField?: string; // Tooltip content field
  editable?: boolean; // Editable cell
  validation?: {
    required?: boolean;
    pattern?: string;
    min?: number;
    max?: number;
    customValidator?: (value: any) => boolean;
  };
  footer?: FooterConfig;
}


// table-config.interface.ts
export interface TableConfig {
  showHeader?: boolean;
  showFooter?: boolean;
  enableAdd?: boolean;
  enableSearch?: boolean;
  enableSort?: boolean;
  enableFilter?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  enableColumnResize?: boolean;
  enableColumnReorder?: boolean;
  enableExport?: boolean;
  enableRowExpand?: boolean;
  rowHeight?: number;
  headerHeight?: number;
  footerHeight?: number;
  pageSize?: number;
  showFirstLast?: boolean;
  showPageJump?: boolean;
  showPageInfo?: boolean;
  pageSizeOptions?: number[];
  theme?: 'default' | 'dark' | 'custom';
  loadingTemplate?: string;
  noDataTemplate?: string;
  rowClass?: string | ((item: any) => string);
  selectionType?: 'single' | 'multi';
  exportFormats?: ('excel' | 'pdf' | 'csv')[];
  footer?: ColumnConfig;
}

const defaultConfig: TableConfig = {
  showHeader: true,
  showFooter: false,
  enableSearch: true,
  enableSort: true,
  enableFilter: true,
  enableRowSelection: false,
  enableColumnResize: false,
  enableColumnReorder: false,
  enableExport: false,
  enableRowExpand: false,
  rowHeight: 48,
  headerHeight: 48,
  footerHeight: 48,
  pageSize: 10,
  theme: 'default',
  loadingTemplate: '<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>',
  noDataTemplate: '<div class="text-center">No data available</div>',
  rowClass: '',
  selectionType: 'multi',
  exportFormats: ['excel', 'pdf', 'csv'],
  enablePagination: true,
  pageSizeOptions: [5, 10, 25, 50, 100],
  showFirstLast: true,
  showPageJump: true,
  showPageInfo: true
};

export interface ActionButton {
  label: string; // Button label
  class?: string; // CSS class
  icon?: string; // Icon class (e.g., FontAwesome)
  visible?: (item: any) => boolean; // Visibility condition
  action: string; // Action name to emit
}

interface FooterConfig {
  type: 'sum' | 'average' | 'count' | 'custom';
  formatter?: (values: any[]) => string;
}

interface ExtendedColumnConfig extends ColumnConfig {
  footer?: FooterConfig;
}


@Component({
  selector: 'app-dynamic-table',
  imports: [
    NgSwitchCase,
    NgSwitch,
    FormsModule,
    NgForOf,
    NgIf,
    NgClass,
    NgTemplateOutlet,
    NgSwitchDefault,
    TitleCasePipe,
    DatePipe,
    PaginationComponent,
    TooltipDirective
  ],
  templateUrl: './dynamic-table.component.html',
  standalone: true,
  styleUrl: './dynamic-table.component.scss'
})
export class DynamicTableComponent implements OnInit {
  @Input() columns: ColumnConfig[] = [];
  @Input() data: any[] = [];
  @Input() config: TableConfig = defaultConfig;
  @Input() actionButtons: ActionButton[] = [];
  @Input() bulkActions: ActionButton[] = [];
  @Input() loadingTemplate: any;
  @Input() noDataTemplate: any;

  // Outputs
  @Output() rowClick = new EventEmitter<any>();
  @Output() rowSelect = new EventEmitter<any[]>();
  @Output() actionClick = new EventEmitter<{ action: string, item: any }>();
  @Output() filterChange = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<{ column: string, direction: string }>();
  @Output() pageChange = new EventEmitter<{ page: number, pageSize: number }>();
  @Output() exportData = new EventEmitter<{ format: string, data: any[] }>();

  // Internal state
  loading: boolean = false;
  displayedData: any[] = [];
  selectedRows: any[] = [];
  filters: { [key: string]: any } = {};
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;
  pageSize: number | undefined = 10;
  totalItems: number = 0;
  totalPages: number = 1;
  startIndex: number = 0;
  endIndex: number = 0;
  jumpToPage: number = 1;
  visibleColumns: ColumnConfig[] = [];

  // Default templates
  defaultLoadingTemplate = `<div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>`;

  defaultNoDataTemplate = `<div class="text-muted">No data available</div>`;

  ngOnInit() {
    this.initializeTable();
  }

  // Initialization
  private initializeTable() {
    this.pageSize = this.config.pageSize || defaultConfig.pageSize || 10;
    this.pageSize = this.pageSize as number; // Assert that it's a number
    this.visibleColumns = this.getVisibleColumns();
    this.processData();
  }

  // Column Methods
  getVisibleColumns(): ColumnConfig[] {
    return this.columns.filter(col => !col.hidden);
  }

  getFilterableColumns(): ColumnConfig[] {
    return this.columns.filter(col => col.filterable);
  }

  // Data Processing Methods
  private processData() {
    let processedData = [...this.data];

    // Apply filters
    if (this.config.enableFilter) {
      processedData = this.applyFilters(processedData);
    }

    // Apply sorting
    if (this.config.enableSort && this.sortColumn) {
      processedData = this.applySorting(processedData);
    }

    this.totalItems = processedData.length;
    this.totalPages = Math.ceil(this.totalItems / (this.pageSize ?? 10)); // Default pageSize to 10 if undefined

    // Apply pagination
    if (this.config.enablePagination) {
      processedData = this.applyPagination(processedData);
    }

    this.displayedData = processedData;
    this.updatePaginationIndexes();
  }

  private applyFilters(data: any[]): any[] {
    return data.filter(item => {
      return Object.keys(this.filters).every(key => {
        const filterValue = this.filters[key];
        if (!filterValue) return true;

        // Handle date range keys (e.g., date_start and date_end)
        const isDateRange = key.includes('_start') || key.includes('_end');
        const baseKey = isDateRange ? key.split('_')[0] : key;

        const column = this.columns.find(col => col.key === baseKey);
        if (!column) return true;

        const itemValue = item[column.key];
        if (!itemValue) return false;

        switch (column.filterType) {
          case 'text':
            return String(itemValue).toLowerCase().includes(String(filterValue).toLowerCase());
          case 'select':
            return itemValue === filterValue;
          case 'date':
            // Convert both dates to YYYY-MM-DD format for comparison
            const itemDate = new Date(itemValue).toISOString().split('T')[0];
            const filterDate = new Date(filterValue).toISOString().split('T')[0];
            return itemDate === filterDate;
          case 'dateRange':
            const startDate = this.filters[`${baseKey}_start`];
            const endDate = this.filters[`${baseKey}_end`];

            // If neither date is set, return true
            if (!startDate && !endDate) return true;

            // Convert all dates to YYYY-MM-DD format
            const dateToCheck = new Date(itemValue).toISOString().split('T')[0];
            const start = startDate ? new Date(startDate).toISOString().split('T')[0] : null;
            const end = endDate ? new Date(endDate).toISOString().split('T')[0] : null;

            // Compare dates in YYYY-MM-DD format
            return (!start || dateToCheck >= start) && (!end || dateToCheck <= end);
          case 'number':
            return Number(itemValue) === Number(filterValue);
          case 'boolean':
            return itemValue === (filterValue === 'true');
          default:
            return true;
        }
      });
    });
  }

  private applySorting(data: any[]): any[] {
    return [...data].sort((a, b) => {
      const column = this.columns.find(col => col.key === this.sortColumn);
      if (!column) return 0;

      let valueA = a[this.sortColumn];
      let valueB = b[this.sortColumn];

      switch (column.type) {
        case 'date':
          valueA = new Date(valueA).getTime();
          valueB = new Date(valueB).getTime();
          break;
        case 'number':
        case 'currency':
        case 'progress':
          valueA = Number(valueA);
          valueB = Number(valueB);
          break;
        default:
          valueA = String(valueA).toLowerCase();
          valueB = String(valueB).toLowerCase();
      }

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  private applyPagination(data: any[]): any[] {
    if (!data || data.length === 0) {
      console.log('Data is empty or undefined');
      return [];
    }

    const currentPage = this.currentPage ?? 1;
    const pageSize = this.pageSize ?? 10;

    const validCurrentPage = Math.max(1, currentPage);
    const validPageSize = Math.max(1, pageSize);

    const start = (validCurrentPage - 1) * validPageSize;
    const end = Math.min(start + validPageSize, data.length);

    console.log({
      currentPage: validCurrentPage,
      pageSize: validPageSize,
      start,
      end,
      slicedData: data.slice(start, end),
    });

    return data.slice(start, end);
  }

  // Styling Methods
  getTableClasses(): string {
    const classes = ['table'];
    if (this.config.theme === 'dark') classes.push('table-dark');
    if (this.config.theme === 'custom') classes.push('table-custom');
    return classes.join(' ');
  }

  getRowClass(item: any): string {
    if (typeof this.config.rowClass === 'function') {
      return this.config.rowClass(item);
    }
    return this.config.rowClass || '';
  }

  getCellClass(column: ColumnConfig, item: any): string {
    if (typeof column.cellClass === 'function') {
      return column.cellClass(item[column.key]);
    }
    return column.cellClass || '';
  }

  getBadgeClass(value: any): string {
    if (value.toLowerCase() === 'pending') return  'bg-warning';
    if (value.toLowerCase() === 'inactive') return  'bg-danger';
    if (value.toLowerCase() === 'active') return  'bg-success';
    return 'bg-success';
  }

  getProgressClass(value: number): string {
    if (value < 25) return 'bg-danger';
    if (value < 50) return 'bg-warning';
    if (value < 75) return 'bg-info';
    return 'bg-success';
  }

  // Event Handlers
  onFilterChange() {
    this.currentPage = 1;
    this.processData();
    this.filterChange.emit(this.filters);
  }

  onClearFilter() {
    this.filters = {};
    this.processData();
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.processData();
    this.sortChange.emit({column, direction: this.sortDirection});
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.jumpToPage = 1;
    this.processData();
    this.emitPageChange();
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;

    this.currentPage = page;
    this.jumpToPage = page;
    this.processData();
    this.emitPageChange();
  }

  onRowClick(item: any) {
    this.rowClick.emit(item);
  }

  // Selection Methods
  toggleSelection(item: any, event: Event) {
    event.stopPropagation();
    const index = this.selectedRows.indexOf(item);

    if (this.config.selectionType === 'single') {
      this.selectedRows = index === -1 ? [item] : [];
    } else {
      if (index === -1) {
        this.selectedRows.push(item);
      } else {
        this.selectedRows.splice(index, 1);
      }
    }

    this.rowSelect.emit(this.selectedRows);
  }

  isSelected(item: any): boolean {
    return this.selectedRows.includes(item);
  }

  isAllSelected(): boolean {
    return this.displayedData.length > 0 &&
      this.displayedData.every(item => this.isSelected(item));
  }

  toggleSelectAll() {
    if (this.isAllSelected()) {
      this.selectedRows = [];
    } else {
      this.selectedRows = [...this.displayedData];
    }
    this.rowSelect.emit(this.selectedRows);
  }

  // Action Methods
  getVisibleButtons(item: any): ActionButton[] {
    return this.actionButtons.filter(btn => {
      if (typeof btn.visible === 'function') {
        return btn.visible(item);
      }
      return btn.visible !== false;
    });
  }

  handleAction(button: ActionButton, item: any, event: Event) {
    event.stopPropagation();
    this.actionClick.emit({action: button.action, item});
  }

  onBulkAction(action: ActionButton) {
    this.actionClick.emit({action: action.action, item: this.selectedRows});
  }

  onAddAction() {
    this.actionClick.emit({action: 'Add', item: 'Add User'});
  }

  // Formatting Methods
  formatValue(value: any, column: ColumnConfig): string {
    if (column.formatter) {
      return column.formatter(value);
    }
    return String(value);
  }

  formatNumber(value: number, column: ColumnConfig): string {
    if (column.type === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    }
    return new Intl.NumberFormat().format(value);
  }

  formatDate(value: string, column: ColumnConfig): string {
    return new Date(value).toLocaleDateString();
  }

  get visiblePages(): number[] {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (this.totalPages - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, this.totalPages - maxVisiblePages + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  // Pagination Helpers
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPages - 1);

    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  private updatePaginationIndexes() {
    this.startIndex = ((this.currentPage ?? 1) - 1) * (this.pageSize ?? 10);
    this.endIndex = Math.min(this.startIndex + (this.pageSize ?? 10), this.totalItems);
  }

  goToPage(): void {
    const pageNum = Math.min(Math.max(1, this.jumpToPage), this.totalPages);
    if (pageNum !== this.currentPage) {
      this.changePage(pageNum);
    }
  }


  private emitPageChange() {
    this.pageChange.emit({
      page: this.currentPage ?? 1,  // Default to 1 if undefined
      pageSize: this.pageSize ?? 10  // Default to 10 if undefined
    });
  }

  // Export Methods
  exportTableData(format: string) {
    this.exportData.emit({
      format,
      data: this.selectedRows.length ? this.selectedRows : this.data
    });
  }

  getTotalColumns(): number {
    return this.getVisibleColumns().length +
      (this.config.enableRowSelection ? 1 : 0) +
      (this.actionButtons.length ? 1 : 0);
  }

  getFooterValue(column: ExtendedColumnConfig): string {
    if (!column.footer) return '';

    const values = this.data.map(item => item[column.key]).filter(val => val != null);

    if (values.length === 0) return '';

    if (column.footer.formatter) {
      return column.footer.formatter(values);
    }

    switch (column.footer.type) {
      case 'sum':
        const sum = values.reduce((a, b) => Number(a) + Number(b), 0);
        return this.formatNumber(sum, column);

      case 'average':
        const avg = values.reduce((a, b) => Number(a) + Number(b), 0) / values.length;
        return this.formatNumber(avg, column);

      case 'count':
        return values.length.toString();

      case 'custom':
        return '';

      default:
        return '';
    }
  }

  // Helper method for footer calculations
  private calculateFooterValue(values: any[], type: string): number {
    const numericValues = values.map(v => Number(v)).filter(v => !isNaN(v));

    switch (type) {
      case 'sum':
        return numericValues.reduce((a, b) => a + b, 0);
      case 'average':
        return numericValues.length > 0 ?
          numericValues.reduce((a, b) => a + b, 0) / numericValues.length :
          0;
      case 'count':
        return values.length;
      default:
        return 0;
    }
  }

  // Method to check if column has footer
  hasFooter(column: ExtendedColumnConfig): boolean {
    return column.footer !== undefined && column.footer !== null;
  }

  // Method to get footer cell class
  getFooterCellClass(column: ExtendedColumnConfig): string {
    return column.headerClass || '';
  }
}
