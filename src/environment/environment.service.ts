import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';
dotenv.config();

@Injectable()

export class EnvironmentService {

  MONGODB_URI1: string;
  MONGODB_URI2: string
  URL_VALIDATE: string;
  //URL_KENZI:string;
  private readonly envConfig: { [key: string]: string };
  private logger = new Logger('CONFIG')
  constructor() {
    /* ////console.log(process.env.NODE_ENV) */
    /* if (
      process.env.NODE_ENV === 'development'
    ) { */
    let url_payall
    if (process.env.NODE_ENV === 'development') {
      this.logger.debug('TENGO ENTORNO...')
    } else {
      this.logger.warn('Esto es un entorno de TEST :)')
      /* stop() */
    }
    
    /* ////console.log(this.envConfig) */
  }
  /* 
  NODE_ENV = 'development'
  MONGODB_URI1 = 'mongodb://localhost:27017/prueba_nestjs'
  MONGODB_URI2 = 'mongodb://localhost:27017/inf_privado'
  PORT = 3000
  URL_VALIDATE = 'http://localhost:4200' */
  get(key: string): string {
    return this.envConfig[key];
  }
  static getTypeOrmConfig(): TypeOrmModuleOptions {
    console.log({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USERNAME || 'myuser',
      password: process.env.POSTGRES_PASS || 'mypassword',
      database: process.env.POSTGRES_DB || 'mydatabase',
      retryAttempts: parseInt(process.env.POSTGRES_RETRY, 10) || 10,
      synchronize: true, // En producción usa migraciones
      logging: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
      autoLoadEntities: false,
    })
    return {
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USERNAME || 'myuser',
      password: process.env.POSTGRES_PASS || 'mypassword',
      database: process.env.POSTGRES_DB || 'mydatabase',
      retryAttempts: parseInt(process.env.POSTGRES_RETRY, 10) || 5,
      synchronize: true, // En producción usa migraciones
      logging: true,
      entities: ['dist/**/*.entity{.ts,.js}'],

    }
  }
  /* static isNotProduction(): boolean {
    if (process.env.NODE_ENV === 'production') {
      return false
    } else {
      return true
    }
    // new Error('Method not implemented.');
  } */

}

