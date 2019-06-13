import { createConnection, Connection } from 'typeorm';
import { User, Confirmation, Role, RoleUser } from '../user/entities';
import { ConfigService } from '../config/config.service';

export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: async (configService: ConfigService) => {
            return await createConnection({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: Number(configService.get('DB_PORT')),
                username: configService.get('DB_USER'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_DATABASE'),
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
