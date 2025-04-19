// import { Injectable } from '@angular/core';
// import {NepaliDate} from '../components/@admin-module/expense-tracker/expense-tracker.component';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class NepaliDateService {
// // Nepali month names
//   nepaliMonths = [
//     'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
//     'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
//   ];
//
// // Short Nepali month names
//   shortNepaliMonths = [
//     'Bai', 'Jes', 'Ash', 'Shr', 'Bha', 'Ash',
//     'Kar', 'Man', 'Pou', 'Mag', 'Fal', 'Cha'
//   ];
//
// // Convert from AD to BS (Gregorian to Nepali)
//   toBS(date: Date): NepaliDate {
//     const nepaliDate = new NepaliDateConverter(date);
//     const bsDate = nepaliDate.getBS();
//
//     return {
//       year: bsDate.year,
//       month: bsDate.month - 1, // Convert to 0-indexed
//       day: bsDate.date,
//       formatBS: `${bsDate.year}-${this.padZero(bsDate.month)}-${this.padZero(bsDate.date)}`
//     };
//   }
//
// // Convert from BS to AD (Nepali to Gregorian)
//   toAD(year: number, month: number, day: number): Date {
//     const nepaliDate = new NepaliDateConverter();
//     return nepaliDate.BS2AD(year, month + 1, day); // Convert to 1-indexed for the library
//   }
//
// // Get first day of Nepali month in AD
//   getFirstDayOfNepaliMonth(bsYear: number, bsMonth: number): Date {
//     return this.toAD(bsYear, bsMonth, 1);
//   }
//
// // Get last day of Nepali month in AD
//   getLastDayOfNepaliMonth(bsYear: number, bsMonth: number): Date {
// // Get the number of days in the Nepali month
//     const daysInMonth = this.getDaysInNepaliMonth(bsYear, bsMonth);
//     return this.toAD(bsYear, bsMonth, daysInMonth);
//   }
//
// // Get number of days in a Nepali month
//   getDaysInNepaliMonth(year: number, month: number): number {
//     const converter = new NepaliDateConverter();
//     return converter.numberOfDaysInMonth(year, month + 1); // Convert to 1-indexed for the library
//   }
//
// // Get current Nepali date
//   getCurrentNepaliDate(): NepaliDate {
//     return this.toBS(new Date());
//   }
//
// // Format Nepali date as string (YYYY-MM-DD)
//   formatNepaliDate(year: number, month: number, day: number): string {
//     return `${year}-${this.padZero(month + 1)}-${this.padZero(day)}`;
//   }
//
// // Get Nepali month name
//   getNepaliMonthName(month: number): string {
//     return this.nepaliMonths[month];
//   }
//
// // Get short Nepali month name
//   getShortNepaliMonthName(month: number): string {
//     return this.shortNepaliMonths[month];
//   }
//
// // Pad zero for single digit numbers
//   private padZero(num: number): string {
//     return num < 10 ? `0${num}` : `${num}`;
//   }
// }
