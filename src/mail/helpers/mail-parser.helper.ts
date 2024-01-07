import { ParsedMail, simpleParser } from 'mailparser';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailParser {
  /**
   * Receives a simple email and returns structure object.
   * @param emailContent Simple email
   * @returns ParsedMail
   */
  async getParsedMail(emailContent: any): Promise<ParsedMail> {
    return await simpleParser(emailContent);
  }
}
