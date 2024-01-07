import { join } from 'path';
import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      validationSchema: JoiValidationSchema,
    }),
    MailModule,
  ],
})
export class AppModule {}
