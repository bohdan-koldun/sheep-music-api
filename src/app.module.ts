import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from 'nestjs-config';
import { ScheduleModule } from 'nest-schedule';
import * as path from 'path';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ApiModule } from './api/api.module';
import { HttpErrorFilter } from './common/filters/http-error.filter';
import { SocketModule } from './socket/socket.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { FileAwsUploaderModule } from './file-aws-uploader/file.aws.uploader.module';
import { DatabaseChangesScheduleService } from './schedule/schedule.service';
import { ParserModule } from './parser/parser.module';

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
    DatabaseModule,
    UserModule,
    ApiModule,
    SocketModule,
    MailModule,
    AuthModule,
    FileAwsUploaderModule,
    ScheduleModule.register({}),
    ParserModule,
  ],
  controllers: [AppController],
  providers: [
    DatabaseChangesScheduleService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule { }
