import { Module } from '@nestjs/common';
import { MailerModule, PugAdapter } from '@nest-modules/mailer';
import { ConfigService } from '../config/config.service';

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: (config: ConfigService) => ({
                transport:
                    `${config.get('MAIL_CONNECTION')}://` +
                    `${config.get('MAIL_USERNAME')}:` +
                    `${config.get('MAIL_PASSWORD')}@` +
                    `${config.get('SMTP_HOST')}`,
                defaults: {
                    from: config.get('MAIL_FROM'),
                },
                template: {
                    dir: __dirname + '/templates',
                    adapter: new PugAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            inject: [ConfigService],
        }),
    ],
})

export class MailModule { }
