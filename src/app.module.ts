import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [MailModule],
})
export class AppModule {}
