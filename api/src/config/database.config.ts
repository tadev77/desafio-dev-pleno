import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const isProduction = configService.get('NODE_ENV') === 'production';
  
  const baseConfig = {
    type: 'postgres' as const,
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 5432),
    username: configService.get('DB_USERNAME', 'postgres'),
    password: configService.get('DB_PASSWORD', 'postgres'),
    database: configService.get('DB_NAME', 'desafio_dev_pleno'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: !isProduction,
    logging: configService.get('NODE_ENV') === 'development',
  };

  if (isProduction) {
    return {
      ...baseConfig,
      ssl: {
        rejectUnauthorized: false
      }
    };
  }

  return baseConfig;
}; 