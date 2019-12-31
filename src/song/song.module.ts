import { Module, Global } from '@nestjs/common';
import { songProviders } from './song.providers';
import {
    SongController,
    AlbumController,
    AuthorController,
    VideoController,
    StatisticController,
} from './controllers';

@Global()
@Module({
    controllers: [
        SongController,
        AlbumController,
        AuthorController,
        VideoController,
        StatisticController,
    ],
    providers: [
        ...songProviders,
    ],
    exports: [
        ...songProviders,
    ],
})

export class SongModule { }
