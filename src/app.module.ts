import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import * as dotenv from 'dotenv';
import { EnvironmentService } from './environment/environment.service';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot(EnvironmentService.getTypeOrmConfig()),
    ProductsModule/* ,
    ProductsModule, */
  ],
  providers: [EnvironmentService]
})
export class AppModule {}
