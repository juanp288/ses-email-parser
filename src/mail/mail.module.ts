import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { CommonModule } from 'src/common/common.module';
import { EmailParser } from './helpers/mail-parser.helper';
import { MailHelper } from './helpers/mail.helper';
import { IsValidJsonHelper } from './helpers/is-valid-json.helper';

@Module({
  imports: [CommonModule],
  controllers: [MailController],
  providers: [MailService, EmailParser, MailHelper, IsValidJsonHelper],
})
export class MailModule {}
