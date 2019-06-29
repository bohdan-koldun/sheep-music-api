import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@WebSocketGateway(3334)
export class ParserGateway implements OnGatewayConnection, OnGatewayDisconnect {

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
        // console.log(message)
        return 'received';
    }

}
