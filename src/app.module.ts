import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { ApiModule } from './api.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    ApiModule,
    MailModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
