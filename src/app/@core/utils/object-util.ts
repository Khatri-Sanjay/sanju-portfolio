export class ObjectUtil {
  static isEmpty(input: any) {
    return input === undefined || input === null || input === '' || input.length === 0 || input === 'null' || input === 'undefined' || input === 'Infinity' || input === '{}';
  }

  public static setUndefinedIfNull(input: any): any {
    return this.isEmpty(input) ? undefined : input;
  }

  public static setInputOrElseNext(input: any, next: any): any {
    return this.isEmpty(input) ? next : input;
  }

  public static separateFirstDash(input: any) {
    let value = [];
    if (this.isEmpty(input)) {
      return undefined;
    }
    value = input.split('-');
    return value[0] ? value[0] : undefined;
  }

  public static checkNull(value: any) {
    if (!value) {
      return true;
    }
    if (Array.isArray(value) || typeof value === 'string') {
      return !value.length;
    }
    for (var key in value) {
      if (ObjectUtil.hasOwnProperty.call(value, key)) {
        return false;
      }
    }
    return true;
  }

  public static checkIsArray(value: any) {
    if (!value) {
      return false;
    }
    return Array.isArray(value);
  }

}
