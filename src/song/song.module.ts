import { Module } from '@nestjs/common';
import { songProviders } from './song.providers';
import {
    SongController,
    AlbumController,
    AuthorController,
} from './controllers';

@Module({
    controllers: [
        SongController,
        AlbumController,
        AuthorController,
    ],
    providers: [
        ...songProviders,
    ],
    exports: [
        ...songProviders,
    ],
})

export class SongModule { }
