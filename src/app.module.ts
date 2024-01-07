import { join } from 'path';
import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MailModule,
  ],
})
export class AppModule {}
