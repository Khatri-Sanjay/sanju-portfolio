import {ObjectUtil} from "./object-util";

export class StringUtils {

  static compareStrings(initialValue: string, comparingValue: string, checkCaseSensitivity: boolean = false) {
    return !checkCaseSensitivity ? initialValue?.trim()?.toLowerCase() === comparingValue?.trim()?.toLowerCase() : initialValue?.trim() == comparingValue?.trim();
  }

  static compareMatchedStrings(str1: string, str2: string, threshold: number = 0.7): boolean {
    const len1 = str1.length;
    const len2 = str2.length;
    const maxLength = Math.max(len1, len2);
    const minLength = Math.min(len1, len2);

    const distance = Array.from({length: minLength + 1}, (_, i) => i);

    for (let i = 1; i <= maxLength; i++) {
      const prevDistance = [...distance];
      distance[0] = i;

      for (let j = 1; j <= minLength; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        distance[j] = Math.min(
          prevDistance[j - 1] + cost,
          distance[j - 1] + 1,
          prevDistance[j] + 1
        );
      }
    }

    const similarity = 1 - distance[minLength] / maxLength;

    return similarity >= threshold;
  }

  static camelCase(input: string): string {
    return input?.toLowerCase()?.replace(/[-_]+(.)?/g, (_match, char) => {
      return char ? char?.toUpperCase() : '';
    });
  }

  /**
   * Desc: Convert to lowercase and replace spaces with camelCase
   * @param fieldName
   * return formattedString
   */

  static toStandardFormat(fieldName: string): string {
    return fieldName.toLowerCase()
      .replace(/\s+(.)/g, (match, group1) => group1.toUpperCase());
  }

  static toOriginalFormat(fieldName: string): string {
    return fieldName.replace(/([A-Z])/g, (match) => ` ${match}`)
      .replace(/^\w/, (match) => match.toUpperCase());
  }

  static formatStringIncludingIndex(input: string, index: number): string {
    if (ObjectUtil.isEmpty(input) || ObjectUtil.isEmpty(index)) return '';

    // Split the string by space, capitalize the first letter of each part, and join them back
    const formattedString = input?.replace(/\b\w/g, (char) => char.toUpperCase());

    // Remove all spaces
    const stringWithoutSpaces = formattedString?.replace(/\s+/g, '');

    const formattedIndex = index < 10 ? `0${index + 1}` : index?.toString();
    return stringWithoutSpaces + '_' + formattedIndex;
  }

  static capitalizeFirstLetter(input: string) {
    if (ObjectUtil.isEmpty(input)) {
      return input; // handle null or empty strings
    }
    // Convert first character to uppercase and rest to lowercase
    return input?.substring(0, 1)?.toUpperCase() + input?.substring(1)?.toLowerCase();
  }

}
