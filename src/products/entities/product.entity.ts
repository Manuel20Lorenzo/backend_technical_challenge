import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'product' })
export class Product {
  @ApiProperty({ description: 'ID del producto' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre del producto' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Categoría del producto' })
  @Column()
  category: string;

  @ApiProperty({ description: 'Ubicación del producto' })
  @Column()
  location: string;
}
