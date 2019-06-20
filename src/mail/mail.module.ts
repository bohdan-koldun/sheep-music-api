import { Module } from '@nestjs/common';
import { MailerModule, PugAdapter } from '@nest-modules/mailer';
import { ConfigService } from 'nestjs-config';

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: (config: ConfigService) => ({
                transport:
                    `${config.get('mail.connection')}://` +
                    `${config.get('mail.username')}:` +
                    `${config.get('mail.password')}@` +
                    `${config.get('mail.host')}`,
                defaults: {
                    from: config.get('mail.from'),
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
