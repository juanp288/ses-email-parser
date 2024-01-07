import { BadRequestException, Injectable } from '@nestjs/common';
import { MailHelper } from './helpers/mail.helper';
import { IsValidJsonHelper } from './helpers/is-valid-json.helper';

@Injectable()
export class MailService {
  constructor(
    private readonly jsonValidations: IsValidJsonHelper,
    private readonly mailHelper: MailHelper,
  ) {}

  async findJsonInMail(url: string) {
    try {
      const { attachments, text } =
        await this.mailHelper.getEmailParsedContent(url);

      const searchFunctions = [
        () => this.mailHelper.searchJsonInAttachments(attachments),
        () => this.mailHelper.searchJsonInBody(text),
        () => this.mailHelper.searchJsonLinkAndFetch(text),
      ];

      for (const searchFunction of searchFunctions) {
        const jsonContent = await searchFunction();
        if (jsonContent && !this.jsonValidations.isValidJson(jsonContent))
          return jsonContent;
      }

      return null;
    } catch (error) {
      console.error('Error al buscar JSON en el correo:', error);
      throw new BadRequestException('No encontramos un JSON en el email');
    }
  }
}
