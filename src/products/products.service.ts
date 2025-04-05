import { Injectable } from '@nestjs/common';
import { CreateProductDto, ProductCategory } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  
  async create(createProductDto: CreateProductDto) {
    console.log('createProductDto:', createProductDto)
    const product = this.productRepository.create(createProductDto);
    console.log('product:', product)
    return await this.productRepository.save(product);
  }

  // Método para búsqueda avanzada
  async searchProducts(
    name?: string,
    category?: ProductCategory,
    location?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<Product[]> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (name) {
      queryBuilder.andWhere('LOWER(product.name) LIKE :name', { name: `%${name.toLowerCase()}%` });
    }

    if (category) {
      queryBuilder.andWhere('product.category = :category', { category });
    }

    if (location) {
      queryBuilder.andWhere('LOWER(product.location) LIKE :location', { location: `%${location.toLowerCase()}%` });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    return queryBuilder.getMany();
  }

  
}
