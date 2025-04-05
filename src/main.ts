import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilitar validación global
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Transforma el DTO
    whitelist: true, // Elimina propiedades no definidas en el DTO
    forbidNonWhitelisted: true, // Lanza un error si la petición incluye propiedades no definidas en el DTO
  }));
  const config = new DocumentBuilder()
    .setTitle('Backend Technical challenge')
    .setDescription('Esta API proporciona búsqueda avanzada de productos por nombre, categoría y ubicación. ' +
      'Incluye autocompletado, ranking por relevancia y sugerencias de búsqueda.')
    .setVersion('1.0')
    /* .addTag('') */
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
