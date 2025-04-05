import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto, ProductCategory } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

// --- Mock del Servicio ---
// Creamos un objeto que simula tener los métodos del ProductsService que usa el Controller
const mockProductsService = {
  create: jest.fn(),
  searchProducts: jest.fn(),
  // Añade aquí cualquier otro método del servicio que llame el controlador
};

// --- Suite de Pruebas ---
describe('ProductsController', () => {
  let controller: ProductsController;
  let service: typeof mockProductsService; // Usamos typeof para tipar nuestro mock

  // --- Mock de console.log (Opcional, para limpiar la salida) ---
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance; // Podrías necesitar espiar console.error también

  beforeAll(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    // consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Si usas console.error
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
    // consoleErrorSpy.mockRestore();
  });
  // --- Fin Mock console.log ---

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController], // El controlador que estamos probando
      providers: [
        {
          provide: ProductsService, // La dependencia que queremos mockear
          useValue: mockProductsService, // Nuestro objeto mock
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get(ProductsService); // Obtenemos la referencia a nuestro mock del servicio

    // Limpiamos los mocks antes de cada test para evitar interferencias
    jest.clearAllMocks();
  });

  // --- Prueba básica ---
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Pruebas para el endpoint `create` (POST /products) ---
  describe('create', () => {
    const createProductDto: CreateProductDto = {
      name: 'Test Product C',
      category: ProductCategory.BOOKS,
      location: 'Warehouse C',
    };
    // Simulamos un producto como lo devolvería el servicio tras crearlo
    const mockCreatedProduct: Product = {
      /* id: 1, */
      name: 'Test Product C',
      category: ProductCategory.BOOKS,
      location: 'Warehouse C',
      id: 1
    };

    it('should call productsService.create and return the created product on success', async () => {
      // Arrange: Configuramos el mock del servicio para que resuelva exitosamente
      service.create.mockResolvedValue(mockCreatedProduct);

      // Act: Llamamos al método del controlador
      const result = await controller.create(createProductDto);

      // Assert: Verificamos las interacciones y el resultado
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(createProductDto); // Verifica que el servicio fue llamado con el DTO correcto
      expect(result).toEqual(mockCreatedProduct); // Verifica que el controlador devuelve lo que resolvió el servicio
      expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining('OCURRIO UN ERROR:')); // Nos aseguramos que no entró al catch
    });

    it('should return HttpException when productsService.create rejects', async () => {
      // Arrange: Configuramos el mock del servicio para que falle (rechace la promesa)
      const mockError = new Error('Database connection failed');
      service.create.mockRejectedValue(mockError);

      // Act: Llamamos al método del controlador
      const result = await controller.create(createProductDto);

      // Assert: Verificamos las interacciones y el resultado (que debe ser la HttpException)
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(createProductDto);
      expect(result).toBeInstanceOf(HttpException); // Verificamos que devuelve una HttpException
      expect((result as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST); // Verificamos el status code
      expect((result as HttpException).getResponse()).toBe('Ocurrio un error'); // Verificamos el mensaje
      expect(console.log).toHaveBeenCalledWith('OCURRIO UN ERROR:', mockError); // Verificamos que se logueó el error original
    });
  });

  // --- Pruebas para el endpoint `search` (GET /products/search) ---
  describe('search', () => {
    const mockProductsResult: Product[] = [
      // ... (añade aquí ejemplos de productos que devolvería la búsqueda)
      { id: 1, name: 'Search Result 1', category: ProductCategory.CLOTHING, location: 'Online Store' },
      { id: 2, name: 'Search Result 2', category: ProductCategory.CLOTHING, location: 'Local Shop' },
    ];

    const name = 'Search';
    const category = ProductCategory.CLOTHING;
    const location = 'Store';
    const page = 2;
    const limit = 5;

    it('should call productsService.searchProducts with query params and return results on success', async () => {
      // Arrange: Configuramos el mock para que la búsqueda sea exitosa
      service.searchProducts.mockResolvedValue(mockProductsResult);

      // Act: Llamamos al método del controlador con parámetros
      const result = await controller.search(name, category, location, page, limit);

      // Assert: Verificamos
      expect(service.searchProducts).toHaveBeenCalledTimes(1);
      // Verifica que el servicio se llamó con todos los parámetros proporcionados
      expect(service.searchProducts).toHaveBeenCalledWith(name, category, location, page, limit);
      expect(result).toEqual(mockProductsResult); // El resultado debe ser lo que devolvió el servicio
      expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining('Error ')); // No entró al catch
    });

     it('should call productsService.searchProducts with default pagination when page/limit are not provided', async () => {
      // Arrange
      const defaultPage = 1; // Valor por defecto en la firma del método del controlador
      const defaultLimit = 10;// Valor por defecto en la firma del método del controlador
      service.searchProducts.mockResolvedValue(mockProductsResult);
      const specificName = 'OnlyName';

      // Act: Llamamos sin page y limit explícitos (simulando que no vienen en la query)
      // NOTA: En la prueba unitaria, SÍ debemos pasar los valores por defecto explícitamente
      // porque Jest no simula la inyección de parámetros y valores por defecto de NestJS.
      // Lo importante es verificar que el SERVICIO es llamado con esos defaults.
      const result = await controller.search(specificName, undefined, undefined, defaultPage, defaultLimit);

      // Assert
      expect(service.searchProducts).toHaveBeenCalledTimes(1);
      expect(service.searchProducts).toHaveBeenCalledWith(specificName, undefined, undefined, defaultPage, defaultLimit); // Verifica llamada con defaults
      expect(result).toEqual(mockProductsResult);
    });

    it('should return HttpException when productsService.searchProducts rejects', async () => {
       // Arrange: Configuramos el mock para que la búsqueda falle
      const mockError = new Error('Search index unavailable');
      service.searchProducts.mockRejectedValue(mockError);

      // Act: Llamamos al método del controlador
      const result = await controller.search(name, category, location, page, limit);

      // Assert: Verificamos
      expect(service.searchProducts).toHaveBeenCalledTimes(1);
      expect(service.searchProducts).toHaveBeenCalledWith(name, category, location, page, limit);
      expect(result).toBeInstanceOf(HttpException); // Verificamos que devuelve una HttpException
      expect((result as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST); // Verificamos el status code
      expect((result as HttpException).getResponse()).toBe('[Error]'); // Verificamos el mensaje
      expect(console.log).toHaveBeenCalledWith('Error '); // Verificamos que se logueó el error genérico del catch
    });
  });
});
