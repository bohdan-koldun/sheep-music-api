import { Module, Global } from '@nestjs/common';
import { ConfigModule } from 'nestjs-config';
import * as path from 'path';
import { apiProviders } from '../api/api.providers';
import { DatabaseModule } from '../database/database.module';
import { FileAwsUploaderModule } from '../file-aws-uploader/file.aws.uploader.module';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { AuthModule } from '../auth/auth.module';
import {  ChordsScriptsService } from './chords/service';

@Global()

@Module({
    imports: [
        ConfigModule.load(path.resolve(__dirname, '../src/config', '**/!(*.d).{ts,js}')),
        DatabaseModule,
        UserModule,
        AuthModule,
        FileAwsUploaderModule,
        MailModule,
    ],
    controllers: [],
    providers: [
        ...apiProviders,
        ChordsScriptsService,
    ],
})

export class ScriptsModule { }
