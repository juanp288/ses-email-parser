import * as fs from 'fs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EmailParser } from './helpers/mail-parser.helper';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class MailService {
  constructor(
    private readonly axiosAdapter: AxiosAdapter,
    private readonly mailParser: EmailParser,
  ) {}

  async findJsonInMail(url: string) {
    try {
      const { attachments, text } = await this.getEmailParsedContent(url);

      const searchFunctions = [
        () => this.searchJsonInAttachments(attachments),
        () => this.searchJsonInBody(text),
        () => this.searchJsonLinkAndFetch(text),
      ];

      for (const searchFunction of searchFunctions) {
        const jsonContent = await searchFunction();
        if (jsonContent && !this.isValidJson(jsonContent)) return jsonContent;
      }

      return null;
    } catch (error) {
      console.error('Error al buscar JSON en el correo:', error);
      throw new BadRequestException('No encontramos un JSON en el email');
    }
  }

  /**
   * Busca archivos con formato json
   * @param attachments Archivos adjuntos en el correo
   * @returns Un JSON si lo encuentra
   */
  private searchJsonInAttachments(attachments: any[]): any {
    for (const attachment of attachments) {
      if (attachment.contentType === 'application/json') {
        return JSON.parse(attachment.content.toString('utf8'));
      }
    }
    return null;
  }

  /**
   * Intenta encontrar JSON incrustado directamento
   * @param body Contenido del correo electronico
   * @returns Un JSON si lo encuentra
   */
  private searchJsonInBody(body: string): Promise<any> {
    const jsonPattern = /{.*}/s; // Un patrón simple que busca algo que parezca JSON

    // TODO: Validar que sea un json valido y no un { ..algo }
    const match = body.match(jsonPattern);
    if (match) return JSON.parse(match[0]);

    return null;
  }

  /**
   * Busca una URL que y la consulta, y valida si el response es un json valido
   * @param body Contenido del correo electronico
   * @returns Un JSON si lo encuentra
   */
  private async searchJsonLinkAndFetch(body: string): Promise<any> {
    const urlPattern = /https?:\/\/[^\s]+/;
    const match = body.match(urlPattern);

    const urlContent = await this.axiosAdapter.get(match[0]);
    if (!this.isValidJson(urlContent)) return urlContent;

    return null;
  }

  /**
   * Devuelve un Email valido para ser procesado
   * @param url Ubicacion o enlace del email
   * @returns
   */
  private async getEmailParsedContent(url: string) {
    let emailContent: any;

    // Obtener el correo electrónico (aquí se asume que es un archivo local o una URL)
    if (url.startsWith('http')) {
      emailContent = await this.axiosAdapter.get(url);
    } else {
      emailContent = fs.readFileSync(url, 'utf-8');
    }

    const parsedEmail = await this.mailParser.getParsedMail(emailContent);

    if (!parsedEmail) throw new Error('No pudimos parsear el email');
    return parsedEmail;
  }

  /**
   * Retorna un boleano basado en si es un json valido o no
   * @param text Contenido a validar
   * @returns
   */
  private isValidJson(text: any) {
    try {
      JSON.parse(text);
      return true;
    } catch (error) {
      return false;
    }
  }
}
