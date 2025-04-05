import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto, ProductCategory } from './dto/create-product.dto';

// --- Mock del Repository ---
// Creamos un tipo para nuestro mock del repositorio con las funciones que usa el servicio
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = (): MockRepository<Product> => ({
  create: jest.fn(),
  save: jest.fn(),
  // Mockeamos createQueryBuilder para que devuelva un objeto con los métodos que usamos
  createQueryBuilder: jest.fn(() => ({
    andWhere: jest.fn().mockReturnThis(), // .mockReturnThis() permite encadenar llamadas
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn(), // Este devolverá el resultado final
  })),
});

// --- Suite de Pruebas ---
describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: MockRepository<Product>;
  let mockQueryBuilder; // Para acceder al mock del QueryBuilder dentro de las pruebas

  beforeEach(async () => {
    // Reiniciamos el mock del QueryBuilder antes de cada test
    mockQueryBuilder = {
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product), // Usamos getRepositoryToken para obtener el token correcto
          useValue: { // Proporcionamos nuestro mock como valor
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(() => mockQueryBuilder), // Usamos el mockQueryBuilder reiniciado
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    // Obtenemos una referencia a nuestro mock para poder configurar y espiar sus métodos
    productRepository = module.get<MockRepository<Product>>(
      getRepositoryToken(Product),
    );
  });

  // --- Prueba básica ---
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Pruebas para el método `create` ---
  describe('create', () => {
    it('should create and save a new product', async () => {
      // Arrange: Preparamos los datos y los mocks
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        category: ProductCategory.ELECTRONICS,
        location: 'Test Location',
      };
      const mockProduct = { id: 'uuid-1', ...createProductDto }; // Simulamos lo que devolvería repository.create
      const mockSavedProduct = { id: 'uuid-1', ...createProductDto }; // Simulamos lo que devolvería repository.save

      // Configuramos los mocks para que devuelvan los valores simulados
      productRepository.create.mockReturnValue(mockProduct); // repository.create devuelve el objeto sin guardar
      productRepository.save.mockResolvedValue(mockSavedProduct); // repository.save devuelve una promesa con el objeto guardado

      // Act: Ejecutamos el método a probar
      const result = await service.create(createProductDto);

      // Assert: Verificamos que todo funcionó como se esperaba
      expect(productRepository.create).toHaveBeenCalledWith(createProductDto); // Verificamos que create fue llamado con el DTO
      expect(productRepository.save).toHaveBeenCalledWith(mockProduct); // Verificamos que save fue llamado con el objeto creado
      expect(result).toEqual(mockSavedProduct); // Verificamos que el resultado del servicio es el producto guardado
      expect(console.log).toHaveBeenCalledWith('createProductDto:', createProductDto); // Opcional: si quieres verificar los logs
      expect(console.log).toHaveBeenCalledWith('product:', mockProduct); // Opcional: si quieres verificar los logs
    });
  });

  // --- Pruebas para el método `searchProducts` ---
  describe('searchProducts', () => {
    const mockProducts: Product[] = [
      { id: 1, name: 'Laptop', category: ProductCategory.ELECTRONICS, location: 'City A' },
      { id: 2, name: 'Keyboard', category: ProductCategory.ELECTRONICS, location: 'City B' },
    ];

    beforeEach(() => {
      // Reseteamos las llamadas a los mocks del query builder antes de cada test de search
       mockQueryBuilder.andWhere.mockClear();
       mockQueryBuilder.skip.mockClear();
       mockQueryBuilder.take.mockClear();
       mockQueryBuilder.getMany.mockClear();
       // Aseguramos que createQueryBuilder se resetea y devuelve el mockQueryBuilder actualizado
       (productRepository.createQueryBuilder as jest.Mock).mockClear().mockReturnValue(mockQueryBuilder);
    });

    it('should search products with default pagination and no filters', async () => {
      // Arrange
      const defaultPage = 1;
      const defaultLimit = 10;
      mockQueryBuilder.getMany.mockResolvedValue(mockProducts); // Simulamos el resultado de getMany

      // Act
      const result = await service.searchProducts();

      // Assert
      expect(productRepository.createQueryBuilder).toHaveBeenCalledWith('product'); // Verifica que se inicia el query builder con el alias correcto
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled(); // No se deben aplicar filtros 'andWhere'
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith((defaultPage - 1) * defaultLimit); // Verifica el skip por defecto
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(defaultLimit); // Verifica el take por defecto
      expect(mockQueryBuilder.getMany).toHaveBeenCalledTimes(1); // Verifica que se llama a getMany
      expect(result).toEqual(mockProducts); // Verifica el resultado
    });

    it('should search products with name filter', async () => {
      // Arrange
      const name = 'Laptop';
      mockQueryBuilder.getMany.mockResolvedValue([mockProducts[0]]);

      // Act
      const result = await service.searchProducts(name);

      // Assert
      expect(productRepository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('product.name LIKE :name', { name: `%${name}%` }); // Verifica filtro de nombre
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0); // Verifica skip por defecto
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10); // Verifica take por defecto
      expect(mockQueryBuilder.getMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockProducts[0]]);
    });

     it('should search products with category filter', async () => {
      // Arrange
      const category = ProductCategory.ELECTRONICS;
      mockQueryBuilder.getMany.mockResolvedValue(mockProducts);

      // Act
      const result = await service.searchProducts(undefined, category);

      // Assert
      expect(productRepository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('product.category = :category', { category }); // Verifica filtro de categoría
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.getMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProducts);
    });

    it('should search products with location filter', async () => {
      // Arrange
      const location = 'City A';
       mockQueryBuilder.getMany.mockResolvedValue([mockProducts[0]]);

      // Act
      const result = await service.searchProducts(undefined, undefined, location);

      // Assert
      expect(productRepository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('product.location LIKE :location', { location: `%${location}%` }); // Verifica filtro de ubicación
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.getMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockProducts[0]]);
    });

     it('should search products with all filters and custom pagination', async () => {
      // Arrange
      const name = 'Key';
      const category = ProductCategory.ELECTRONICS;
      const location = 'City B';
      const page = 2;
      const limit = 5;
      mockQueryBuilder.getMany.mockResolvedValue([mockProducts[1]]); // Simulamos que solo encuentra el teclado en la página 2

      // Act
      const result = await service.searchProducts(name, category, location, page, limit);

      // Assert
      expect(productRepository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('product.name LIKE :name', { name: `%${name}%` });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('product.category = :category', { category });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('product.location LIKE :location', { location: `%${location}%` });
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith((page - 1) * limit); // Verifica skip personalizado
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(limit); // Verifica take personalizado
      expect(mockQueryBuilder.getMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockProducts[1]]);
    });
  });

  // --- Opcional: Mockear console.log para evitar ruido en la salida de las pruebas ---
  // Si quieres que los console.log no aparezcan durante las pruebas, puedes mockearlos
  let consoleLogSpy: jest.SpyInstance;

  beforeAll(() => {
    // Guardamos la implementación original y la reemplazamos por un mock
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    // Restauramos la implementación original de console.log después de todas las pruebas
    consoleLogSpy.mockRestore();
  });

});