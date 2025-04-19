import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, map, Observable, switchMap, tap } from 'rxjs';
import {
  addDoc, collection, collectionData, deleteDoc, doc,
  Firestore, orderBy, query, updateDoc, where
} from '@angular/fire/firestore';
import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass, TitleCasePipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import {
  CategoryTotal,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  MonthlyTotal,
  TimeframeData,
  Transaction
} from './model/finance.model';

@Component({
  selector: 'app-finance-tracker',
  imports: [
    BaseChartDirective,
    ReactiveFormsModule,
    DatePipe,
    DecimalPipe,
    NgClass,
    TitleCasePipe,
  ],
  templateUrl: './finance-tracker.component.html',
  styleUrl: './finance-tracker.component.scss',
  standalone: true
})
export class FinanceTrackerComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @ViewChild('categoryChart') categoryChart: BaseChartDirective | undefined;

  transactionForm!: FormGroup;
  transactions: Transaction[] = [];
  expenses: Transaction[] = [];
  incomes: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  filteredExpenses: Transaction[] = [];
  filteredIncomes: Transaction[] = [];
  loading = true;
  editingTransaction: Transaction | null = null;

  // Track active tab (expense or income)
  activeTransactionType: 'expense' | 'income' = 'expense';

  // Filter variables
  filterForm!: FormGroup;

  // View mode for comparison (daily, weekly, monthly)
  comparisonTimeframe: 'daily' | 'weekly' | 'monthly' = 'monthly';

  // Date navigation variables
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();
  monthYearDate = new Date(this.currentYear, this.currentMonth, 1);
  monthYearSubject = new BehaviorSubject<Date>(this.monthYearDate);

  // Statistics variables
  totalExpenses = 0;
  totalIncome = 0;
  netTotal = 0;
  monthlyExpenseTotal = 0;
  monthlyIncomeTotal = 0;
  monthlyNetTotal = 0;
  dailyAverage = 0;

  // Categories
  expenseCategories = EXPENSE_CATEGORIES;
  incomeCategories = INCOME_CATEGORIES;

  // Get all categories for filter dropdown
  get allCategories(): string[] {
    return [...this.expenseCategories, ...this.incomeCategories];
  }

  // Color palette for charts
  colorPalette = [
    'rgba(255, 99, 132, 0.7)',    // red
    'rgba(54, 162, 235, 0.7)',    // blue
    'rgba(255, 206, 86, 0.7)',    // yellow
    'rgba(75, 192, 192, 0.7)',    // green
    'rgba(153, 102, 255, 0.7)',   // purple
    'rgba(255, 159, 64, 0.7)',    // orange
    'rgba(199, 199, 199, 0.7)',   // gray
    'rgba(83, 102, 255, 0.7)',    // indigo
    'rgba(40, 159, 64, 0.7)',     // forest green
    'rgba(210, 199, 199, 0.7)',   // light gray
    'rgba(255, 99, 71, 0.7)',     // tomato
    'rgba(0, 128, 128, 0.7)'      // teal
  ];

  // Month labels
  monthLabels = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  shortMonthLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Charts configuration
  // Monthly Bar Chart
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.shortMonthLabels,
    datasets: [
      {
        data: Array(12).fill(0),
        label: 'Income',
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        data: Array(12).fill(0),
        label: 'Expenses',
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        data: Array(12).fill(0),
        label: 'Net',
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'रू ' + value;
          }
        }
      }
    }
  };

  // Category Doughnut Charts
  public expenseDoughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: this.colorPalette
      }
    ]
  };

  public incomeDoughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: this.colorPalette
      }
    ]
  };

  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        display: true
      }
    }
  };

  // Comparison Chart (Daily/Weekly/Monthly)
  public comparisonChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Income',
        fill: false,
        tension: 0.1,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)'
      },
      {
        data: [],
        label: 'Expenses',
        fill: false,
        tension: 0.1,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
      },
      {
        data: [],
        label: 'Net',
        fill: true,
        tension: 0.1,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
      }
    ]
  };

  public comparisonChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'रू ' + value;
          }
        }
      }
    }
  };

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.initForms();
    this.setupDataSubscriptions();

    // Initialize charts with a slight delay to ensure DOM is ready
    setTimeout(() => {
      this.initializeCharts();
    }, 0);
  }

  private initForms(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Main transaction form
    this.transactionForm = this.fb.group({
      id: [null],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      description: ['', Validators.required],
      date: [today.toISOString().split('T')[0], Validators.required],
      nepaliDate: ['', Validators.required],
      type: ['expense', Validators.required]
    });

    // Filter form
    this.filterForm = this.fb.group({
      category: ['all'],
      transactionType: ['all'],
      dateRangeStart: [''],
      dateRangeEnd: [''],
      amountRangeMin: [''],
      amountRangeMax: [''],
    });

    // Listen for changes to transaction type
    this.transactionForm.get('type')?.valueChanges.subscribe(type => {
      this.activeTransactionType = type;
      // Reset category when switching between expense and income
      this.transactionForm.patchValue({
        category: ''
      });
    });

    // Listen for filter changes with debounce
    this.filterForm.valueChanges.pipe(
      debounceTime(300) // Prevent too frequent updates
    ).subscribe(() => {
      this.applyFilters();
    });
  }

  private initializeCharts(): void {
    // Force chart updates when data changes
    this.updateAllCharts();
  }

  private updateAllCharts(): void {
    // Update all chart references
    const charts = document.querySelectorAll('canvas[baseChart]');
    charts.forEach(chart => {
      const canvas = chart as HTMLCanvasElement;
      const chartInstance = Chart.getChart(canvas);
      if (chartInstance) {
        chartInstance.update();
      }
    });

    // Alternative approach using ViewChild
    if (this.chart) {
      this.chart.chart?.update();
    }
  }


  private setupDataSubscriptions(): void {
    // Subscribe to month/year changes and load relevant data
    this.monthYearSubject.pipe(
      tap(date => {
        this.currentYear = date.getFullYear();
        this.currentMonth = date.getMonth();
      }),
      switchMap(date => {
        return combineLatest([
          this.getTransactionsByMonth(date.getFullYear(), date.getMonth()),
          this.getMonthlyTotals(date.getFullYear()),
          this.getCategoryBreakdown(date.getFullYear(), date.getMonth()),
          this.getTimeframeData(date.getFullYear(), date.getMonth(), this.comparisonTimeframe)
        ]);
      })
    ).subscribe(([transactions, monthlyTotals, categoryTotals, timeframeData]) => {
      this.transactions = transactions;
      this.expenses = transactions.filter(t => t.type === 'expense');
      this.incomes = transactions.filter(t => t.type === 'income');

      // Initialize filtered data
      this.filteredTransactions = [...transactions];
      this.filteredExpenses = [...this.expenses];
      this.filteredIncomes = [...this.incomes];

      this.loading = false;

      // Update monthly bar chart
      this.barChartData.datasets[0].data = monthlyTotals.map(item => item.incomeTotal);
      this.barChartData.datasets[1].data = monthlyTotals.map(item => item.expenseTotal);
      this.barChartData.datasets[2].data = monthlyTotals.map(item => item.netTotal);

      // Update expense category doughnut chart
      if (categoryTotals.expenses.length === 0) {
        this.expenseDoughnutChartData.labels = ['No Data'];
        this.expenseDoughnutChartData.datasets[0].data = [1];
      } else {
        this.expenseDoughnutChartData.labels = categoryTotals.expenses.map(item => item.category);
        this.expenseDoughnutChartData.datasets[0].data = categoryTotals.expenses.map(item => item.total);
      }

      // Update income category doughnut chart
      if (categoryTotals.incomes.length === 0) {
        this.incomeDoughnutChartData.labels = ['No Data'];
        this.incomeDoughnutChartData.datasets[0].data = [1];
      } else {
        this.incomeDoughnutChartData.labels = categoryTotals.incomes.map(item => item.category);
        this.incomeDoughnutChartData.datasets[0].data = categoryTotals.incomes.map(item => item.total);
      }

      // Update comparison chart
      this.comparisonChartData.labels = timeframeData.labels;
      this.comparisonChartData.datasets[0].data = timeframeData.incomeData;
      this.comparisonChartData.datasets[1].data = timeframeData.expenseData;
      this.comparisonChartData.datasets[2].data = timeframeData.netData;

      // Calculate statistics
      this.calculateStatistics(transactions, monthlyTotals);

      // Update all charts
      setTimeout(() => {
        this.updateAllCharts();
      }, 0);
    });
  }

  private calculateStatistics(transactions: Transaction[], monthlyTotals: MonthlyTotal[]): void {
    // Monthly statistics
    this.monthlyExpenseTotal = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    this.monthlyIncomeTotal = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    this.monthlyNetTotal = this.monthlyIncomeTotal - this.monthlyExpenseTotal;

    // Yearly statistics
    this.totalExpenses = monthlyTotals.reduce((sum, month) => sum + month.expenseTotal, 0);
    this.totalIncome = monthlyTotals.reduce((sum, month) => sum + month.incomeTotal, 0);
    this.netTotal = this.totalIncome - this.totalExpenses;

    // Calculate daily average
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.dailyAverage = this.monthlyNetTotal / daysInMonth;
  }

  // Firebase data methods
  private getTransactionsByMonth(year: number, month: number): Observable<Transaction[]> {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59);

    const transactionsCollection = collection(this.firestore, 'transactions');
    const transactionsQuery = query(
      transactionsCollection,
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );

    return collectionData(transactionsQuery, { idField: 'id' })
      .pipe(
        map(transactions => transactions.map(transaction => ({
          ...transaction,
          date: transaction['date'].toDate ? transaction['date'].toDate() : new Date(transaction['date'])
        })) as Transaction[])
      );
  }

  private getMonthlyTotals(year: number): Observable<MonthlyTotal[]> {
    const transactionsCollection = collection(this.firestore, 'transactions');
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);

    const yearTransactionsQuery = query(
      transactionsCollection,
      where('date', '>=', startOfYear),
      where('date', '<=', endOfYear)
    );

    return collectionData(yearTransactionsQuery, { idField: 'id' })
      .pipe(
        map(transactions => {
          const monthlyTotals: MonthlyTotal[] = Array(12).fill(0).map((_, idx) => ({
            month: idx,
            incomeTotal: 0,
            expenseTotal: 0,
            netTotal: 0
          }));

          transactions.forEach(transaction => {
            const transactionDate = transaction['date'].toDate ?
              transaction['date'].toDate() : new Date(transaction['date']);
            const month = transactionDate.getMonth();

            if (transaction['type'] === 'income') {
              monthlyTotals[month].incomeTotal += transaction['amount'];
            } else {
              monthlyTotals[month].expenseTotal += transaction['amount'];
            }

            // Calculate net total
            monthlyTotals[month].netTotal =
              monthlyTotals[month].incomeTotal - monthlyTotals[month].expenseTotal;
          });

          return monthlyTotals;
        })
      );
  }

  private getCategoryBreakdown(year: number, month: number):
    Observable<{expenses: CategoryTotal[], incomes: CategoryTotal[]}> {
    return this.getTransactionsByMonth(year, month).pipe(
      map(transactions => {
        // Use filtered transactions for category breakdown if filters are applied
        const transactionsToUse = this.isFilterActive() ? this.filteredTransactions : transactions;

        const expenseCategories: { [key: string]: number } = {};
        const incomeCategories: { [key: string]: number } = {};

        transactionsToUse.forEach(transaction => {
          if (transaction.type === 'expense') {
            if (!expenseCategories[transaction.category]) {
              expenseCategories[transaction.category] = 0;
            }
            expenseCategories[transaction.category] += transaction.amount;
          } else {
            if (!incomeCategories[transaction.category]) {
              incomeCategories[transaction.category] = 0;
            }
            incomeCategories[transaction.category] += transaction.amount;
          }
        });

        return {
          expenses: Object.keys(expenseCategories).map((category, index) => ({
            category,
            total: expenseCategories[category],
            color: this.colorPalette[index % this.colorPalette.length]
          })),
          incomes: Object.keys(incomeCategories).map((category, index) => ({
            category,
            total: incomeCategories[category],
            color: this.colorPalette[index % this.colorPalette.length]
          }))
        };
      })
    );
  }

  private getTimeframeData(year: number, month: number, timeframe: 'daily' | 'weekly' | 'monthly'):
    Observable<TimeframeData> {
    return this.getTransactionsByMonth(year, month).pipe(
      map(transactions => {
        // Use filtered transactions if filters are applied
        const transactionsToUse = this.isFilterActive() ? this.filteredTransactions : transactions;

        if (timeframe === 'daily') {
          return this.getDailyData(transactionsToUse, year, month);
        } else if (timeframe === 'weekly') {
          return this.getWeeklyData(transactionsToUse, year, month);
        } else {
          return this.getMonthlyData(transactionsToUse, year);
        }
      })
    );
  }

  private getDailyData(transactions: Transaction[], year: number, month: number): TimeframeData {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const incomeData = Array(daysInMonth).fill(0);
    const expenseData = Array(daysInMonth).fill(0);
    const netData = Array(daysInMonth).fill(0);
    const labels = Array.from({length: daysInMonth}, (_, i) => (i + 1).toString());

    transactions.forEach(transaction => {
      const day = transaction.date.getDate() - 1; // 0-indexed array

      if (transaction.type === 'income') {
        incomeData[day] += transaction.amount;
      } else {
        expenseData[day] += transaction.amount;
      }
    });

    // Calculate net data
    for (let i = 0; i < daysInMonth; i++) {
      netData[i] = incomeData[i] - expenseData[i];
    }

    return { labels, incomeData, expenseData, netData };
  }

  private getWeeklyData(transactions: Transaction[], year: number, month: number): TimeframeData {
    // Get the first day of the month
    const firstDay = new Date(year, month, 1).getDay();
    // Get the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Calculate the number of weeks
    const numWeeks = Math.ceil((firstDay + daysInMonth) / 7);

    const incomeData = Array(numWeeks).fill(0);
    const expenseData = Array(numWeeks).fill(0);
    const netData = Array(numWeeks).fill(0);
    const labels = Array.from({length: numWeeks}, (_, i) => `Week ${i + 1}`);

    transactions.forEach(transaction => {
      const day = transaction.date.getDate();
      // Calculate week index (0-based)
      const weekIndex = Math.floor((day + firstDay - 1) / 7);

      if (transaction.type === 'income') {
        incomeData[weekIndex] += transaction.amount;
      } else {
        expenseData[weekIndex] += transaction.amount;
      }
    });

    // Calculate net data
    for (let i = 0; i < numWeeks; i++) {
      netData[i] = incomeData[i] - expenseData[i];
    }

    return { labels, incomeData, expenseData, netData };
  }

  private getMonthlyData(transactions: Transaction[], year: number): TimeframeData {
    const monthlyIncomeData = Array(12).fill(0);
    const monthlyExpenseData = Array(12).fill(0);
    const monthlyNetData = Array(12).fill(0);

    transactions.forEach(transaction => {
      const month = transaction.date.getMonth();

      if (transaction.type === 'income') {
        monthlyIncomeData[month] += transaction.amount;
      } else {
        monthlyExpenseData[month] += transaction.amount;
      }
    });

    // Calculate net data
    for (let i = 0; i < 12; i++) {
      monthlyNetData[i] = monthlyIncomeData[i] - monthlyExpenseData[i];
    }

    return {
      labels: this.shortMonthLabels,
      incomeData: monthlyIncomeData,
      expenseData: monthlyExpenseData,
      netData: monthlyNetData
    };
  }

  // UI interaction methods
  changeMonth(change: number): void {
    const newDate = new Date(this.currentYear, this.currentMonth + change, 1);
    this.monthYearSubject.next(newDate);
  }

  changeTimeframe(timeframe: 'daily' | 'weekly' | 'monthly'): void {
    this.comparisonTimeframe = timeframe;
    this.getTimeframeData(this.currentYear, this.currentMonth, timeframe).subscribe(data => {
      this.comparisonChartData.labels = data.labels;
      this.comparisonChartData.datasets[0].data = data.incomeData;
      this.comparisonChartData.datasets[1].data = data.expenseData;
      this.comparisonChartData.datasets[2].data = data.netData;

      // Update chart after data changes
      setTimeout(() => {
        this.updateAllCharts();
      }, 0);
    });
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) return;

    const formValue = this.transactionForm.value;
    const transaction: Transaction = {
      amount: parseFloat(formValue.amount),
      category: formValue.category,
      description: formValue.description,
      date: new Date(formValue.date),
      nepaliDate: formValue.nepaliDate,
      type: formValue.type
    };

    const transactionsCollection = collection(this.firestore, 'transactions');

    if (formValue.id) {
      // Update existing transaction
      const transactionDoc = doc(this.firestore, `transactions/${formValue.id}`);
      updateDoc(transactionDoc, { ...transaction })
        .then(() => {
          this.resetForm();
          this.editingTransaction = null;
          // Refresh data to update charts
          this.monthYearSubject.next(new Date(this.currentYear, this.currentMonth, 1));
        })
        .catch(error => console.error('Error updating transaction:', error));
    } else {
      // Add new transaction
      addDoc(transactionsCollection, transaction)
        .then(() => {
          this.resetForm();
          // Refresh data to update charts
          this.monthYearSubject.next(new Date(this.currentYear, this.currentMonth, 1));
        })
        .catch(error => console.error('Error adding transaction:', error));
    }
  }

  resetForm(): void {
    const today = new Date(this.currentYear, this.currentMonth, new Date().getDate());
    this.transactionForm.reset({
      id: null,
      category: '',
      date: today.toISOString().split('T')[0],
      type: this.activeTransactionType
    });
    this.editingTransaction = null;
  }

  editTransaction(transaction: Transaction): void {
    this.editingTransaction = transaction;
    this.transactionForm.patchValue({
      id: transaction.id,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      date: transaction.date.toISOString().split('T')[0],
      nepaliDate: transaction.nepaliDate,
      type: transaction.type
    });
  }

  deleteTransaction(id?: string): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this transaction?')) {
      const transactionDoc = doc(this.firestore, `transactions/${id}`);
      deleteDoc(transactionDoc)
        .then(() => {
          // Refresh data to update charts
          this.monthYearSubject.next(new Date(this.currentYear, this.currentMonth, 1));
        })
        .catch(error => console.error('Error deleting transaction:', error));
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  applyFilters(): void {
    const filters = this.filterForm.value;

    // Apply filters to transactions
    this.filteredTransactions = this.transactions.filter(transaction => {
      // Category filter
      if (filters.category !== 'all' && transaction.category !== filters.category) {
        return false;
      }

      // Transaction type filter
      if (filters.transactionType !== 'all' && transaction.type !== filters.transactionType) {
        return false;
      }

      // Amount range filter
      if (filters.amountRangeMin && transaction.amount < parseFloat(filters.amountRangeMin)) {
        return false;
      }
      if (filters.amountRangeMax && transaction.amount > parseFloat(filters.amountRangeMax)) {
        return false;
      }

      // Date range filter
      if (filters.dateRangeStart) {
        const startDate = new Date(filters.dateRangeStart);
        if (transaction.date < startDate) {
          return false;
        }
      }
      if (filters.dateRangeEnd) {
        const endDate = new Date(filters.dateRangeEnd);
        if (transaction.date > endDate) {
          return false;
        }
      }

      return true;
    });

    // Update filtered expenses and incomes
    this.filteredExpenses = this.filteredTransactions.filter(t => t.type === 'expense');
    this.filteredIncomes = this.filteredTransactions.filter(t => t.type === 'income');

    // Update charts with filtered data
    this.updateChartsWithFilteredData();
  }

  private updateChartsWithFilteredData(): void {
    // Update category breakdown with filtered data
    this.getCategoryBreakdown(this.currentYear, this.currentMonth).subscribe(categoryTotals => {
      // Update expense category doughnut chart
      if (categoryTotals.expenses.length === 0) {
        this.expenseDoughnutChartData.labels = ['No Data'];
        this.expenseDoughnutChartData.datasets[0].data = [1];
      } else {
        this.expenseDoughnutChartData.labels = categoryTotals.expenses.map(item => item.category);
        this.expenseDoughnutChartData.datasets[0].data = categoryTotals.expenses.map(item => item.total);
      }

      // Update income category doughnut chart
      if (categoryTotals.incomes.length === 0) {
        this.incomeDoughnutChartData.labels = ['No Data'];
        this.incomeDoughnutChartData.datasets[0].data = [1];
      } else {
        this.incomeDoughnutChartData.labels = categoryTotals.incomes.map(item => item.category);
        this.incomeDoughnutChartData.datasets[0].data = categoryTotals.incomes.map(item => item.total);
      }
    });

    // Update comparison chart with filtered data
    this.getTimeframeData(this.currentYear, this.currentMonth, this.comparisonTimeframe)
      .subscribe(timeframeData => {
        this.comparisonChartData.labels = timeframeData.labels;
        this.comparisonChartData.datasets[0].data = timeframeData.incomeData;
        this.comparisonChartData.datasets[1].data = timeframeData.expenseData;
        this.comparisonChartData.datasets[2].data = timeframeData.netData;

        // Update chart after data changes
        setTimeout(() => {
          this.updateAllCharts();
        }, 0);
      });
  }

  private isFilterActive(): boolean {
    const filterValues = this.filterForm.value;
    return filterValues.category !== 'all' ||
      filterValues.transactionType !== 'all' ||
      filterValues.dateRangeStart !== '' ||
      filterValues.dateRangeEnd !== '' ||
      filterValues.amountRangeMin !== '' ||
      filterValues.amountRangeMax !== '';
  }

  resetFilters(): void {
    this.filterForm.reset({
      category: 'all',
      transactionType: 'all',
      dateRangeStart: '',
      dateRangeEnd: '',
      amountRangeMin: '',
      amountRangeMax: '',
    });

    // Reset filtered data
    this.filteredTransactions = [...this.transactions];
    this.filteredExpenses = [...this.expenses];
    this.filteredIncomes = [...this.incomes];

    // Refresh data and charts
    this.monthYearSubject.next(new Date(this.currentYear, this.currentMonth, 1));
  }

  get transactionCategories(): string[] {
    return this.activeTransactionType === 'expense' ? this.expenseCategories : this.incomeCategories;
  }

  changeTransactionType(type: 'expense' | 'income'): void {
    this.activeTransactionType = type;

    // Force chart to update after a brief delay
    setTimeout(() => {
      if (this.categoryChart) {
        this.categoryChart.chart?.update();
      }
    }, 50);
  }
}
