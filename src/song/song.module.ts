import { Module } from '@nestjs/common';
import { songProviders } from './song.providers';
import {
    SongController,
    AlbumController,
} from './controllers';

@Module({
    controllers: [
        SongController,
        AlbumController,
    ],
    providers: [
        ...songProviders,
    ],
    exports: [
        ...songProviders,
    ],
})

export class SongModule { }
