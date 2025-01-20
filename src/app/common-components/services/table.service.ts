import {computed, Injectable, signal} from '@angular/core';

export interface TableColumn<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'text' | 'number' | 'date' | 'status' | 'custom';
  width?: string;
  template?: (item: T) => string;
  filterOptions?: string[];
}

export interface TableConfig<T> {
  columns: TableColumn<T>[];
  pageSize?: number;
  pageSizeOptions?: number[];
  showSearch?: boolean;
  showColumnFilters?: boolean;
  selectable?: boolean;
  actions?: TableAction[];
}

export interface TableAction {
  label: string;
  icon?: string;
  color?: string;
  action: (item: any) => void;
}

export interface TableState {
  currentPage: number;
  pageSize: number;
  sortColumn?: string;
  sortDirection: 'asc' | 'desc';
  searchTerm: string;
  columnFilters: Map<string, string>;
  selectedItems: Set<any>;
}

@Injectable({
  providedIn: 'root'
})
export class TableService<T> {
  private tableData = signal<T[]>([]);
  private tableState = signal<TableState>({
    currentPage: 1,
    pageSize: 10,
    sortDirection: 'asc',
    searchTerm: '',
    columnFilters: new Map(),
    selectedItems: new Set()
  });

  filteredData = computed(() => {
    let filtered = this.tableData();
    const state = this.tableState();

    if (state.searchTerm) {
      filtered = filtered.filter(item =>
        typeof item === 'object' && item !== null &&
        Object.values(item).some(val =>
          val?.toString().toLowerCase().includes(state.searchTerm.toLowerCase())
        )
      );
    }

    state.columnFilters.forEach((value, key) => {
      if (value) {
        filtered = filtered.filter(item =>
          (item as Record<string, any>)[key]?.toString().toLowerCase() === value.toLowerCase()
        );
      }
    });

    if (state.sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[state.sortColumn as keyof typeof a];
        const bVal = b[state.sortColumn as keyof typeof b];
        const direction = state.sortDirection === 'asc' ? 1 : -1;

        return aVal < bVal ? -direction : aVal > bVal ? direction : 0;
      });
    }
    return filtered;
  });

  displayedData = computed(() => {
    const state = this.tableState();
    const start = (state.currentPage - 1) * state.pageSize;
    return this.filteredData().slice(start, start + state.pageSize);
  });

  totalPages = computed(() =>
    Math.ceil(this.filteredData().length / this.tableState().pageSize)
  );

  // State management methods
  setData(data: T[]) {
    this.tableData.set(data);
  }

  updateState(newState: Partial<TableState>) {
    this.tableState.update(state => ({ ...state, ...newState }));
  }

  getState() {
    return this.tableState();
  }

  toggleSelection(item: T) {
    this.tableState.update(state => {
      const newSelected = new Set(state.selectedItems);
      if (newSelected.has(item)) {
        newSelected.delete(item);
      } else {
        newSelected.add(item);
      }
      return { ...state, selectedItems: newSelected };
    });
  }
}
