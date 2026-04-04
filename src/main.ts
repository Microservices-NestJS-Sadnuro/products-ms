import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: { port: envs.port }
  });

  // Asegura que se ejecuten las validaciones del class-validator en los request a apis.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Objetos que no están en el DTO son eliminados.
      forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas.
      //transform: true, // Transforma automáticamente los tipos de datos.
    }),
  );

  await app.listen();
  logger.log(`Products Microservice is running on port ${envs.port}`);
}
bootstrap();
