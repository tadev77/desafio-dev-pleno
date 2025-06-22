import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { getSSLConfig } from './config/ssl.config';

async function bootstrap() {
  const configService = new ConfigService();
  const sslConfig = getSSLConfig(configService);
  
  let fastifyAdapter: FastifyAdapter;
  
  if (sslConfig) {
    // Configurar Fastify com HTTPS
    fastifyAdapter = new FastifyAdapter({
      https: {
        key: sslConfig.key,
        cert: sslConfig.cert,
      },
    });
  } else {
    // Configurar Fastify sem HTTPS
    fastifyAdapter = new FastifyAdapter();
  }

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter
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
    'https://localhost:3000',
    'https://127.0.0.1:3000',
    'https://localhost:3001',
    'https://127.0.0.1:3001',
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

  const port = configService.get('PORT', 3001);
  const host = '0.0.0.0';
  
  await app.listen(port, host);
  
  if (sslConfig) {
    console.log(`🚀 Application is running on: https://localhost:${port}`);
    console.log(`📚 Swagger documentation available at: https://localhost:${port}/swagger`);
  } else {
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📚 Swagger documentation available at: http://localhost:${port}/swagger`);
  }
}
bootstrap();
