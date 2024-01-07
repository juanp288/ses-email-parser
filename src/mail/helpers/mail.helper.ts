import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { EmailParser } from './mail-parser.helper';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { IsValidJsonHelper } from './is-valid-json.helper';

@Injectable()
export class MailHelper {
  constructor(
    private readonly jsonValidations: IsValidJsonHelper,
    private readonly axiosAdapter: AxiosAdapter,
    private readonly mailParser: EmailParser,
  ) {}

  /**
   * Search for files in json format
   * @param attachments Attachments in the mail
   * @returns a JSON if found
   */
  searchJsonInAttachments(attachments: any[]) {
    for (const attachment of attachments) {
      if (attachment.contentType === 'application/json') {
        return JSON.parse(attachment.content.toString('utf8'));
      }
    }
    return null;
  }

  /**
   * Attempt to find embedded JSON directly
   * @param body Email content
   * @returns a JSON if found
   */
  searchJsonInBody(body: string) {
    const jsonPattern = /{.*}/s;

    const match = body.match(jsonPattern);
    if (match) return JSON.parse(match[0]);

    return null;
  }

  /**
   * Search for a URL and query, and validate if the response is a valid json.
   * @param body Email content
   * @returns a JSON if found
   */
  async searchJsonLinkAndFetch(body: string) {
    const urlPattern = /https?:\/\/[^\s]+/;
    const match = body.match(urlPattern);

    const urlContent = await this.axiosAdapter.get(match[0]);
    if (!this.jsonValidations.isValidJson(urlContent)) return urlContent;

    return null;
  }

  /**
   * Returns a valid email to be processed.
   * @param url Location or link of the email
   * @returns
   */
  async getEmailParsedContent(url: string) {
    let emailContent;

    if (url.startsWith('http')) {
      emailContent = await this.axiosAdapter.get(url);
    } else {
      emailContent = fs.readFileSync(url, 'utf-8');
    }

    const parsedEmail = await this.mailParser.getParsedMail(emailContent);

    if (!parsedEmail) throw new Error('No pudimos parsear el email');
    return parsedEmail;
  }
}
