import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import models from 'src/database/models';
import { AuthModule } from './auth/auth.module';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { MALModule } from './routes/mal/mal.module';
import { getSequelizeConfiguration } from './utils/sequelize_config';

const sequelizeLogger = new Logger('Sequelize');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config) => ({
        ...getSequelizeConfiguration(config),
        models,
        benchmark: true,
        logging: (message, time) => sequelizeLogger.log(`(${time}ms) ${message}`)
      }),
    }),
    HealthcheckModule,
    AuthModule,
    MALModule
  ],
})
export class AppModule { }
