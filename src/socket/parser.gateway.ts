import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, Inject } from '@nestjs/common';
import { SongParserService } from '../song/services';

@WebSocketGateway(3334)
export class ParserGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @Inject()
    private readonly songService: SongParserService;
    private readonly songList: any[] = [];

    @WebSocketServer() server;
    users: number = 0;

    async handleConnection() {
        this.users++;
        Logger.log('socket gateway: new user connected');
        this.server.emit('users', this.users);
    }

    async handleDisconnect() {
        this.users--;
        Logger.log('socket gateway: user disconnected');
        this.server.emit('users', this.users);
    }

    @SubscribeMessage('new parsed song')
    async onNewSong(client, message) {
        this.songList.push(message);
        return 'received';
    }

    @SubscribeMessage('last parsed song')
    async onLastNewSong(client, message) {
        Logger.log(`Finish of parsing. Total song: ${this.songList.length}`);

        for (const song of this.songList) {
            await this.songService.saveParsedSong(song);
        }

        return 'received';
    }
}
