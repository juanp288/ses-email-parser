export class IsValidJsonHelper {
  /**
   * Retorna un boleano basado en si es un json valido o no
   * @param text Contenido a validar
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
