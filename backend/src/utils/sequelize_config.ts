import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

export function getSequelizeConfiguration(configService: ConfigService): SequelizeModuleOptions {
    return {
        dialect: configService.get('DB_DIALECT'),
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        dialectOptions: {
            connectTimeout: configService.get('DB_CONNECTION_TIMEOUT'),
        },
    };
}
