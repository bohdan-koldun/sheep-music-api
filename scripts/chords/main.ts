import { NestFactory } from '@nestjs/core';
import { ScriptsModule } from '../scripts.module';
import {  ChordsScriptsService } from './service';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(ScriptsModule);
  app.use(compression());

  const chordsScripts = app.get(ChordsScriptsService);

  await chordsScripts.updateChodsKey();

  // await chordsScripts.replaceChordH();

}
bootstrap();
