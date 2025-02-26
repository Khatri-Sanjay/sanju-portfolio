import { Pipe, PipeTransform } from '@angular/core';
import {Timestamp} from 'firebase/firestore';

@Pipe({
  standalone: true,
  name: 'convertToStandardDateTime'
})
export class ConvertToStandardDateTimePipe implements PipeTransform {

  transform(inputDate: string | Date | Timestamp): string | null {
    try {
      // Handle Firebase Timestamp
      if (inputDate instanceof Timestamp) {
        return inputDate.toDate().toISOString(); // Convert Firebase Timestamp to Date, then to ISO 8601
      }

      // Handle cases where the input is already a Date object
      if (inputDate instanceof Date && !isNaN(inputDate.getTime())) {
        return inputDate.toISOString();
      }

      // Handle string inputs
      if (typeof inputDate === "string") {
        // Try to parse the input using the Date object
        const parsedDate = new Date(inputDate);

        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toISOString(); // Convert to ISO 8601 format
        }

        // Handle specific formats (add additional formats as needed)
        const formats = [
          /^\d{4}\/\d{1,2}\/\d{1,2}$/, // yyyy/MM/dd
          /^\d{1,2}\/\d{1,2}\/\d{4}$/, // MM/dd/yyyy
          /^\d{4}-\d{1,2}-\d{1,2}$/,   // yyyy-MM-dd
          /^\d{4}\.\d{1,2}\.\d{1,2}$/, // yyyy.MM.dd
          /^\d{1,2}-\d{1,2}-\d{4}$/,   // dd-MM-yyyy
        ];

        for (const format of formats) {
          if (format.test(inputDate)) {
            const standardizedInput = inputDate.replace(/[-\/\.]/g, "-");
            const dateParts = standardizedInput.split("-").map((part) => parseInt(part, 10));

            // Adjust for format differences (e.g., dd-MM-yyyy)
            if (format === formats[4]) {
              return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]).toISOString();
            }

            // Default assumption: yyyy-MM-dd
            return new Date(dateParts[0], dateParts[1] - 1, dateParts[2] || 1).toISOString();
          }
        }
      }

      // Return null if the input is invalid or unrecognized
      return null;
    } catch (error) {
      console.error("Error converting date:", error);
      return null;
    }
  }

}
