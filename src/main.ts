import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from 'nestjs-config';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression());
  const options = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };
  app.enableCors(options);
  const configService: ConfigService = app.get(ConfigService);
  await app.listen(configService.get('app.port'));

}
bootstrap();
