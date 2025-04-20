import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { DocumentModule } from './document/document.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './common/config/configuration';

const modules = [
  UsersModule,
  AuthModule,
]

const config = [
  ConfigModule.forRoot({
    isGlobal: true
  }),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: configuration().DB_HOST,
    port: 5432,
    username: configuration().DB_USERNAME,
    password: configuration().DB_PASSWORD,
    database: configuration().DB_DATABASE,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: true,
    logger: 'advanced-console',
    // dropSchema: true,
  })
]


@Module({
  imports: [
    ...config,
    ...modules,
    DocumentModule,
    IngestionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
