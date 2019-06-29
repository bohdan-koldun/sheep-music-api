import { APP_FILTER } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { SongModule } from './song/song.module';
import { HttpErrorFilter } from './common/filters/http-error.filter';
import { SocketModule } from './socket/socket.module';

@Module({
    imports: [ UserModule, SongModule, SocketModule ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpErrorFilter,
        },
    ],
})
export class ApiModule { }
