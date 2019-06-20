import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const ormconfig = [];

const commonConfig = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    sslmode: process.env.DB_SSL,
    entities: [
        'src/**/*.entity{.ts,.js}',
    ],
};

ormconfig.push({
    ...commonConfig,
    migrationsTableName: 'migrations',
    migrations: [
        'src/database/migrations/*.ts',
    ],
    cli: {
        migrationsDir: 'src/database/migrations',
    },
});

ormconfig.push({
    name: 'seed',
    ...commonConfig,
    migrationsTableName: 'seeds_migrations',
    migrations: [
        'src/database/seeds/*.ts',
    ],
    cli: {
        migrationsDir: 'src/database/seeds',
    },
});

fs.writeFileSync('ormconfig.json', JSON.stringify(ormconfig, null, 2));
