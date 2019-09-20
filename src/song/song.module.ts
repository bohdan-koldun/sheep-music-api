import { Module } from '@nestjs/common';
import { songProviders } from './song.providers';
import {
    SongController,
    AlbumController,
    AuthorController,
    VideoController,
} from './controllers';

@Module({
    controllers: [
        SongController,
        AlbumController,
        AuthorController,
        VideoController,
    ],
    providers: [
        ...songProviders,
    ],
    exports: [
        ...songProviders,
    ],
})

export class SongModule { }
