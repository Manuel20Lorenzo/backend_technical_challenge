import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, HttpException, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, ProductCategory } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ApiQuery } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto).then(
      (product)=>{

        return product
      }
    ).catch(
      (error)=>{
        console.log('OCURRIO UN ERROR:',error)
        return new HttpException('Ocurrio un error', HttpStatus.BAD_REQUEST)
      }
    );
  }

  /**
   * Endpoint para realizar la búsqueda avanzada de productos.
   * 
   * Filtros disponibles: name, category, location.
   * 
   * Parámetros de consulta:
   * - name: Nombre del producto a buscar (opcional).
   * - category: Categoría del producto a buscar (opcional).
   * - location: Ubicación del producto a buscar (opcional).
   * - page: Página actual para paginación (Obligatorio).
   * - limit: Númerode resultados por página (Obligatorio).
   */

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'name', required: false, type: String }) // Parámetro opcional "name"
  @ApiQuery({ name: 'category', required: false, type: String, enum: ProductCategory }) // Parámetro opcional "category"
  @ApiQuery({ name: 'location', required: false, type: String }) // Parámetro opcional "location"
  async search(
    @Query('name') name?: string, // Filtrar por nombre
    @Query('category') category?: ProductCategory, // Filtrar por categoría
    @Query('location') location?: string, // Filtrar por ubicación
    @Query('page', ParseIntPipe) page: number = 1, // Página actual (opcional, por defecto 1)
    @Query('limit', ParseIntPipe) limit: number = 10, // Limite de resultados por página (opcional, por defecto 10)
  ): Promise<Product[] | HttpException> {
    return this.productsService.searchProducts(name, category, location, page, limit).then(
      (products)=>{
        return products
      }
    ).catch(
      (error)=>{
        console.log('Error ')
        return new HttpException('[Error]',HttpStatus.BAD_REQUEST)
      }
    );
  }
}
