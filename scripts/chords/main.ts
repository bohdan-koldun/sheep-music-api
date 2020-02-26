import { NestFactory } from '@nestjs/core';
import { ScriptsModule } from '../scripts.module';
import { ConfigService } from 'nestjs-config';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(ScriptsModule);
  app.use(compression());

}
bootstrap();
