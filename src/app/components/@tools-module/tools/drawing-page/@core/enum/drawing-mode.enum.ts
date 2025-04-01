// Enum definition
export enum DrawingMode {
  Brush = 'brush',
  Eraser = 'eraser',
  Shape = 'shape',
  Text = 'text'
}

// Utility class for enum operations
export class DrawingModeHelper {
  /**
   * Get the key (enum name) by its value
   * @param value The enum value
   * @returns The corresponding enum key or undefined if not found
   */
  static getKeyByValue(value: string): string | undefined {
    return Object.keys(DrawingMode).find(
      key => DrawingMode[key as keyof typeof DrawingMode] === value
    );
  }

  /**
   * Get the value by its key
   * @param key The enum key
   * @returns The corresponding enum value or undefined if not found
   */
  static getValueByKey(key: string): string | undefined {
    return DrawingMode[key as keyof typeof DrawingMode];
  }

  /**
   * Get all enum values as an array of objects with key-value pairs
   * @returns Array of key-value pairs
   */
  static getEnumArray(): { key: string; value: string }[] {
    return Object.entries(DrawingMode).map(([key, value]) => ({ key, value }));
  }
}
