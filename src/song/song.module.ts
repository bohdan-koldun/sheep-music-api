import { Module, Global, CacheInterceptor, CacheModule } from '@nestjs/common';
import { songProviders } from './song.providers';
import {
    SongController,
    AlbumController,
    AuthorController,
    VideoController,
    StatisticController,
} from './controllers';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Global()

@Module({
    imports: [CacheModule.register()],
    controllers: [
        SongController,
        AlbumController,
        AuthorController,
        VideoController,
        StatisticController,

    ],
    providers: [
        ...songProviders,
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
    ],
    exports: [
        ...songProviders,
    ],
})

export class SongModule { }
