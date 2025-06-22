import { readFileSync } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

export interface SSLConfig {
  key: Buffer;
  cert: Buffer;
}

export const getSSLConfig = (configService: ConfigService): SSLConfig | null => {
  const useSSL = configService.get('USE_SSL', 'false') === 'true';
  
  if (!useSSL) {
    return null;
  }

  try {
    const certsPath = join(__dirname, '../../certs');
    const keyPath = join(certsPath, 'localhost+2-key.pem');
    const certPath = join(certsPath, 'localhost+2.pem');

    const key = readFileSync(keyPath);
    const cert = readFileSync(certPath);

    return { key, cert };
  } catch (error) {
    console.warn('SSL certificates not found. Running without HTTPS.');
    console.warn('To enable HTTPS, run: mkcert localhost 127.0.0.1 ::1');
    return null;
  }
}; 