import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { CommonModule } from 'src/common/common.module';
import { EmailParser } from './helpers/mail-parser.helper';

@Module({
  imports: [CommonModule],
  controllers: [MailController],
  providers: [MailService, EmailParser],
})
export class MailModule {}
