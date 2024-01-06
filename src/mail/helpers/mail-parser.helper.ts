import { ParsedMail, simpleParser } from 'mailparser';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailParser {
  async getParsedMail(emailContent: any): Promise<ParsedMail> {
    return await simpleParser(emailContent);
  }
}
