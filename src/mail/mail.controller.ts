import { Controller, Get, Query } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  async findJsonInMail(@Query('url') url: string) {
    return this.mailService.findJsonInMail(url);
  }
}
