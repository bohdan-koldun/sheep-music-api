import { Module } from '@nestjs/common';
import { ParserGateway } from './parser.gateway';
import { SongModule } from '../song/song.module';

@Module({
    imports: [SongModule],
    providers: [ ParserGateway ],
})
export class SocketModule {}
