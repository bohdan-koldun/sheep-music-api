import { Module, Global } from '@nestjs/common';
import { ConfigModule } from 'nestjs-config';
import * as path from 'path';
import { apiProviders } from '../src/api/api.providers';
import { DatabaseModule } from '../src/database/database.module';
import { FileAwsUploaderModule } from '../src/file-aws-uploader/file.aws.uploader.module';
import { UserModule } from '../src/user/user.module';
import { MailModule } from '../src/mail/mail.module';
import { AuthModule } from '../src/auth/auth.module';

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
    ],
    exports: [
        ...apiProviders,
    ],
})

export class ScriptsModule { }
