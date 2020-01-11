import { Module, Global, CacheInterceptor, CacheModule } from '@nestjs/common';
import { apiProviders } from './api.providers';
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
        ...apiProviders,
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
    ],
    exports: [
        ...apiProviders,
    ],
})

export class ApiModule { }
