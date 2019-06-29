import { Module } from '@nestjs/common';
import { ParserGateway } from './parser.gateway';

@Module({
    providers: [ ParserGateway ],
})
export class SocketModule {}
