export interface Transaction {
  id?: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  nepaliDate: string;
  type: 'income' | 'expense';
}

export interface CategoryTotal {
  category: string;
  total: number;
  color: string;
}

export interface MonthlyTotal {
  month: number;
  incomeTotal: number;
  expenseTotal: number;
  netTotal: number;
}

export interface TimeframeData {
  labels: string[];
  incomeData: number[];
  expenseData: number[];
  netData: number[];
}

export const EXPENSE_CATEGORIES: string[] = [
  'Housing', 'Transportation', 'Food', 'Utilities',
  'Healthcare', 'Entertainment', 'Personal', 'Education',
  'Debt', 'Savings', 'Other'
];

export const INCOME_CATEGORIES: string[] = [
  'Salary', 'Business', 'Investments', 'Freelance',
  'Rental', 'Interest', 'Dividends', 'Gifts', 'Other'
];
