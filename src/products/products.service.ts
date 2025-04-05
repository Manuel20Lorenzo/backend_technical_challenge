import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateProductDto, ProductCategory } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {
      this.logger.debug('createProductDto:', createProductDto)
      const product = this.productRepository.create(createProductDto);
      this.logger.debug('product:', product)
      return await this.productRepository.save(product);
    } catch (error) {
      this.logger.error('Ocurrio un error:', error)
      return new HttpException({ msg: 'Ocurrio un error al crear el producto...' }, HttpStatus.UNPROCESSABLE_ENTITY)
    }

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
      // Ranking por relevancia (case-insensitive)
      queryBuilder.addOrderBy(
        `CASE
          WHEN LOWER(product.name) = :exact THEN 1
          WHEN LOWER(product.name) LIKE :starts THEN 2
          ELSE 3
            END`,
            'ASC',
      );

      queryBuilder.setParameters({
        exact: name.toLowerCase(),
        starts: `${name.toLowerCase()}%`,
      });
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
