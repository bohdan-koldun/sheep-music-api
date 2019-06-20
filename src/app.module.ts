import { Module } from '@nestjs/common';
import { ConfigModule } from 'nestjs-config';
import * as path from 'path';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { ApiModule } from './api.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
    DatabaseModule,
    ApiModule,
    MailModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
