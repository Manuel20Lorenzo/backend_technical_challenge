// src/products/dto/create-product.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsPositive, IsEnum } from 'class-validator';

export enum ProductCategory {
  ELECTRONICS = 'Electronics',
  FURNITURE = 'Furniture',
  CLOTHING = 'Clothing',
  BOOKS = 'Books',
  FOOD = 'Food',
  Home = "Home",
}

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Categoría del producto',
    example: 'Electronics',
  })
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @ApiProperty({
    description: 'Ubicación del producto',
    example: 'Caracas, Venezuela',
  })
  @IsString()
  @IsOptional()
  location?: string;

}
