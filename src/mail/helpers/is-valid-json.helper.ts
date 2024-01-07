export class IsValidJsonHelper {
  /**
   * Return a boolean based on whether it is a valid json or not.
   * @param text Content to validate
   * @returns
   */
  public isValidJson(text: any) {
    try {
      JSON.parse(text);
      return true;
    } catch (error) {
      return false;
    }
  }
}
