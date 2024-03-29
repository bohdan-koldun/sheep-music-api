import { createConnection } from 'typeorm';
import { ConfigService } from 'nestjs-config';

export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: async (configService: ConfigService) => {
            return await createConnection({
                type: 'postgres',
                host: configService.get('database.host'),
                port: Number(configService.get('database.port')),
                username: configService.get('database.user'),
                password: configService.get('database.password'),
                database: configService.get('database.database'),
                extra: {
                    charset: 'utf8mb4_unicode_ci',
                },
                entities: [
                    __dirname + '/../**/*.entity{.ts,.js}',
                ],
            });
        },
        inject: [
            ConfigService,
        ],
    },
];
