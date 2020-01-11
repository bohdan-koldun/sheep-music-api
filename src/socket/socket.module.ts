import { Module } from '@nestjs/common';
import { ParserGateway } from './parser.gateway';
import { ApiModule } from '../api/api.module';

@Module({
    imports: [ApiModule],
    providers: [ ParserGateway ],
})
export class SocketModule {}
