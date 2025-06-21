import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  const swaggerConfig = new DocumentBuilder()
  .setTitle('Desafio Técnico - Backend')
    .setDescription('API para sistema de movimentações financeiras')
  .setVersion('1.0')
    .addBearerAuth()
    .addTag('Autenticação', 'Endpoints para login e registro de usuários')
  .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, swaggerDocument);

  // Configuração de CORS para desenvolvimento e produção
  const allowedOrigins: (string | RegExp)[] = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    /^https:\/\/.*\.vercel\.app$/,
    /^https:\/\/.*\.vercel\.dev$/,
  ];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200, // Para compatibilidade com alguns navegadores
  });

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();
